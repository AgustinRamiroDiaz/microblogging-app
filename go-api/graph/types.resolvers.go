package graph

// This file will be automatically regenerated based on the schema, any resolver implementations
// will be copied through when generating and any unknown code will be moved to the end.

import (
	"api/graph/generated"
	"api/graph/model"
	"context"
	"fmt"
)

func (r *postResolver) User(ctx context.Context, obj *model.Post) (*model.User, error) {
	panic(fmt.Errorf("not implemented"))
}

func (r *postResolver) Replies(ctx context.Context, obj *model.Post) ([]*model.Post, error) {
	panic(fmt.Errorf("not implemented"))
}

func (r *postResolver) IsReplyOf(ctx context.Context, obj *model.Post) (*model.Post, error) {
	panic(fmt.Errorf("not implemented"))
}

func (r *userResolver) Posts(ctx context.Context, obj *model.User) ([]*model.Post, error) {
	panic(fmt.Errorf("not implemented"))
}

// Post returns generated.PostResolver implementation.
func (r *Resolver) Post() generated.PostResolver { return &postResolver{r} }

// User returns generated.UserResolver implementation.
func (r *Resolver) User() generated.UserResolver { return &userResolver{r} }

type postResolver struct{ *Resolver }
type userResolver struct{ *Resolver }
