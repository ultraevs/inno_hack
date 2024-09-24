package model

type CreateMeetingRequest struct {
	MeetingDate string `json:"meeting_date"`
	ZoomLink    string `json:"zoom_link"`
}

type InviteUserRequest struct {
	UserName string `json:"user_name"`
}

type MeetingDetails struct {
	ID          int    `json:"id"`
	MeetingDate string `json:"meeting_date"`
	ZoomLink    string `json:"zoom_link"`
	CreatedBy   string `json:"created_by"`
}

type MeetingDetailsWithParticipants struct {
	ID           int      `json:"id"`
	MeetingDate  string   `json:"meeting_date"`
	ZoomLink     string   `json:"zoom_link"`
	CreatedBy    string   `json:"created_by"`
	Participants []string `json:"participants"`
}
