package controller

import (
	"app/internal/database"
	"app/internal/model"
	"database/sql"
	"fmt"
	"github.com/gin-gonic/gin"
	"net/http"
)

// AddContentBlock добавляет новый блок контента в проект
// @Summary Добавить блок контента
// @Description Добавляет новый блок текста или другого контента в проект
// @Accept json
// @Produce json
// @Param project_id path int true "ID проекта"
// @Param request body model.AddContentBlockRequest true "Запрос на добавление контента"
// @Success 200 {object} model.CodeResponse "Контент успешно добавлен"
// @Failure 400 {object} model.ErrorResponse "Ошибка при добавлении контента"
// @Tags TextContent
// @Router /v1/projects/{project_id}/content [post]
func AddContentBlock(context *gin.Context) {
	projectID := context.Param("project_id")
	var body struct {
		ContentType string `json:"content_type" binding:"required"` // Тип контента ('heading', 'paragraph', 'list', и т.д.)
		Content     string `json:"content" binding:"required"`      // Содержание блока
		OrderNum    int    `json:"order_num" binding:"required"`    // Порядок блока
	}

	if err := context.ShouldBindJSON(&body); err != nil {
		context.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request"})
		return
	}

	_, err := database.Db.Exec(`INSERT INTO notion_project_content_blocks (project_id, content_type, content, order_num) 
		VALUES ($1, $2, $3, $4)`, projectID, body.ContentType, body.Content, body.OrderNum)

	if err != nil {
		fmt.Println(err)
		context.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to add content block"})
		return
	}

	context.JSON(http.StatusOK, gin.H{"message": "Content block added successfully"})
}

// GetProjectContent возвращает все блоки контента проекта
// @Summary Получить контент проекта
// @Description Возвращает весь контент проекта в виде блоков с различными типами
// @Produce json
// @Param project_id path int true "ID проекта"
// @Success 200 {array} model.ContentBlockResponse "Список блоков контента"
// @Failure 400 {object} model.ErrorResponse "Ошибка при получении контента"
// @Tags TextContent
// @Router /v1/projects/{project_id}/content [get]
func GetProjectContent(context *gin.Context) {
	projectID := context.Param("project_id")

	// Выполняем запрос для получения блоков контента, отсортированных по порядку
	rows, err := database.Db.Query(`
		SELECT id, content_type, content, order_num 
		FROM notion_project_content_blocks 
		WHERE project_id = $1 ORDER BY order_num`, projectID)

	if err != nil {
		context.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve project content"})
		return
	}
	defer func(rows *sql.Rows) {
		err := rows.Close()
		if err != nil {

		}
	}(rows)

	var contentBlocks []model.ContentBlockResponse
	for rows.Next() {
		var block model.ContentBlockResponse
		if err := rows.Scan(&block.ID, &block.ContentType, &block.Content, &block.OrderNum); err != nil {
			context.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to scan content block"})
			return
		}
		contentBlocks = append(contentBlocks, block)
	}

	context.JSON(http.StatusOK, gin.H{"content_blocks": contentBlocks})
}

// UpdateContentBlock обновляет существующий блок контента
// @Summary Обновить блок контента
// @Description Обновляет существующий блок текста или другого контента в проекте
// @Accept json
// @Produce json
// @Param block_id path int true "ID блока"
// @Param request body model.AddContentBlockRequest true "Запрос на обновление контента"
// @Success 200 {object} model.CodeResponse "Контент успешно обновлён"
// @Failure 400 {object} model.ErrorResponse "Неверный запрос"
// @Failure 500 {object} model.ErrorResponse "Ошибка при обновлении контента"
// @Tags TextContent
// @Router /v1/projects/content/{block_id} [put]
func UpdateContentBlock(context *gin.Context) {
	blockID := context.Param("block_id")
	var body model.AddContentBlockRequest

	if err := context.ShouldBindJSON(&body); err != nil {
		context.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request"})
		return
	}

	_, err := database.Db.Exec(`UPDATE notion_project_content_blocks SET content_type = $1, content = $2, order_num = $3 WHERE id = $4`,
		body.ContentType, body.Content, body.OrderNum, blockID)

	if err != nil {
		context.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update content block"})
		return
	}

	context.JSON(http.StatusOK, gin.H{"message": "Content block updated successfully"})
}

// DeleteContentBlock удаляет блок контента
// @Summary Удалить блок контента
// @Description Удаляет существующий блок контента из проекта
// @Param block_id path int true "ID блока"
// @Success 200 {object} model.CodeResponse "Контент успешно удалён"
// @Failure 400 {object} model.ErrorResponse "Неверный запрос"
// @Failure 500 {object} model.ErrorResponse "Ошибка при удалении контента"
// @Tags TextContent
// @Router /v1/projects/content/{block_id} [delete]
func DeleteContentBlock(context *gin.Context) {
	blockID := context.Param("block_id")

	_, err := database.Db.Exec(`DELETE FROM notion_project_content_blocks WHERE id = $1`, blockID)
	if err != nil {
		context.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete content block"})
		return
	}

	context.JSON(http.StatusOK, gin.H{"message": "Content block deleted successfully"})
}
