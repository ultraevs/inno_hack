package controller

import (
	"app/internal/database"
	"app/internal/model"
	"database/sql"
	"errors"
	"fmt"
	"github.com/gin-gonic/gin"
	"net/http"
	"time"
)

func parseUserDate(userDate string) (time.Time, error) {
	layout := "2006-01-02 15:04"
	parsedTime, err := time.Parse(layout, userDate)
	if err != nil {
		return time.Time{}, err
	}
	return parsedTime, nil
}

// CreateMeeting создает новое собрание и приглашает всех участников проекта
// @Summary Создать новое собрание
// @Description Создает новое собрание и приглашает всех участников указанного проекта
// @Accept json
// @Produce json
// @Param request body model.MeetingCreateRequest true "Запрос на создание собрания"
// @Success 200 {object} model.CodeResponse "Собрание успешно создано"
// @Failure 400 {object} model.ErrorResponse "Ошибка при создании собрания"
// @Tags Meetings
// @Router /v1/meetings [post]
func CreateMeeting(context *gin.Context) {
	var body model.MeetingCreateRequest
	if err := context.ShouldBindJSON(&body); err != nil {
		context.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request"})
		return
	}

	// Преобразуем строку в формат времени
	parsedDate, err := parseUserDate(body.MeetingDate)
	if err != nil {
		context.JSON(http.StatusBadRequest, gin.H{"error": "Invalid date format. Please use 'YYYY-MM-DD HH:MM'"})
		return
	}

	// Находим проект по его названию
	var projectID int
	err = database.Db.QueryRow("SELECT id FROM notion_projects WHERE name = $1", body.ProjectName).Scan(&projectID)
	if errors.Is(err, sql.ErrNoRows) {
		context.JSON(http.StatusBadRequest, gin.H{"error": "Project not found"})
		return
	} else if err != nil {
		context.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve project"})
		return
	}

	// Создаем собрание и получаем ID созданного собрания
	var meetingID int
	err = database.Db.QueryRow("INSERT INTO notion_meetings (name, zoom_link, project_name, meeting_date) VALUES ($1, $2, $3, $4) RETURNING id",
		body.MeetingName, body.ZoomLink, body.ProjectName, parsedDate).Scan(&meetingID)
	if err != nil {
		fmt.Println(err)
		context.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create meeting"})
		return
	}

	// Находим всех участников проекта
	rows, err := database.Db.Query("SELECT user_name FROM notion_project_users WHERE project_id = $1", projectID)
	if err != nil {
		context.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve project participants"})
		return
	}
	defer func(rows *sql.Rows) {
		err := rows.Close()
		if err != nil {

		}
	}(rows)

	// Добавляем участников в собрание
	for rows.Next() {
		var userName string
		if err := rows.Scan(&userName); err != nil {
			context.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to scan participant"})
			return
		}

		_, err = database.Db.Exec(`INSERT INTO notion_meeting_participants (meeting_id, user_name) VALUES ($1, $2)`, meetingID, userName)
		if err != nil {
			fmt.Println(err)
			context.JSON(http.StatusInternalServerError, gin.H{"error": fmt.Sprintf("Failed to add participant %s to meeting", userName)})
			return
		}
	}

	context.JSON(http.StatusOK, gin.H{"message": "Meeting created successfully", "meeting_id": meetingID})
}

// InviteUserToMeeting приглашает пользователя на созвон
// @Summary Пригласить пользователя на созвон
// @Description Добавляет пользователя в список участников созвона
// @Accept json
// @Produce json
// @Param meeting_id path int true "ID созвона"
// @Param request body model.InviteUserRequest true "Запрос на приглашение пользователя"
// @Success 200 {object} model.CodeResponse "Пользователь успешно приглашён"
// @Failure 400 {object} model.ErrorResponse "Ошибка при приглашении пользователя"
// @Tags Meetings
// @Router /v1/meetings/{meeting_id}/invite [post]
func InviteUserToMeeting(context *gin.Context) {
	meetingID := context.Param("meeting_id")
	var body struct {
		UserName string `json:"user_name" binding:"required"` // Имя пользователя, которого нужно пригласить
	}

	if err := context.ShouldBindJSON(&body); err != nil {
		context.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request"})
		return
	}

	// Проверяем, существует ли пользователь
	var userExists bool
	err := database.Db.QueryRow(`SELECT EXISTS(SELECT 1 FROM notion_users WHERE name = $1)`, body.UserName).Scan(&userExists)
	if err != nil {
		context.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to check user existence"})
		return
	}
	if !userExists {
		context.JSON(http.StatusBadRequest, gin.H{"error": "User does not exist"})
		return
	}

	// Добавляем пользователя в список участников созвона
	_, err = database.Db.Exec(`INSERT INTO notion_meeting_participants (meeting_id, user_name) VALUES ($1, $2)`, meetingID, body.UserName)

	if err != nil {
		context.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to invite user to meeting"})
		return
	}

	context.JSON(http.StatusOK, gin.H{"message": "User invited successfully"})
}

// GetUserMeetings возвращает все созвоны, в которых участвует пользователь
// @Summary Получить все созвоны пользователя
// @Description Возвращает все созвоны, в которых пользователь является участником или создателем
// @Produce json
// @Success 200 {array} model.MeetingDetails "Список созвонов"
// @Failure 400 {object} model.ErrorResponse "Ошибка при получении данных"
// @Tags Meetings
// @Router /v1/users/meetings [get]
func GetUserMeetings(context *gin.Context) {
	userEmail := context.MustGet("Email").(string)

	// Находим отправителя по его email
	var userName string
	err := database.Db.QueryRow("SELECT name FROM notion_users WHERE email = $1", userEmail).Scan(&userName)
	if err != nil {
		context.JSON(http.StatusUnauthorized, gin.H{"error": "User not found"})
		return
	}

	// Запрос для получения всех созвонов, где пользователь является создателем или участником
	rows, err := database.Db.Query(`
		SELECT m.id, m.name, m.project_name, m.zoom_link, m.meeting_date 
		FROM notion_meetings m 
		LEFT JOIN notion_meeting_participants mp ON m.id = mp.meeting_id
		WHERE m.created_by = $1 OR mp.user_name = $1`, userName)

	if err != nil {
		fmt.Println(err)
		context.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve user meetings"})
		return
	}
	defer func(rows *sql.Rows) {
		err := rows.Close()
		if err != nil {

		}
	}(rows)

	var meetings []model.MeetingDetails
	for rows.Next() {
		var meeting model.MeetingDetails
		if err := rows.Scan(&meeting.ID, &meeting.Name, &meeting.ProjectName, &meeting.ZoomLink, &meeting.MeetingDate); err != nil {
			context.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to scan meeting data"})
			return
		}
		meetings = append(meetings, meeting)
	}

	context.JSON(http.StatusOK, gin.H{"meetings": meetings})
}

// GetMeetingDetails возвращает информацию о конкретном созвоне по его ID
// @Summary Получить данные о созвоне
// @Description Возвращает детальную информацию о созвоне, включая участников
// @Produce json
// @Param meeting_id path int true "ID созвона"
// @Success 200 {object} model.MeetingDetailsWithParticipants "Детали созвона"
// @Failure 400 {object} model.ErrorResponse "Ошибка при получении данных"
// @Tags Meetings
// @Router /v1/meetings/{meeting_id} [get]
func GetMeetingDetails(context *gin.Context) {
	meetingID := context.Param("meeting_id")

	// Запрос для получения деталей созвона
	var meeting model.MeetingDetailsWithParticipants
	err := database.Db.QueryRow(`
		SELECT m.id, m.name, m.zoom_link, m.project_name, m.meeting_date
		FROM notion_meetings m 
		WHERE m.id = $1`, meetingID).
		Scan(&meeting.ID, &meeting.Name, &meeting.ZoomLink, &meeting.ProjectName, &meeting.MeetingDate)

	if err != nil {
		context.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve meeting details"})
		return
	}

	// Запрос для получения участников созвона
	rows, err := database.Db.Query(`SELECT user_name FROM notion_meeting_participants WHERE meeting_id = $1`, meetingID)
	if err != nil {
		context.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve meeting participants"})
		return
	}
	defer func(rows *sql.Rows) {
		err := rows.Close()
		if err != nil {

		}
	}(rows)

	var participants []string
	for rows.Next() {
		var participant string
		if err := rows.Scan(&participant); err != nil {
			context.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to scan participant"})
			return
		}
		participants = append(participants, participant)
	}

	meeting.Participants = participants

	context.JSON(http.StatusOK, gin.H{"meeting": meeting})
}
