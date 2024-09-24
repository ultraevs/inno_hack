package model

type UserStatsResponse struct {
	DoneTasksCount     int `json:"done_tasks_count"`
	TotalProjectsCount int `json:"total_projects_count"`
}
