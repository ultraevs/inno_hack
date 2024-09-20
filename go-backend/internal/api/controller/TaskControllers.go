package controller

import (
	"app/internal/database"
	"app/internal/model"
	"github.com/gin-gonic/gin"
	"net/http"
	"strconv"
)

// CreateTask создает новую задачу в рамках проекта
// @Summary Создать новую задачу
// @Description Создаёт новую задачу для конкретного проекта
// @Accept json
// @Produce json
// @Param project_id path int true "ID проекта"
// @Param request body model.TaskCreateRequest true "Запрос на создание задачи"
// @Success 200 {object} model.CodeResponse "Задача успешно создана"
// @Failure 400 {object} model.ErrorResponse "Ошибка при создании задачи"
// @Tags Tasks
// @Router /projects/{project_id}/tasks [post]
func CreateTask(context *gin.Context) {
	projectID := context.Param("project_id")
	var body model.TaskCreateRequest

	if err := context.ShouldBindJSON(&body); err != nil {
		context.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request"})
		return
	}

	_, err := database.Db.Exec(`INSERT INTO notion_tasks (title, description, project_id, assignee_id, status, deadline, start_time, end_time, duration)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
		body.Title, body.Description, projectID, body.AssigneeID, body.Status, body.Deadline, body.StartTime, body.EndTime, body.Duration)

	if err != nil {
		context.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create task"})
		return
	}

	context.JSON(http.StatusOK, gin.H{"message": "Task created successfully"})
}

// GetTask возвращает информацию о задаче
// @Summary Получить задачу
// @Description Возвращает информацию о задаче по её ID
// @Produce json
// @Param project_id path int true "ID проекта"
// @Param task_id path int true "ID задачи"
// @Success 200 {object} model.TaskDetails "Информация о задаче"
// @Failure 400 {object} model.ErrorResponse "Ошибка при получении задачи"
// @Tags Tasks
// @Router /projects/{project_id}/tasks/{task_id} [get]
func GetTask(context *gin.Context) {
	taskID := context.Param("task_id")
	projectID := context.Param("project_id")

	var task model.TaskDetails

	err := database.Db.QueryRow(`
		SELECT id, title, description, assignee_id, status, deadline, start_time, end_time, duration 
		FROM notion_tasks 
		WHERE id = $1 AND project_id = $2`, taskID, projectID).
		Scan(&task.ID, &task.Title, &task.Description, &task.AssigneeID, &task.Status, &task.Deadline, &task.StartTime, &task.EndTime, &task.Duration)

	if err != nil {
		context.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve task"})
		return
	}

	context.JSON(http.StatusOK, gin.H{"task": task})
}

// UpdateTask обновляет данные задачи
// @Summary Обновить задачу
// @Description Обновляет информацию о задаче, включая статус, исполнителя, дедлайн и т.д.
// @Accept json
// @Produce json
// @Param project_id path int true "ID проекта"
// @Param task_id path int true "ID задачи"
// @Param request body model.TaskUpdateRequest true "Запрос на обновление задачи"
// @Success 200 {object} model.CodeResponse "Задача успешно обновлена"
// @Failure 400 {object} model.ErrorResponse "Ошибка при обновлении задачи"
// @Tags Tasks
// @Router /projects/{project_id}/tasks/{task_id} [put]
func UpdateTask(context *gin.Context) {
	taskID := context.Param("task_id")
	projectID := context.Param("project_id")
	var body model.TaskUpdateRequest

	if err := context.ShouldBindJSON(&body); err != nil {
		context.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request"})
		return
	}

	// Генерируем запрос динамически, обновляя только те поля, которые были переданы
	query := "UPDATE notion_tasks SET "
	var params []interface{}
	counter := 1

	if body.Title != nil {
		query += "title = $" + strconv.Itoa(counter) + ", "
		params = append(params, *body.Title)
		counter++
	}

	if body.Description != nil {
		query += "description = $" + strconv.Itoa(counter) + ", "
		params = append(params, *body.Description)
		counter++
	}

	if body.AssigneeID != nil {
		query += "assignee_id = $" + strconv.Itoa(counter) + ", "
		params = append(params, *body.AssigneeID)
		counter++
	}

	if body.Status != nil {
		query += "status = $" + strconv.Itoa(counter) + ", "
		params = append(params, *body.Status)
		counter++
	}

	if body.Deadline != nil {
		query += "deadline = $" + strconv.Itoa(counter) + ", "
		params = append(params, *body.Deadline)
		counter++
	}

	if body.StartTime != nil {
		query += "start_time = $" + strconv.Itoa(counter) + ", "
		params = append(params, *body.StartTime)
		counter++
	}

	if body.EndTime != nil {
		query += "end_time = $" + strconv.Itoa(counter) + ", "
		params = append(params, *body.EndTime)
		counter++
	}

	if body.Duration != nil {
		query += "duration = $" + strconv.Itoa(counter) + ", "
		params = append(params, *body.Duration)
		counter++
	}

	// Убираем последнюю запятую
	query = query[:len(query)-2]
	query += " WHERE id = $" + strconv.Itoa(counter) + " AND project_id = $" + strconv.Itoa(counter+1)
	params = append(params, taskID, projectID)

	_, err := database.Db.Exec(query, params...)
	if err != nil {
		context.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update task"})
		return
	}

	context.JSON(http.StatusOK, gin.H{"message": "Task updated successfully"})
}

// DeleteTask удаляет задачу
// @Summary Удалить задачу
// @Description Удаляет задачу по её ID
// @Param project_id path int true "ID проекта"
// @Param task_id path int true "ID задачи"
// @Success 200 {object} model.CodeResponse "Задача успешно удалена"
// @Failure 400 {object} model.ErrorResponse "Ошибка при удалении задачи"
// @Tags Tasks
// @Router /projects/{project_id}/tasks/{task_id} [delete]
func DeleteTask(context *gin.Context) {
	taskID := context.Param("task_id")
	projectID := context.Param("project_id")

	_, err := database.Db.Exec("DELETE FROM notion_tasks WHERE id = $1 AND project_id = $2", taskID, projectID)
	if err != nil {
		context.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete task"})
		return
	}

	context.JSON(http.StatusOK, gin.H{"message": "Task deleted successfully"})
}
