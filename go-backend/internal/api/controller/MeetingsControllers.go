package controller

import (
	"app/internal/database"
	"app/internal/model"
	"database/sql"
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

// CreateMeeting создает новый созвон
// @Summary Создать новый созвон
// @Description Добавляет новый созвон с указанием даты и ссылки на Zoom
// @Accept json
// @Produce json
// @Param request body model.CreateMeetingRequest true "Запрос на создание созвона"
// @Success 200 {object} model.CodeResponse "Созвон успешно создан"
// @Failure 400 {object} model.ErrorResponse "Ошибка при создании созвона"
// @Tags Meetings
// @Router /v1/meetings/new_meeting [post]
func CreateMeeting(context *gin.Context) {
	var body struct {
		MeetingDate string `json:"meeting_date" binding:"required"` // Дата и время собрания
		ZoomLink    string `json:"zoom_link" binding:"required"`    // Ссылка на Zoom
	}

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

	userEmail := context.MustGet("Email").(string)

	// Находим отправителя по его email
	var creatorName string
	err = database.Db.QueryRow("SELECT name FROM notion_users WHERE email = $1", userEmail).Scan(&creatorName)
	if err != nil {
		context.JSON(http.StatusUnauthorized, gin.H{"error": "User not found"})
		return
	}

	_, err = database.Db.Exec(`INSERT INTO notion_meetings (meeting_date, zoom_link, created_by) 
		VALUES ($1, $2, $3)`, parsedDate, body.ZoomLink, creatorName)

	if err != nil {
		fmt.Println(err)
		context.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create meeting"})
		return
	}

	context.JSON(http.StatusOK, gin.H{"message": "Meeting created successfully"})
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
		SELECT m.id, m.meeting_date, m.zoom_link, m.created_by 
		FROM notion_meetings m 
		LEFT JOIN notion_meeting_participants mp ON m.id = mp.meeting_id
		WHERE m.created_by = $1 OR mp.user_name = $1`, userName)

	if err != nil {
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
		if err := rows.Scan(&meeting.ID, &meeting.MeetingDate, &meeting.ZoomLink, &meeting.CreatedBy); err != nil {
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
		SELECT m.id, m.meeting_date, m.zoom_link, m.created_by
		FROM notion_meetings m 
		WHERE m.id = $1`, meetingID).
		Scan(&meeting.ID, &meeting.MeetingDate, &meeting.ZoomLink, &meeting.CreatedBy)

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
