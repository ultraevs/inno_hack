package model

import "time"

type ProjectCreateRequest struct {
	ProjectName string        `json:"projectName" binding:"required"`
	Users       []ProjectUser `json:"users" binding:"required"`
	LinkToFigma *string       `json:"linkToFigma"`
}

type ProjectUser struct {
	Username string `json:"username" binding:"required"`
	Role     string `json:"role" binding:"required"`
}

type ProjectDetailsResponse struct {
	Content string `json:"content"`
}

type Project struct {
	ID          int       `json:"id"`
	Name        string    `json:"name"`
	Description *string   `json:"description"`
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
	Role  string `json:"role"`
}
