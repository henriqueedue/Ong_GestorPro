package controllers

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/manus/ong-management-backend/internal/models"
	"github.com/manus/ong-management-backend/internal/repositories"
)

type ChildController struct {
	repo repositories.ChildRepository
}

func NewChildController(repo repositories.ChildRepository) *ChildController {
	return &ChildController{repo}
}

func (c *ChildController) Create(ctx *gin.Context) {
	var child models.Child
	if err := ctx.ShouldBindJSON(&child); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := c.repo.Create(&child); err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create child"})
		return
	}

	ctx.JSON(http.StatusCreated, child)
}

func (c *ChildController) GetAll(ctx *gin.Context) {
	children, err := c.repo.FindAll()
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch children"})
		return
	}

	ctx.JSON(http.StatusOK, children)
}

func (c *ChildController) GetByID(ctx *gin.Context) {
	id, _ := strconv.Atoi(ctx.Param("id"))
	child, err := c.repo.FindByID(uint(id))
	if err != nil {
		ctx.JSON(http.StatusNotFound, gin.H{"error": "Child not found"})
		return
	}

	ctx.JSON(http.StatusOK, child)
}
