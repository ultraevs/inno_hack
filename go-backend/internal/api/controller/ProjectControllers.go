package controller

import (
	"app/internal/api/templates"
	"app/internal/database"
	"app/internal/model"
	"database/sql"
	"errors"
	"fmt"
	"github.com/gin-gonic/gin"
	"net/http"
	"os"
	"strings"
)

// ProjectCreate создает новый проект с видом по умолчанию "text".
// @Summary Создать новый проект
// @Description Создает новый проект, который по умолчанию является текстовым проектом. Вид можно поменять на таблицу задач.
// @Accept json
// @Produce json
// @Param request body model.ProjectCreateRequest true "Запрос на создание проекта"
// @Success 200 {object} model.CodeResponse "Проект успешно создан"
// @Failure 400 {object} model.ErrorResponse "Ошибка при создании проекта"
// @Tags Project
// @Router /v1/project_create [post]
func ProjectCreate(context *gin.Context) {
	var body model.ProjectCreateRequest

	if context.Bind(&body) != nil {
		context.JSON(http.StatusBadRequest, gin.H{"error": "Failed to read body"})
		return
	}

	// Получаем email пользователя из токена
	userEmail := context.MustGet("Email").(string)

	var userName string
	err := database.Db.QueryRow("SELECT name FROM notion_users WHERE email = $1", userEmail).Scan(&userName)
	if err != nil {
		context.JSON(http.StatusInternalServerError, gin.H{"error": "User not found"})
		return
	}

	// Создаем проект с видом по умолчанию "text" и получаем ID созданного проекта
	var projectID int
	err = database.Db.QueryRow("INSERT INTO notion_projects (name, owner_name, figma_link) VALUES ($1, $2, $3) RETURNING id",
		body.ProjectName, userName, body.LinkToFigma).Scan(&projectID)

	if err != nil {
		context.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create project"})
		return
	}

	// Добавляем владельца проекта в список участников как "owner"
	_, err = database.Db.Exec(`INSERT INTO notion_project_users (project_id, user_name, role) VALUES ($1, $2, $3)`,
		projectID, userName, "owner")
	if err != nil {
		context.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to add project owner to users"})
		return
	}

	// Добавляем пользователей, указанных в запросе
	for _, user := range body.Users {
		// Проверяем, существует ли пользователь в базе
		var existingUserName string
		err = database.Db.QueryRow("SELECT name FROM notion_users WHERE name = $1", user.Username).Scan(&existingUserName)
		if errors.Is(err, sql.ErrNoRows) {
			// Если пользователь не найден, возвращаем ошибку
			context.JSON(http.StatusBadRequest, gin.H{"error": fmt.Sprintf("User %s not found", user.Username)})
			return
		} else if err != nil {
			context.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to check user existence"})
			return
		}

		// Инициализируем отправителя email
		sender := NewGmailSender("PLANIFY", os.Getenv("EMAIL_ADDRESS"), os.Getenv("EMAIL_PASSWORD"))

		// Добавляем пользователей, указанных в запросе
		for _, user := range body.Users {
			// Проверяем, существует ли пользователь в базе
			var existingUserName, userEmail string
			err = database.Db.QueryRow("SELECT name, email FROM notion_users WHERE name = $1", user.Username).Scan(&existingUserName, &userEmail)
			if errors.Is(err, sql.ErrNoRows) {
				// Если пользователь не найден, возвращаем ошибку
				context.JSON(http.StatusBadRequest, gin.H{"error": fmt.Sprintf("User %s not found", user.Username)})
				return
			} else if err != nil {
				context.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to check user existence"})
				return
			}

			// Добавляем пользователя в проект
			_, err = database.Db.Exec(`INSERT INTO notion_project_invitations (project_id,project_name, inviter_name, invitee_name, role) VALUES ($1, $2, $3, $4, $5)`,
				projectID, body.ProjectName, userName, user.Username, user.Role)
			if err != nil {
				fmt.Println(err)
				context.JSON(http.StatusInternalServerError, gin.H{"error": fmt.Sprintf("Failed to add user %s to project", user.Username)})
				return
			}

			// Подготовка данных для подстановки в шаблон
			invitationLink := fmt.Sprintf("https://task.shmyaks.ru/invite/%d", projectID)
			data := struct {
				ProjectName    string
				InviterName    string
				InvitationLink string
			}{
				ProjectName:    body.ProjectName,
				InviterName:    userName,
				InvitationLink: invitationLink,
			}

			// Формируем тело письма
			var contentBuilder strings.Builder
			template := templates.ProjectInvitationTemplate()
			err = template.Execute(&contentBuilder, data)
			if err != nil {
				context.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to generate email content"})
				return
			}
			content := contentBuilder.String()

			// Отправляем email-приглашение пользователю
			subject := "Приглашение в проект"
			to := []string{userEmail}
			err = sender.SendEmail(subject, content, to, nil, nil)
			if err != nil {
				fmt.Println(err)
				context.JSON(http.StatusInternalServerError, gin.H{"error": fmt.Sprintf("Error sending email to user %s", user.Username)})
				return
			}
		}

		context.JSON(http.StatusOK, gin.H{"message": "Project created successfully, invitations sent", "project_id": projectID})
	}
}

// GetProjectDetails возвращает детали проекта, включая текст и задачи
// @Summary Получить детали проекта
// @Description Возвращает текстовое содержание и задачи проекта.
// @Produce json
// @Param project_id path int true "ID проекта"
// @Success 200 {object} model.ProjectDetailsResponse "Детали проекта"
// @Failure 400 {object} model.ErrorResponse "Ошибка при получении данных проекта"
// @Tags Project
// @Router /v1/projects/{project_id} [get]
func GetProjectDetails(context *gin.Context) {
	projectID := context.Param("project_id")

	// Логика для текстового содержимого: получаем все блоки контента
	contentRows, err := database.Db.Query(`
		SELECT id, content_type, content, order_num 
		FROM notion_project_content_blocks 
		WHERE project_id = $1 ORDER BY order_num`, projectID)

	if err != nil {
		context.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve content blocks"})
		return
	}
	defer func(contentRows *sql.Rows) {
		err := contentRows.Close()
		if err != nil {

		}
	}(contentRows)

	var contentBlocks []model.ContentBlockResponse
	for contentRows.Next() {
		var block model.ContentBlockResponse
		if err := contentRows.Scan(&block.ID, &block.ContentType, &block.Content, &block.OrderNum); err != nil {
			context.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to scan content block"})
			return
		}
		contentBlocks = append(contentBlocks, block)
	}

	// Логика для таблицы задач
	rows, err := database.Db.Query("SELECT id, title, description, status, assignee_name, deadline, start_time, end_time, duration FROM notion_tasks WHERE project_id = $1", projectID)
	if err != nil {
		context.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve tasks"})
		return
	}
	defer func(rows *sql.Rows) {
		err := rows.Close()
		if err != nil {

		}
	}(rows)

	var tasks []model.TaskDetails
	for rows.Next() {
		var task model.TaskDetails
		err = rows.Scan(&task.ID, &task.Title, &task.Description, &task.Status, &task.AssigneeName, &task.Deadline, &task.StartTime, &task.EndTime, &task.Duration)
		if err != nil {
			context.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve task details"})
			return
		}
		tasks = append(tasks, task)
	}

	// Возвращаем и текст, и задачи
	context.JSON(http.StatusOK, gin.H{
		"text_content": contentBlocks,
		"tasks":        tasks,
	})
}

// GetProjects возвращает список проектов для пользователя
// @Summary Получить проекты пользователя
// @Description Возвращает все проекты, где пользователь является участником или владельцем
// @Produce json
// @Success 200 {object} model.UserProjectsResponse "Список проектов"
// @Failure 400 {object} model.ErrorResponse "Ошибка при получении проектов"
// @Tags Project
// @Router /v1/user/projects [get]
func GetProjects(context *gin.Context) {
	// Извлекаем email пользователя из контекста
	userEmail := context.MustGet("Email").(string)

	// Находим ID пользователя по email
	var userName string
	err := database.Db.QueryRow("SELECT name FROM notion_users WHERE email = $1", userEmail).Scan(&userName)
	if err != nil {
		context.JSON(http.StatusUnauthorized, gin.H{"error": "User not found"})
		return
	}

	// Запрашиваем проекты, где пользователь является владельцем
	rows, err := database.Db.Query(`
		SELECT p.id, p.name, p.description, p.owner_name, p.created_at, p.updated_at, p.figma_link
		FROM notion_projects p
		WHERE p.owner_name = $1`, userName)
	if err != nil {
		context.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve projects"})
		return
	}
	defer func(rows *sql.Rows) {
		err := rows.Close()
		if err != nil {

		}
	}(rows)

	// Формируем список проектов
	var projects []model.Project
	for rows.Next() {
		var project model.Project
		if err := rows.Scan(&project.ID, &project.Name, &project.Description, &project.OwnerName, &project.CreatedAt, &project.UpdatedAt, &project.Figma); err != nil {
			fmt.Println(err)
			context.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to scan project"})
			return
		}
		projects = append(projects, project)
	}

	// Возвращаем список проектов
	context.JSON(http.StatusOK, gin.H{"projects": projects})
}

// GetProjectUsers возвращает список участников проекта
// @Summary Получить список участников проекта
// @Description Возвращает список всех пользователей, работающих над проектом, включая владельца
// @Produce json
// @Param project_id path int true "ID проекта"
// @Success 200 {array} model.UserDetails "Список участников проекта"
// @Failure 400 {object} model.ErrorResponse "Неверный запрос"
// @Failure 500 {object} model.ErrorResponse "Ошибка сервера"
// @Tags Project
// @Router /v1/projects/{project_id}/users [get]
func GetProjectUsers(context *gin.Context) {
	projectID := context.Param("project_id")

	// Выполняем запрос для получения списка участников
	rows, err := database.Db.Query(`
		SELECT u.name, u.email, pu.role
		FROM notion_users u
		JOIN notion_project_users pu ON u.name = pu.user_name
		WHERE pu.project_id = $1`, projectID)

	if err != nil {
		fmt.Println(err)
		context.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve project users"})
		return
	}
	defer func(rows *sql.Rows) {
		err := rows.Close()
		if err != nil {

		}
	}(rows)

	var users []model.UserDetails
	for rows.Next() {
		var user model.UserDetails
		if err := rows.Scan(&user.Name, &user.Email, &user.Role); err != nil {
			context.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to scan user"})
			return
		}
		users = append(users, user)
	}

	context.JSON(http.StatusOK, gin.H{"users": users})
}
