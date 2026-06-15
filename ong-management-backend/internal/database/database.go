package database

import (
	"fmt"
	"log"
	"os"

	"github.com/manus/ong-management-backend/internal/models"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

var DB *gorm.DB

func ConnectDB() {
	dbUser := os.Getenv("DB_USER")
	dbPass := os.Getenv("DB_PASSWORD")
	dbHost := os.Getenv("DB_HOST")
	dbPort := os.Getenv("DB_PORT")
	dbName := os.Getenv("DB_NAME")

	fmt.Println("DB_USER =", dbUser)
	fmt.Println("DB_HOST =", dbHost)
	fmt.Println("DB_PORT =", dbPort)
	fmt.Println("DB_NAME =", dbName)

	dsn := fmt.Sprintf("%s:%s@tcp(%s:%s)/%s?charset=utf8mb4&parseTime=True&loc=Local",
		dbUser, dbPass, dbHost, dbPort, dbName)

	db, err := gorm.Open(mysql.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatal("Failed to connect to database:", err)
	}

	fmt.Println("Database connection established")

	// Auto Migration
	err = db.AutoMigrate(
		&models.User{},
		&models.Child{},
		&models.Incident{},
		&models.Medicine{},
		&models.Shift{},
	)
	if err != nil {
		log.Fatal("Failed to migrate database:", err)
	}

	fmt.Println("Database migration completed")
	DB = db
}
