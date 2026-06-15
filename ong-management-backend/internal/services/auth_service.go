package services

import (
	"errors"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"github.com/manus/ong-management-backend/internal/models"
	"github.com/manus/ong-management-backend/internal/repositories"
	"golang.org/x/crypto/bcrypt"
)

type AuthService interface {
	Register(name, email, password string) error
	Login(email, password string) (string, error)
}

type authService struct {
	userRepo repositories.UserRepository
	secret   string
}

func NewAuthService(userRepo repositories.UserRepository, secret string) AuthService {
	return &authService{userRepo, secret}
}

func (s *authService) Register(name, email, password string) error {
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return err
	}

	user := &models.User{
		Name:     name,
		Email:    email,
		Password: string(hashedPassword),
	}

	return s.userRepo.Create(user)
}

func (s *authService) Login(email, password string) (string, error) {
	user, err := s.userRepo.FindByEmail(email)
	if err != nil {
		return "", errors.New("invalid credentials")
	}

	err = bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(password))
	if err != nil {
		return "", errors.New("invalid credentials")
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"user_id": user.ID,
		"exp":     time.Now().Add(time.Hour * 24).Unix(),
	})

	return token.SignedString([]byte(s.secret))
}
