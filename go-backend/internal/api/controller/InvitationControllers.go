package controller

import (
	"app/internal/database"
	"app/internal/model"
	"database/sql"
	"fmt"
	"github.com/gin-gonic/gin"
	"net/http"
)

// InviteUserToProject отправляет приглашение пользователю присоединиться к проекту
// @Summary Пригласить пользователя в проект
// @Description Отправляет приглашение пользователю присоединиться к проекту, используя имя для поиска email
// @Accept json
// @Produce json
// @Param project_id path int true "ID проекта"
// @Param request body model.ProjectInvitationRequest true "Запрос на приглашение пользователя"
// @Success 200 {object} model.CodeResponse "Приглашение успешно отправлено"
// @Failure 400 {object} model.ErrorResponse "Ошибка при отправке приглашения"
// @Tags Invitations
// @Router /v1/projects/{project_id}/invite [post]
func InviteUserToProject(context *gin.Context) {
	projectID := context.Param("project_id")
	var body model.ProjectInvitationRequest
	if context.Bind(&body) != nil {
		context.JSON(http.StatusBadRequest, gin.H{"error": "Failed to read body"})
		return
	}
	// Извлекаем email текущего пользователя из куки
	inviterEmail := context.MustGet("Email").(string)

	// Находим отправителя по его email
	var inviterName string
	err := database.Db.QueryRow("SELECT name FROM notion_users WHERE email = $1", inviterEmail).Scan(&inviterName)
	if err != nil {
		context.JSON(http.StatusUnauthorized, gin.H{"error": "Inviter not found"})
		return
	}

	// Проверяем, не существует ли уже активного приглашения для этого пользователя
	var existingStatus string
	err = database.Db.QueryRow(`SELECT status FROM project_invitations WHERE project_id = $1 AND invitee_name = $2`,
		projectID, body.InviteeName).Scan(&existingStatus)

	if err == nil && existingStatus == "pending" {
		context.JSON(http.StatusBadRequest, gin.H{"error": "Invitation already pending"})
		return
	}

	// Добавляем новое приглашение
	_, err = database.Db.Exec(`INSERT INTO notion_project_invitations (project_id, invitee_name, inviter_name, status, role)
		VALUES ($1, $2, $3, 'pending', $4)`, projectID, body.InviteeName, inviterName, body.Role)

	if err != nil {
		fmt.Println(err)
		context.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to send invitation"})
		return
	}

	context.JSON(http.StatusOK, gin.H{"message": "Invitation sent successfully"})
}

// RespondToInvitation обрабатывает ответ на приглашение (принятие или отклонение)
// @Summary Ответить на приглашение в проект
// @Description Позволяет пользователю принять или отклонить приглашение
// @Accept json
// @Produce json
// @Param invitation_id path int true "ID приглашения"
// @Param request body model.InvitationResponseRequest true "Запрос на принятие или отклонение приглашения"
// @Success 200 {object} model.CodeResponse "Приглашение обработано успешно"
// @Failure 400 {object} model.ErrorResponse "Ошибка при обработке приглашения"
// @Tags Invitations
// @Router /v1/invitations/{invitation_id}/respond [post]
func RespondToInvitation(context *gin.Context) {
	invitationID := context.Param("invitation_id")
	var body model.InvitationResponseRequest

	if err := context.ShouldBindJSON(&body); err != nil {
		context.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request"})
		return
	}

	// Получаем email текущего пользователя из куки
	userEmail := context.MustGet("Email").(string)

	var userName string
	err := database.Db.QueryRow("SELECT name FROM notion_users WHERE email = $1", userEmail).Scan(&userName)
	if err != nil {
		context.JSON(http.StatusUnauthorized, gin.H{"error": "Inviter not found"})
		return
	}

	// Обновляем статус приглашения для пользователя
	_, err = database.Db.Exec(`UPDATE notion_project_invitations SET status = $1 WHERE id = $2 AND invitee_name = $3`,
		body.Response, invitationID, userName)

	if err != nil {
		context.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to respond to invitation"})
		return
	}

	// Если пользователь принял приглашение, добавляем его в проект
	if body.Response == "accepted" {
		var projectID int
		var role string
		err = database.Db.QueryRow(`SELECT project_id, role FROM notion_project_invitations WHERE id = $1`, invitationID).Scan(&projectID, &role)
		if err != nil {
			context.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve project details"})
			return
		}

		// Добавляем пользователя в проект
		_, err := database.Db.Exec(`INSERT INTO notion_project_users (project_id, role, user_name) VALUES ($1, $2, $3)`, projectID, role, userName)
		if err != nil {
			context.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to add user to project"})
			return
		}
	}

	context.JSON(http.StatusOK, gin.H{"message": "Invitation response processed successfully"})
}

// GetUserInvitations возвращает список приглашений для пользователя
// @Summary Получить приглашения для пользователя
// @Description Возвращает список приглашений, отправленных пользователю, идентифицированному по email из cookies
// @Produce json
// @Success 200 {object} model.UserInvitationsResponse "Список приглашений"
// @Failure 400 {object} model.ErrorResponse "Ошибка при получении приглашений"
// @Tags Invitations
// @Router /v1/user/invitations [get]
func GetUserInvitations(context *gin.Context) {
	// Извлекаем email пользователя из cookies
	userEmail := context.MustGet("Email").(string)

	var userName string
	err := database.Db.QueryRow("SELECT name FROM notion_users WHERE email = $1", userEmail).Scan(&userName)
	if err != nil {
		context.JSON(http.StatusUnauthorized, gin.H{"error": "Inviter not found"})
		return
	}

	// Запрашиваем приглашения для пользователя по его email
	rows, err := database.Db.Query(`
        SELECT notion_project_invitations.id, notion_project_invitations.status, notion_project_invitations.created_at, notion_project_invitations.inviter_name, notion_project_invitations.invitee_name, notion_project_invitations.role
        FROM notion_project_invitations
        JOIN notion_projects ON notion_project_invitations.project_id = notion_projects.id
        WHERE invitee_name = $1`, userName)
	if err != nil {
		fmt.Println(err)
		context.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve invitations"})
		return
	}
	defer func(rows *sql.Rows) {
		err := rows.Close()
		if err != nil {

		}
	}(rows)

	// Формируем список приглашений
	var invitations []model.Invitation
	for rows.Next() {
		var invitation model.Invitation
		if err := rows.Scan(&invitation.ID, &invitation.Status, &invitation.CreatedAt, &invitation.InviterName, &invitation.InviteeName, &invitation.Role); err != nil {
			fmt.Println(err)
			context.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to scan invitation"})
			return
		}
		invitations = append(invitations, invitation)
	}

	// Возвращаем список приглашений
	context.JSON(http.StatusOK, gin.H{"invitations": invitations})
}
