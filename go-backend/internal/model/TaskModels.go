package model

import "time"

type TaskDetails struct {
	ID           int        `json:"id"`
	Title        string     `json:"title"`
	Description  *string    `json:"description,omitempty"`
	Status       *string    `json:"status,omitempty"`
	AssigneeName *string    `json:"assignee_name,omitempty"`
	Deadline     *time.Time `json:"deadline,omitempty"`   // Используем указатель на time.Time
	StartTime    *string    `json:"start_time,omitempty"` // Используем указатель на time.Time
	EndTime      *string    `json:"end_time,omitempty"`   // Используем указатель на time.Time
	Duration     *string    `json:"duration,omitempty"`
}

type TaskTableResponse struct {
	Tasks []TaskDetails `json:"tasks"` // Список задач
}

type TaskCreateRequest struct {
	Title string `json:"title" binding:"required"`
}

type TaskUpdateRequest struct {
	Title        *string    `json:"title,omitempty"`
	Description  *string    `json:"description,omitempty"`
	AssigneeName *string    `json:"assignee_name,omitempty"`
	Status       *string    `json:"status,omitempty"`
	Deadline     *time.Time `json:"deadline,omitempty"`
	StartTime    *string    `json:"start_time,omitempty"`
	EndTime      *string    `json:"end_time,omitempty"`
	Duration     *string    `json:"duration,omitempty"`
}
