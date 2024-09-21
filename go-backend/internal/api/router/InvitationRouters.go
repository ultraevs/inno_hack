package router

import (
	"app/internal/api/controller"
	"app/internal/api/middleware"
	"github.com/gin-gonic/gin"
)

func (router *Router) InvitationRoutes(group *gin.RouterGroup) {
	group.POST("/projects/:project_id/invite", middleware.CookieMiddleware(), controller.InviteUserToProject)
	group.POST("/invitations/:invitation_id/respond", middleware.CookieMiddleware(), controller.RespondToInvitation)
	group.GET("/user/invitations", middleware.CookieMiddleware(), controller.GetUserInvitations)
}
