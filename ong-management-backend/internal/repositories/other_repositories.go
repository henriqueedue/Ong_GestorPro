package repositories

import (
	"github.com/ong-gestor-pro/backend/internal/models"
	"gorm.io/gorm"
)

// Incident Repository
type IncidentRepository interface {
	Create(incident *models.Incident) error
	FindAll() ([]models.Incident, error)
}

type incidentRepository struct {
	db *gorm.DB
}

func NewIncidentRepository(db *gorm.DB) IncidentRepository { return &incidentRepository{db} }
func (r *incidentRepository) Create(incident *models.Incident) error { return r.db.Create(incident).Error }
func (r *incidentRepository) FindAll() ([]models.Incident, error) {
	var incidents []models.Incident
	err := r.db.Preload("Child").Find(&incidents).Error
	return incidents, err
}

// Medicine Repository
type MedicineRepository interface {
	Create(medicine *models.Medicine) error
	FindAll() ([]models.Medicine, error)
}

type medicineRepository struct {
	db *gorm.DB
}

func NewMedicineRepository(db *gorm.DB) MedicineRepository { return &medicineRepository{db} }
func (r *medicineRepository) Create(medicine *models.Medicine) error { return r.db.Create(medicine).Error }
func (r *medicineRepository) FindAll() ([]models.Medicine, error) {
	var medicines []models.Medicine
	err := r.db.Preload("Child").Find(&medicines).Error
	return medicines, err
}

// Shift Repository
type ShiftRepository interface {
	Create(shift *models.Shift) error
	FindAll() ([]models.Shift, error)
}

type shiftRepository struct {
	db *gorm.DB
}

func NewShiftRepository(db *gorm.DB) ShiftRepository { return &shiftRepository{db} }
func (r *shiftRepository) Create(shift *models.Shift) error { return r.db.Create(shift).Error }
func (r *shiftRepository) FindAll() ([]models.Shift, error) {
	var shifts []models.Shift
	err := r.db.Preload("User").Find(&shifts).Error
	return shifts, err
}
