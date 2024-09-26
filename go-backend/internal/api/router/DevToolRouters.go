package router

import (
	"app/internal/api/controller"
	"github.com/gin-gonic/gin"
)

func (router *Router) DevToolRoutes(group *gin.RouterGroup) {
	group.GET("/users/names", controller.GetAllUserNames)
}
