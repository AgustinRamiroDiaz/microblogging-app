package graph

import "api/graph/model"

// This file will not be regenerated automatically.
//
// It serves as dependency injection for your app, add any dependencies you require here.

type Resolver struct {
	UserStorage         map[string]*model.User
	userCounter         int
	PostStorage         map[string]*model.Post
	postCounter         int
	PostSubscribers     map[string][]chan *model.Post
	RootPostSubscribers []chan []*model.Post
}
