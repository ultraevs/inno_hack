package middleware

import (
	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v4"
	"net/http"
	"os"
)

func CookieMiddleware() gin.HandlerFunc {
	return func(context *gin.Context) {
		tokenString, err := context.Cookie("Authtoken")
		if err != nil {
			context.JSON(http.StatusUnauthorized, gin.H{"error": "No Token"})
			context.Abort()
			return
		}

		token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
			return []byte(os.Getenv("SECRET")), nil
		})
		if err != nil {
			context.JSON(http.StatusUnauthorized, gin.H{"error": "Bad Token"})
			context.Abort()
			return
		}

		if claims, ok := token.Claims.(jwt.MapClaims); ok && token.Valid {
			Email := claims["sub"].(string)
			context.Set("Email", Email)
			context.Next()
		} else {
			context.JSON(http.StatusUnauthorized, gin.H{"error": "Bad Token"})
			context.Abort()
			return
		}
	}
}
