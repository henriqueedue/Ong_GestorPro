package models

import (
	"time"

	"gorm.io/gorm"
)

type User struct {
	ID        uint           `gorm:"primaryKey" json:"id"`
	Name      string         `gorm:"size:255;not null" json:"name"`
	Email     string         `gorm:"size:255;not null;unique" json:"email"`
	Password  string         `gorm:"size:255;not null" json:"-"`
	Role      string         `gorm:"size:50;default:'user'" json:"role"`
	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	DeletedAt gorm.DeletedAt `gorm:"index" json:"-"`
}

type Child struct {
	ID        uint           `gorm:"primaryKey" json:"id"`
	Name      string         `gorm:"size:255;not null" json:"name"`
	BirthDate time.Time      `json:"birth_date"`
	Gender    string         `gorm:"size:20" json:"gender"`
	Notes     string         `gorm:"type:text" json:"notes"`
	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	DeletedAt gorm.DeletedAt `gorm:"index" json:"-"`
}

type Incident struct {
	ID          uint           `gorm:"primaryKey" json:"id"`
	ChildID     uint           `json:"child_id"`
	Child       Child          `gorm:"foreignKey:ChildID" json:"child"`
	Title       string         `gorm:"size:255;not null" json:"title"`
	Description string         `gorm:"type:text;not null" json:"description"`
	Date        time.Time      `json:"date"`
	CreatedAt   time.Time      `json:"created_at"`
	UpdatedAt   time.Time      `json:"updated_at"`
	DeletedAt   gorm.DeletedAt `gorm:"index" json:"-"`
}

type Medicine struct {
	ID        uint           `gorm:"primaryKey" json:"id"`
	ChildID   uint           `json:"child_id"`
	Child     Child          `gorm:"foreignKey:ChildID" json:"child"`
	Name      string         `gorm:"size:255;not null" json:"name"`
	Dosage    string         `gorm:"size:100" json:"dosage"`
	Schedule  string         `gorm:"size:255" json:"schedule"`
	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	DeletedAt gorm.DeletedAt `gorm:"index" json:"-"`
}

type Shift struct {
	ID           uint           `gorm:"primaryKey" json:"id"`
	UserID       uint           `json:"user_id"`
	User         User           `gorm:"foreignKey:UserID" json:"user"`
	Shift        string         `gorm:"size:50" json:"shift"`
	Responsible  string         `gorm:"size:255" json:"responsible"`
	StartTime    time.Time      `json:"start_time"`
	EndTime      time.Time      `json:"end_time"`
	Observations string         `gorm:"type:text" json:"observations"`
	Status       string         `gorm:"size:50;default:'scheduled'" json:"status"`
	CreatedAt    time.Time      `json:"created_at"`
	UpdatedAt    time.Time      `json:"updated_at"`
	DeletedAt    gorm.DeletedAt `gorm:"index" json:"-"`
}
