package graph

// This file will be automatically regenerated based on the schema, any resolver implementations
// will be copied through when generating and any unknown code will be moved to the end.

import (
	"api/graph/generated"
	"api/graph/model"
	"context"
)

func (r *queryResolver) User(ctx context.Context, id string) (*model.User, error) {
	return r.UserRepository.Get(ctx, id)
}

func (r *queryResolver) Users(ctx context.Context) ([]*model.User, error) {
	return r.UserRepository.List(ctx)
}

func (r *queryResolver) Post(ctx context.Context, id string) (*model.Post, error) {
	return r.PostRepository.Get(ctx, id)
}

func (r *queryResolver) RootPosts(ctx context.Context) ([]*model.Post, error) {
	return r.PostRepository.ListRoot(ctx)
}

// Query returns generated.QueryResolver implementation.
func (r *Resolver) Query() generated.QueryResolver { return &queryResolver{r} }

type queryResolver struct{ *Resolver }
