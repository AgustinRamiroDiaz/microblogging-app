package graph

import "api/graph/model"

// This file will not be regenerated automatically.
//
// It serves as dependency injection for your app, add any dependencies you require here.

type Resolver struct {
	users       map[string]*model.User
	userCounter int
	posts       map[string]*model.Post
	postCounter int
}
