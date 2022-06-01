package graph

import (
	"api/graph/model"
	"api/repository"
)

// This file will not be regenerated automatically.
//
// It serves as dependency injection for your app, add any dependencies you require here.

type Resolver struct {
	UserRepository      repository.UserRepository
	PostRepository      repository.PostRepository
	PostSubscribers     map[string][]chan *model.Post
	RootPostSubscribers []chan []*model.Post
}
