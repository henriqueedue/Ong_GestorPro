package controllers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/manus/ong-management-backend/internal/models"
	"github.com/manus/ong-management-backend/internal/repositories"
)

// Incident Controller
type IncidentController struct{ repo repositories.IncidentRepository }
func NewIncidentController(repo repositories.IncidentRepository) *IncidentController { return &IncidentController{repo} }
func (c *IncidentController) Create(ctx *gin.Context) {
	var incident models.Incident
	if err := ctx.ShouldBindJSON(&incident); err != nil { ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()}); return }
	if err := c.repo.Create(&incident); err != nil { ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create incident"}); return }
	ctx.JSON(http.StatusCreated, incident)
}
func (c *IncidentController) GetAll(ctx *gin.Context) {
	incidents, err := c.repo.FindAll()
	if err != nil { ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch incidents"}); return }
	ctx.JSON(http.StatusOK, incidents)
}

// Medicine Controller
type MedicineController struct{ repo repositories.MedicineRepository }
func NewMedicineController(repo repositories.MedicineRepository) *MedicineController { return &MedicineController{repo} }
func (c *MedicineController) Create(ctx *gin.Context) {
	var medicine models.Medicine
	if err := ctx.ShouldBindJSON(&medicine); err != nil { ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()}); return }
	if err := c.repo.Create(&medicine); err != nil { ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create medicine"}); return }
	ctx.JSON(http.StatusCreated, medicine)
}
func (c *MedicineController) GetAll(ctx *gin.Context) {
	medicines, err := c.repo.FindAll()
	if err != nil { ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch medicines"}); return }
	ctx.JSON(http.StatusOK, medicines)
}

// Shift Controller
type ShiftController struct{ repo repositories.ShiftRepository }
func NewShiftController(repo repositories.ShiftRepository) *ShiftController { return &ShiftController{repo} }
func (c *ShiftController) Create(ctx *gin.Context) {
	var shift models.Shift
	if err := ctx.ShouldBindJSON(&shift); err != nil { ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()}); return }
	if err := c.repo.Create(&shift); err != nil { ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create shift"}); return }
	ctx.JSON(http.StatusCreated, shift)
}
func (c *ShiftController) GetAll(ctx *gin.Context) {
	shifts, err := c.repo.FindAll()
	if err != nil { ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch shifts"}); return }
	ctx.JSON(http.StatusOK, shifts)
}
