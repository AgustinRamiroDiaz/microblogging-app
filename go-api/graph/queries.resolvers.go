package graph

// This file will be automatically regenerated based on the schema, any resolver implementations
// will be copied through when generating and any unknown code will be moved to the end.

import (
	"api/graph/generated"
	"api/graph/model"
	"context"
	"fmt"
)

func (r *queryResolver) User(ctx context.Context, id string) (*model.User, error) {
	if user, ok := r.UserStorage[id]; ok {
		return user, nil
	}
	return nil, fmt.Errorf("user not found")
}

func (r *queryResolver) Users(ctx context.Context) ([]*model.User, error) {
	users := make([]*model.User, 0, len(r.UserStorage))
	for _, user := range r.UserStorage {
		users = append(users, user)
	}
	return users, nil
}

func (r *queryResolver) Post(ctx context.Context, id string) (*model.Post, error) {
	if post, ok := r.PostStorage[id]; ok {
		return post, nil
	}
	return nil, fmt.Errorf("post not found")
}

func (r *queryResolver) RootPosts(ctx context.Context) ([]*model.Post, error) {
	return getRootPosts(r.PostStorage), nil
}

// Query returns generated.QueryResolver implementation.
func (r *Resolver) Query() generated.QueryResolver { return &queryResolver{r} }

type queryResolver struct{ *Resolver }
