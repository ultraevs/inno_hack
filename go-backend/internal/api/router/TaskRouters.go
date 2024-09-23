package router

import (
	"app/internal/api/controller"
	"github.com/gin-gonic/gin"
)

func (router *Router) TaskRoutes(group *gin.RouterGroup) {
	group.POST("/projects/:project_id/tasks", controller.CreateTask)
	group.GET("/projects/:project_id/tasks/:task_id", controller.GetTask)
	group.PUT("/projects/:project_id/tasks/:task_id", controller.UpdateTask)
	group.DELETE("/projects/:project_id/tasks/:task_id", controller.DeleteTask)
}
