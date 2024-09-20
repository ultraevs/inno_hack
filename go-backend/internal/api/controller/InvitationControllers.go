package controller

import (
	"app/internal/database"
	"app/internal/model"
	"database/sql"
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
// @Router /projects/:project_id/invite [post]
func InviteUserToProject(context *gin.Context) {
	projectID := context.Param("project_id")
	var body model.ProjectInvitationRequest

	// Извлекаем email текущего пользователя из куки
	inviterEmail := context.MustGet("Email").(string)

	// Находим отправителя по его email
	var inviterID int
	err := database.Db.QueryRow("SELECT id FROM notion_users WHERE email = $1", inviterEmail).Scan(&inviterID)
	if err != nil {
		context.JSON(http.StatusUnauthorized, gin.H{"error": "Inviter not found"})
		return
	}

	// Поиск пользователя по имени для отправки приглашения
	var inviteeEmail string
	err = database.Db.QueryRow("SELECT email FROM notion_users WHERE name = $1", body.InviteeName).Scan(&inviteeEmail)
	if err != nil {
		context.JSON(http.StatusBadRequest, gin.H{"error": "User not found by name"})
		return
	}

	// Проверяем, не существует ли уже активного приглашения для этого пользователя
	var existingStatus string
	err = database.Db.QueryRow(`SELECT status FROM project_invitations WHERE project_id = $1 AND invitee_email = $2`,
		projectID, inviteeEmail).Scan(&existingStatus)

	if err == nil && existingStatus == "pending" {
		context.JSON(http.StatusBadRequest, gin.H{"error": "Invitation already pending"})
		return
	}

	// Добавляем новое приглашение
	_, err = database.Db.Exec(`INSERT INTO project_invitations (project_id, invitee_email, inviter_id, status)
		VALUES ($1, $2, $3, 'pending')`, projectID, inviteeEmail, inviterID)

	if err != nil {
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
// @Router /invitations/:invitation_id/respond [post]
func RespondToInvitation(context *gin.Context) {
	invitationID := context.Param("invitation_id")
	var body model.InvitationResponseRequest

	if err := context.ShouldBindJSON(&body); err != nil {
		context.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request"})
		return
	}

	// Получаем email текущего пользователя из куки
	userEmail := context.MustGet("Email").(string)

	// Обновляем статус приглашения для пользователя
	_, err := database.Db.Exec(`UPDATE project_invitations SET status = $1 WHERE id = $2 AND invitee_email = $3`,
		body.Response, invitationID, userEmail)

	if err != nil {
		context.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to respond to invitation"})
		return
	}

	// Если пользователь принял приглашение, добавляем его в проект
	if body.Response == "accepted" {
		var projectID int
		err = database.Db.QueryRow(`SELECT project_id FROM project_invitations WHERE id = $1`, invitationID).Scan(&projectID)
		if err != nil {
			context.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve project details"})
			return
		}

		_, err = database.Db.Exec(`INSERT INTO project_users (project_id, user_email) VALUES ($1, $2)`, projectID, userEmail)
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
// @Router /user/invitations [get]
func GetUserInvitations(context *gin.Context) {
	// Извлекаем email пользователя из cookies
	userEmail := context.MustGet("Email").(string)

	// Запрашиваем приглашения для пользователя по его email
	rows, err := database.Db.Query(`
        SELECT project_invitations.id, projects.name, project_invitations.status, project_invitations.created_at
        FROM project_invitations
        JOIN projects ON project_invitations.project_id = projects.id
        WHERE invitee_email = $1`, userEmail)
	if err != nil {
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
		if err := rows.Scan(&invitation.ID, &invitation.ProjectName, &invitation.Status, &invitation.CreatedAt); err != nil {
			context.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to scan invitation"})
			return
		}
		invitations = append(invitations, invitation)
	}

	// Возвращаем список приглашений
	context.JSON(http.StatusOK, gin.H{"invitations": invitations})
}