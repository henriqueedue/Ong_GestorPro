package repositories

import (
	"github.com/ong-gestor-pro/backend/internal/models"
	"gorm.io/gorm"
)

type ChildRepository interface {
	Create(child *models.Child) error
	FindAll() ([]models.Child, error)
	FindByID(id uint) (*models.Child, error)
	Update(child *models.Child) error
	Delete(id uint) error
}

type childRepository struct {
	db *gorm.DB
}

func NewChildRepository(db *gorm.DB) ChildRepository {
	return &childRepository{db}
}

func (r *childRepository) Create(child *models.Child) error {
	return r.db.Create(child).Error
}

func (r *childRepository) FindAll() ([]models.Child, error) {
	var children []models.Child
	err := r.db.Find(&children).Error
	return children, err
}

func (r *childRepository) FindByID(id uint) (*models.Child, error) {
	var child models.Child
	err := r.db.First(&child, id).Error
	return &child, err
}

func (r *childRepository) Update(child *models.Child) error {
	return r.db.Save(child).Error
}

func (r *childRepository) Delete(id uint) error {
	return r.db.Delete(&models.Child{}, id).Error
}
