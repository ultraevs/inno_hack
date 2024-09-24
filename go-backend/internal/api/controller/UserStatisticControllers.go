package controller

import (
	"app/internal/database"
	"fmt"
	"github.com/gin-gonic/gin"
	"net/http"
)

// GetUserStats возвращает статистику пользователя
// @Summary Получить статистику пользователя
// @Description Возвращает количество завершённых задач и количество проектов, в которых пользователь участвует
// @Produce json
// @Success 200 {object} model.UserStatsResponse "Статистика пользователя"
// @Failure 400 {object} model.ErrorResponse "Ошибка при получении статистики"
// @Tags Users
// @Router /v1/users/stats [get]
func GetUserStats(context *gin.Context) {
	// Извлекаем email текущего пользователя из куки
	userEmail := context.MustGet("Email").(string)

	// Находим отправителя по его email
	var userName string
	err := database.Db.QueryRow("SELECT name FROM notion_users WHERE email = $1", userEmail).Scan(&userName)
	if err != nil {
		context.JSON(http.StatusUnauthorized, gin.H{"error": "User not found"})
		return
	}

	var doneTasksCount, totalProjectsCount int

	// Подсчёт задач со статусом "done"
	err = database.Db.QueryRow(`SELECT COUNT(*) FROM notion_tasks WHERE assignee_name = $1 AND status = 'done'`, userName).Scan(&doneTasksCount)
	if err != nil {
		context.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve done tasks count"})
		return
	}

	// Подсчёт проектов, в которых пользователь участвует или которые он создал
	err = database.Db.QueryRow(`
		SELECT COUNT(*) FROM notion_projects p
		LEFT JOIN notion_project_users pu ON p.id = pu.project_id
		WHERE p.owner_name = $1 OR pu.user_name = $1`, userName).Scan(&totalProjectsCount)
	if err != nil {
		fmt.Println(err)
		context.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve total projects count"})
		return
	}

	context.JSON(http.StatusOK, gin.H{
		"done_tasks_count":     doneTasksCount,
		"total_projects_count": totalProjectsCount,
	})
}
