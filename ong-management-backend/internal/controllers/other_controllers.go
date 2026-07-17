package controllers

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/ong-gestor-pro/backend/internal/models"
	"github.com/ong-gestor-pro/backend/internal/repositories"
)

// Incident Controller
type IncidentController struct{ repo repositories.IncidentRepository }
func NewIncidentController(repo repositories.IncidentRepository) *IncidentController { return &IncidentController{repo} }
func (c *IncidentController) Create(ctx *gin.Context) {
	var incident models.Incident
	if err := ctx.ShouldBindJSON(&incident); err != nil { ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()}); return }

	if _, exists := ctx.Get("user_id"); !exists {
		ctx.JSON(http.StatusUnauthorized, gin.H{"error": "User not found in context"})
		return
	}

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
	childIdStr := ctx.Query("child_id")
	childId, err := strconv.Atoi(childIdStr)
	if err != nil || childId == 0 {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "child_id invalido ou ausente"})
		return
	}

	medicines, err := c.repo.FindAll(uint(childId))
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch medicines"})
		return
	}
	ctx.JSON(http.StatusOK, medicines)
}
func (c *MedicineController) Update(ctx *gin.Context) {
	id, _ := strconv.Atoi(ctx.Param("id"))
	var medicine models.Medicine
	if err := ctx.ShouldBindJSON(&medicine); err != nil { ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()}); return }
	medicine.ID = uint(id)
	if err := c.repo.Update(&medicine); err != nil { ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update medicine"}); return }
	ctx.JSON(http.StatusOK, medicine)
}
func (c *MedicineController) Delete(ctx *gin.Context) {
	id, _ := strconv.Atoi(ctx.Param("id"))
	if err := c.repo.Delete(uint(id)); err != nil { ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete medicine"}); return }
	ctx.JSON(http.StatusOK, gin.H{"message": "Medicine deleted successfully"})
}

// Shift Controller
type ShiftController struct{ repo repositories.ShiftRepository }
func NewShiftController(repo repositories.ShiftRepository) *ShiftController { return &ShiftController{repo} }
func (c *ShiftController) Create(ctx *gin.Context) {
	var shift models.Shift
	if err := ctx.ShouldBindJSON(&shift); err != nil { ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()}); return }

	userID, exists := ctx.Get("user_id")
	if !exists { ctx.JSON(http.StatusUnauthorized, gin.H{"error": "User not found in context"}); return }
	shift.UserID = userID.(uint)

	if err := c.repo.Create(&shift); err != nil { ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create shift"}); return }
	ctx.JSON(http.StatusCreated, shift)
}
func (c *ShiftController) GetAll(ctx *gin.Context) {
	shifts, err := c.repo.FindAll()
	if err != nil { ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch shifts"}); return }
	ctx.JSON(http.StatusOK, shifts)
}
func (c *ShiftController) Update(ctx *gin.Context) {
	id, _ := strconv.Atoi(ctx.Param("id"))
	var shift models.Shift
	if err := ctx.ShouldBindJSON(&shift); err != nil { ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()}); return }
	shift.ID = uint(id)
	if err := c.repo.Update(&shift); err != nil { ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update shift"}); return }
	ctx.JSON(http.StatusOK, shift)
}
func (c *ShiftController) Delete(ctx *gin.Context) {
	id, _ := strconv.Atoi(ctx.Param("id"))
	if err := c.repo.Delete(uint(id)); err != nil { ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete shift"}); return }
	ctx.JSON(http.StatusOK, gin.H{"message": "Shift deleted successfully"})
}
