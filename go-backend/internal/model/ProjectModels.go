package model

import "time"

type ProjectCreateRequest struct {
	Name        string  `json:"name"`
	Description string  `json:"description"`
	Figma       *string `json:"figma"`
}

type ProjectDetailsResponse struct {
	Content string `json:"content"`
}

type Project struct {
	ID          int       `json:"id"`
	Name        string    `json:"name"`
	Description string    `json:"description"`
	OwnerName   string    `json:"owner_name"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
	Figma       *string   `json:"figma"`
}

type UserProjectsResponse struct {
	Projects []Project `json:"projects"`
}

type UserDetails struct {
	Name  string `json:"name"`
	Email string `json:"email"`
}
