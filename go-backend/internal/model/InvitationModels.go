package model

import "time"

type ProjectInvitationRequest struct {
	InviteeName string `json:"invitee_name"`
}

type InvitationResponseRequest struct {
	Response string `json:"response"` // "accepted" или "declined"
}

type Invitation struct {
	ID          int       `json:"id"`
	ProjectID   int       `json:"project_id"`
	ProjectName string    `json:"project_name"`
	InviteeName string    `json:"invitee_name"`
	InviterName string    `json:"inviter_name"`
	Status      string    `json:"status"`
	CreatedAt   time.Time `json:"created_at"`
}

type UserInvitationsResponse struct {
	Invitations []Invitation `json:"invitations"`
}
