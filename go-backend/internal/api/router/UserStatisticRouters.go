package router

import (
	"app/internal/api/controller"
	"app/internal/api/middleware"
	"github.com/gin-gonic/gin"
)

func (router *Router) UserStatisticRoutes(group *gin.RouterGroup) {
	group.GET("/users/stats", middleware.CookieMiddleware(), controller.GetUserStats)
	group.GET("/users/info", middleware.CookieMiddleware(), controller.GetUserInfo)
}
