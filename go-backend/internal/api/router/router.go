package router

import (
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	swaggerFiles "github.com/swaggo/files"
	ginSwagger "github.com/swaggo/gin-swagger"
)

type Router struct {
	engine *gin.Engine
}

func NewRouter() Router {
	return Router{engine: gin.Default()}
}

func (router *Router) Run(port string) error {
	router.Setup()
	return router.engine.Run(":" + port)
}

func (router *Router) Setup() {
	gin.SetMode(gin.DebugMode)
	router.engine.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"https://task.shmyaks.ru", "http://localhost:5173"},
		AllowMethods:     []string{"GET", "POST", "OPTIONS"},
		AllowHeaders:     []string{"Content-Type", "Authorization"},
		AllowCredentials: true,
	}))
	router.engine.GET("v1/swagger/*any", ginSwagger.WrapHandler(swaggerFiles.Handler))
	//router.engine.Use(middleware.RateLimiterMiddleware())
	v1 := router.engine.Group("/v1")
	router.AuthRoutes(v1)
	router.ProjectRoutes(v1)
	router.TaskRoutes(v1)
	router.InvitationRoutes(v1)
	router.UserStatisticRoutes(v1)
	router.TextContentRoutes(v1)

}
