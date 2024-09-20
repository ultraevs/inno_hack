package controller

import (
	"app/internal/database"
	"app/internal/model"
	"database/sql"
	"github.com/gin-gonic/gin"
	"net/http"
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
	var body struct {
		Name        string
		Description string
	}
	if context.Bind(&body) != nil {
		context.JSON(http.StatusBadRequest, gin.H{"error": "Failed to read body"})
		return
	}

	// Получаем email пользователя из токена
	userEmail := context.MustGet("Email").(string)

	var userID int
	err := database.Db.QueryRow("SELECT id FROM notion_users WHERE email = $1", userEmail).Scan(&userID)
	if err != nil {
		context.JSON(http.StatusInternalServerError, gin.H{"error": "User not found"})
		return
	}

	// Создаем проект с видом по умолчанию "text"
	_, err = database.Db.Exec("INSERT INTO notion_projects (name, description, owner_id, view_mode) VALUES ($1, $2, $3, 'text')", body.Name, body.Description, userID)
	if err != nil {
		context.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create project"})
		return
	}
	context.JSON(http.StatusOK, gin.H{"message": "Project created successfully"})
}

// ChangeProjectView меняет вид проекта.
// @Summary Изменить вид проекта
// @Description Меняет вид проекта: текстовый или таблица задач.
// @Accept json
// @Produce json
// @Param project_id path int true "ID проекта"
// @Param request body model.ChangeViewRequest true "Запрос на смену вида проекта"
// @Success 200 {object} model.CodeResponse "Вид проекта успешно изменен"
// @Failure 400 {object} model.ErrorResponse "Ошибка при изменении вида проекта"
// @Tags Project
// @Router /v1/projects/{project_id}/view [put]
func ChangeProjectView(context *gin.Context) {
	projectID := context.Param("project_id")
	var body struct {
		ViewMode string // 'text' или 'task_table'
	}

	if context.Bind(&body) != nil || (body.ViewMode != "text" && body.ViewMode != "task_table") {
		context.JSON(http.StatusBadRequest, gin.H{"error": "Invalid view mode"})
		return
	}

	_, err := database.Db.Exec("UPDATE notion_projects SET view_mode = $1 WHERE id = $2", body.ViewMode, projectID)
	if err != nil {
		context.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update project view"})
		return
	}

	context.JSON(http.StatusOK, gin.H{"message": "Project view updated successfully", "new_view": body.ViewMode})
}

// GetProjectDetails возвращает детали проекта.
// @Summary Получить детали проекта
// @Description Возвращает детали проекта в зависимости от текущего вида: текст или таблица задач.
// @Produce json
// @Param project_id path int true "ID проекта"
// @Success 200 {object} model.ProjectDetailsResponse "Детали проекта"
// @Failure 400 {object} model.ErrorResponse "Ошибка при получении данных проекта"
// @Tags Project
// @Router /v1/projects/{project_id} [get]
func GetProjectDetails(context *gin.Context) {
	projectID := context.Param("project_id")

	var viewMode string
	err := database.Db.QueryRow("SELECT view_mode FROM notion_projects WHERE id = $1", projectID).Scan(&viewMode)
	if err != nil {
		context.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve project view mode"})
		return
	}

	switch viewMode {
	case "text":
		// Логика для отображения текстового проекта
		var content string
		err := database.Db.QueryRow("SELECT content FROM notion_text_projects WHERE project_id = $1", projectID).Scan(&content)
		if err != nil {
			context.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve text content"})
			return
		}
		context.JSON(http.StatusOK, gin.H{"content": content})
	case "task_table":
		// Логика для отображения таблицы задач
		rows, err := database.Db.Query("SELECT id, title, description, status, assignee_id, deadline, start_time, end_time, duration FROM notion_tasks WHERE project_id = $1", projectID)
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
			err = rows.Scan(&task.ID, &task.Title, &task.Description, &task.Status, &task.AssigneeID, &task.Deadline, &task.StartTime, &task.EndTime, &task.Duration)
			if err != nil {
				context.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve task details"})
				return
			}
			tasks = append(tasks, task)
		}
		context.JSON(http.StatusOK, gin.H{"tasks": tasks})
	default:
		context.JSON(http.StatusBadRequest, gin.H{"error": "Unknown view mode"})
	}
}

// GetProjects возвращает список проектов для пользователя
// @Summary Получить проекты пользователя
// @Description Возвращает все проекты, где пользователь является участником или владельцем
// @Produce json
// @Success 200 {object} model.UserProjectsResponse "Список проектов"
// @Failure 400 {object} model.ErrorResponse "Ошибка при получении проектов"
// @Tags Projects
// @Router /user/projects [get]
func GetProjects(context *gin.Context) {
	// Извлекаем email пользователя из контекста
	userEmail := context.MustGet("Email").(string)

	// Находим ID пользователя по email
	var userID int
	err := database.Db.QueryRow("SELECT id FROM notion_users WHERE email = $1", userEmail).Scan(&userID)
	if err != nil {
		context.JSON(http.StatusUnauthorized, gin.H{"error": "User not found"})
		return
	}

	// Запрашиваем проекты, где пользователь является владельцем
	rows, err := database.Db.Query(`
		SELECT p.id, p.name, p.description, p.owner_id, p.created_at, p.updated_at, p.view_mode
		FROM notion_projects p
		WHERE p.owner_id = $1`, userID)
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
		if err := rows.Scan(&project.ID, &project.Name, &project.Description, &project.OwnerID, &project.CreatedAt, &project.UpdatedAt, &project.ViewMode); err != nil {
			context.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to scan project"})
			return
		}
		projects = append(projects, project)
	}

	// Возвращаем список проектов
	context.JSON(http.StatusOK, gin.H{"projects": projects})
}
