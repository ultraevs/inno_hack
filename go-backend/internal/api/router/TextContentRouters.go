package router

import (
	"app/internal/api/controller"
	"github.com/gin-gonic/gin"
)

func (router *Router) TextContentRoutes(group *gin.RouterGroup) {
	group.GET("/projects/:project_id/content", controller.GetProjectContent)
	group.POST("/projects/:project_id/content", controller.AddContentBlock)
	group.PUT("/projects/content/:block_id", controller.UpdateContentBlock)
	group.DELETE("/projects/content/:block_id", controller.DeleteContentBlock)
}
