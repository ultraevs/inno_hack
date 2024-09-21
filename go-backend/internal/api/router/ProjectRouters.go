package router

import (
	"app/internal/api/controller"
	"app/internal/api/middleware"
	"github.com/gin-gonic/gin"
)

func (router *Router) ProjectRoutes(group *gin.RouterGroup) {
	group.POST("/project_create", middleware.CookieMiddleware(), controller.ProjectCreate)
	group.PUT("/projects/:project_id/view", controller.ChangeProjectView)
	group.GET("/projects/:project_id", controller.GetProjectDetails)
	group.GET("/user/projects", middleware.CookieMiddleware(), controller.GetProjects)
}
