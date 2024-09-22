package model

import "time"

type ProjectCreateRequest struct {
	Name        string `json:"name"`
	Description string `json:"description"`
}

type ChangeViewRequest struct {
	ViewMode string `json:"view_mode"` // Допустимые значения: 'text', 'task_table'
}

type ProjectDetailsResponse struct {
	Content  string `json:"content"`
	ViewMode string `json:"view_mode"`
}

type Project struct {
	ID          int       `json:"id"`
	Name        string    `json:"name"`
	Description string    `json:"description"`
	OwnerName   string    `json:"owner_name"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
	ViewMode    string    `json:"view_mode"` // Текущий вид проекта: 'text' или 'task_table'
}

type UserProjectsResponse struct {
	Projects []Project `json:"projects"`
}
