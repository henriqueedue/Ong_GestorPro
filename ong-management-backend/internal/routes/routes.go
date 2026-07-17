package routes

import (
	"os"

	"github.com/gin-gonic/gin"
	"github.com/ong-gestor-pro/backend/internal/controllers"
	"github.com/ong-gestor-pro/backend/internal/database"
	"github.com/ong-gestor-pro/backend/internal/middleware"
	"github.com/ong-gestor-pro/backend/internal/repositories"
	"github.com/ong-gestor-pro/backend/internal/services"
)

func SetupRoutes(router *gin.Engine) {
	// Repositories
	userRepo := repositories.NewUserRepository(database.DB)
	childRepo := repositories.NewChildRepository(database.DB)
	incidentRepo := repositories.NewIncidentRepository(database.DB)
	medicineRepo := repositories.NewMedicineRepository(database.DB)
	shiftRepo := repositories.NewShiftRepository(database.DB)

	// Services
	authService := services.NewAuthService(userRepo, os.Getenv("JWT_SECRET"))

	// Controllers
	authController := controllers.NewAuthController(authService)
	childController := controllers.NewChildController(childRepo)
	incidentController := controllers.NewIncidentController(incidentRepo)
	medicineController := controllers.NewMedicineController(medicineRepo)
	shiftController := controllers.NewShiftController(shiftRepo)

	// Public routes
	api := router.Group("/api")
	{
		auth := api.Group("/auth")
		{
			auth.POST("/register", authController.Register)
			auth.POST("/login", authController.Login)
		}

		// Protected routes
		protected := api.Group("/")
		protected.Use(middleware.AuthMiddleware())
		{
			children := protected.Group("/children")
			{
				children.POST("/", childController.Create)
				children.GET("/", childController.GetAll)
				children.GET("/:id", childController.GetByID)
				children.PUT("/:id", childController.Update)
				children.DELETE("/:id", childController.Delete)
			}

			incidents := protected.Group("/incidents")
			{
				incidents.POST("/", incidentController.Create)
				incidents.GET("/", incidentController.GetAll)
			}

			medicines := protected.Group("/medicines")
			{
				medicines.POST("/", medicineController.Create)
				medicines.GET("/", medicineController.GetAll)
				medicines.PUT("/:id", medicineController.Update)
				medicines.DELETE("/:id", medicineController.Delete)
			}

			shifts := protected.Group("/shifts")
			{
				shifts.POST("/", shiftController.Create)
				shifts.GET("/", shiftController.GetAll)
				shifts.PUT("/:id", shiftController.Update)
				shifts.DELETE("/:id", shiftController.Delete)
			}
		}
	}
}
