package controller

import (
	"app/internal/database"
	"app/internal/model"
	"fmt"
	"github.com/gin-gonic/gin"
	"net/http"
	"strconv"
)

// CreateTask создает новую задачу
// @Summary Создать новую задачу
// @Description Создаёт новую задачу для конкретного проекта
// @Accept json
// @Produce json
// @Param project_id path int true "ID проекта"
// @Param request body model.TaskCreateRequest true "Запрос на создание задачи"
// @Success 200 {object} model.CodeResponse "Задача успешно создана"
// @Failure 400 {object} model.ErrorResponse "Ошибка при создании задачи"
// @Tags Tasks
// @Router /v1/projects/{project_id}/tasks [post]
func CreateTask(context *gin.Context) {
	projectID := context.Param("project_id")
	var body model.TaskCreateRequest

	if err := context.ShouldBindJSON(&body); err != nil {
		context.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request"})
		return
	}

	_, err := database.Db.Exec(`
		INSERT INTO notion_tasks (title, project_id)
		VALUES ($1, $2)`,
		body.Title, projectID)

	if err != nil {
		context.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create task"})
		return
	}
	var task_id int
	err = database.Db.QueryRow(`SELECT id FROM notion_tasks WHERE title = $1 and project_id = $2`, body.Title, projectID).Scan(&task_id)

	context.JSON(http.StatusOK, gin.H{"message": gin.H{"task_id": task_id}})
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
// @Router /v1/projects/{project_id}/tasks/{task_id} [get]
func GetTask(context *gin.Context) {
	taskID := context.Param("task_id")
	projectID := context.Param("project_id")

	var task model.TaskDetails

	err := database.Db.QueryRow(`
		SELECT id, title, description, assignee_name, status, deadline, start_time, end_time, duration 
		FROM notion_tasks 
		WHERE id = $1 AND project_id = $2`, taskID, projectID).
		Scan(
			&task.ID,
			&task.Title,
			&task.Description,
			&task.AssigneeName,
			&task.Status,
			&task.Deadline,  // Используем указатель на time.Time
			&task.StartTime, // Используем указатель на time.Time
			&task.EndTime,   // Используем указатель на time.Time
			&task.Duration,
		)

	if err != nil {
		fmt.Println(err)
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
// @Router /v1/projects/{project_id}/tasks/{task_id} [put]
func UpdateTask(context *gin.Context) {
	taskID := context.Param("task_id")
	projectID := context.Param("project_id")
	var body model.TaskUpdateRequest

	if err := context.ShouldBindJSON(&body); err != nil {
		fmt.Println(err)
		context.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request"})
		return
	}

	query := "UPDATE notion_tasks SET "
	var params []interface{}
	counter := 1

	// Проверка и добавление динамических полей
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

	if body.AssigneeName != nil {
		query += "assignee_name = $" + strconv.Itoa(counter) + ", "
		params = append(params, *body.AssigneeName)
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

	// Убираем последнюю запятую и добавляем WHERE
	query = query[:len(query)-2]
	query += " WHERE id = $" + strconv.Itoa(counter) + " AND project_id = $" + strconv.Itoa(counter+1)
	params = append(params, taskID, projectID)

	_, err := database.Db.Exec(query, params...)
	if err != nil {
		fmt.Println(err)
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
// @Router /v1/projects/{project_id}/tasks/{task_id} [delete]
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
