package router

import (
	"app/internal/api/controller"
	"github.com/gin-gonic/gin"
)

func (router *Router) InvitationRoutes(group *gin.RouterGroup) {
	group.POST("/projects/:project_id/invite", controller.InviteUserToProject)
	group.POST("/invitations/:invitation_id/respond", controller.RespondToInvitation)
	group.GET("/user/invitations", controller.GetUserInvitations)
}
