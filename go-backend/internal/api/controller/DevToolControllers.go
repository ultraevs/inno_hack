package controller

import (
	"app/internal/database"
	"database/sql"
	"github.com/gin-gonic/gin"
	"net/http"
)

// GetAllUserNames возвращает список всех никнеймов пользователей
// @Summary Получить все никнеймы пользователей
// @Description Возвращает список всех никнеймов пользователей из таблицы notion_users
// @Produce json
// @Success 200 {array} string "Список всех никнеймов пользователей"
// @Failure 500 {object} model.ErrorResponse "Ошибка при получении данных"
// @Tags DevTOol
// @Router /v1/users/names [get]
func GetAllUserNames(context *gin.Context) {
	rows, err := database.Db.Query(`SELECT name FROM notion_users`)
	if err != nil {
		context.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve user names"})
		return
	}
	defer func(rows *sql.Rows) {
		err := rows.Close()
		if err != nil {

		}
	}(rows)

	var userNames []string
	for rows.Next() {
		var userName string
		if err := rows.Scan(&userName); err != nil {
			context.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to scan user name"})
			return
		}
		userNames = append(userNames, userName)
	}

	context.JSON(http.StatusOK, gin.H{"user_names": userNames})
}
