package repository

import (
	"api/graph/model"
	"context"
	"fmt"
)

type UserRepository interface {
	Create(ctx context.Context, name string) (*model.User, error)
	Get(ctx context.Context, id string) (*model.User, error)
	List(ctx context.Context) ([]*model.User, error)
}

type UserRepositoryInMemory struct {
	UserStorage map[string]*model.User
	UserCounter int
}

func NewUserRepositoryInMemory() UserRepository {
	return &UserRepositoryInMemory{
		UserStorage: make(map[string]*model.User),
		UserCounter: 0,
	}
}

func (r *UserRepositoryInMemory) Create(ctx context.Context, name string) (*model.User, error) {
	id := fmt.Sprintf("%d", r.UserCounter)
	user := &model.User{
		ID:   id,
		Name: name,
	}
	r.UserStorage[id] = user
	r.UserCounter++
	return user, nil
}

func (r *UserRepositoryInMemory) Get(ctx context.Context, id string) (*model.User, error) {
	if user, ok := r.UserStorage[id]; ok {
		return user, nil
	}
	return nil, fmt.Errorf("user not found")
}

func (r *UserRepositoryInMemory) List(ctx context.Context) ([]*model.User, error) {
	users := make([]*model.User, 0, len(r.UserStorage))
	for _, user := range r.UserStorage {
		users = append(users, user)
	}
	return users, nil
}
