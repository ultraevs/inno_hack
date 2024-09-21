package model

import "time"

type TaskDetails struct {
	ID          int       `json:"id"`
	Title       string    `json:"title"`
	Description string    `json:"description"`
	Status      string    `json:"status"`
	AssigneeID  int       `json:"assignee_id"`
	Deadline    time.Time `json:"deadline"`
	StartTime   time.Time `json:"start_time"`
	EndTime     time.Time `json:"end_time"`
	Duration    string    `json:"duration"`
}

type TaskTableResponse struct {
	Tasks []TaskDetails `json:"tasks"` // Список задач
}

type TaskCreateRequest struct {
	Title       string `json:"title" binding:"required"`
	Description string `json:"description"`
	AssigneeID  int    `json:"assignee_id"`
	Status      string `json:"status" binding:"required"` // "To Do", "In Progress", "Done"
}

type TaskUpdateRequest struct {
	Title       *string    `json:"title,omitempty"`
	Description *string    `json:"description,omitempty"`
	AssigneeID  *int       `json:"assignee_id,omitempty"`
	Status      *string    `json:"status,omitempty"`
	Deadline    *time.Time `json:"deadline,omitempty"`
	StartTime   *time.Time `json:"start_time,omitempty"`
	EndTime     *time.Time `json:"end_time,omitempty"`
	Duration    *string    `json:"duration,omitempty"`
}
