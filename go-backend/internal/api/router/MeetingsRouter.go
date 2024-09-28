package router

import (
	"app/internal/api/controller"
	"app/internal/api/middleware"
	"github.com/gin-gonic/gin"
)

func (router *Router) MeetingsRoutes(group *gin.RouterGroup) {
	group.POST("/meetings/", middleware.CookieMiddleware(), controller.CreateMeeting)
	group.POST("/meetings/:meeting_id/invite", middleware.CookieMiddleware(), controller.InviteUserToMeeting)
	group.GET("/users/meetings", middleware.CookieMiddleware(), controller.GetUserMeetings)
	group.GET("/meetings/:meeting_id", middleware.CookieMiddleware(), controller.GetMeetingDetails)
}
