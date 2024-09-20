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
