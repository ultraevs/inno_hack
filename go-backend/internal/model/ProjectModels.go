package model

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
