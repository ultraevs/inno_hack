package model

type MeetingCreateRequest struct {
	ZoomLink    string `json:"zoomLink" binding:"required"` // Ссылка на Zoom, обязательное поле
	MeetingDate string `json:"meetingDate"`
	MeetingName string `json:"meetingName" binding:"required"` // Название собрания, обязательное поле
	ProjectName string `json:"projectName" binding:"required"` // Название проекта, обязательное поле
}

type InviteUserRequest struct {
	UserName string `json:"user_name"`
}

type MeetingDetails struct {
	ID          int    `json:"id"`
	Name        string `json:"name"`
	ZoomLink    string `json:"zoom_link"`
	ProjectName string `json:"projectName"`
	MeetingDate string `json:"meetingDate"`
}

type MeetingDetailsWithParticipants struct {
	ID           int      `json:"id"`
	Name         string   `json:"name"`
	ZoomLink     string   `json:"zoom_link"`
	ProjectName  string   `json:"projectName"`
	MeetingDate  string   `json:"meetingDate"`
	Participants []string `json:"participants"`
}
