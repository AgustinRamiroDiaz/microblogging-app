package graph

// This file will be automatically regenerated based on the schema, any resolver implementations
// will be copied through when generating and any unknown code will be moved to the end.

import (
	"api/graph/generated"
	"api/graph/model"
	"context"
	"fmt"
	"time"
)

func (r *mutationResolver) CreateUser(ctx context.Context, name string) (*model.User, error) {
	id := fmt.Sprintf("%d", r.userCounter)
	user := &model.User{
		ID:    id,
		Name:  name,
		Posts: []*model.Post{},
	}
	r.users[id] = user
	r.userCounter++
	return user, nil
}

func (r *mutationResolver) Post(ctx context.Context, userID string, text string) (*model.Post, error) {
	id := fmt.Sprintf("%d", r.postCounter)
	post := &model.Post{
		ID:        id,
		Text:      text,
		User:      r.users[userID],
		IsReplyOf: nil,
		CreatedAt: time.Now().Format(time.RFC3339),
		Replies:   []*model.Post{},
	}
	r.posts[id] = post
	r.postCounter++
	return post, nil
}

func (r *mutationResolver) Reply(ctx context.Context, text string, postID string, userID string) (*model.Post, error) {
	panic(fmt.Errorf("not implemented"))
}

func (r *queryResolver) User(ctx context.Context, id string) (*model.User, error) {
	panic(fmt.Errorf("not implemented"))
}

func (r *queryResolver) Users(ctx context.Context) ([]*model.User, error) {
	users := make([]*model.User, 0, len(r.users))
	for _, user := range r.users {
		users = append(users, user)
	}
	return users, nil
}

func (r *queryResolver) Post(ctx context.Context, id string) (*model.Post, error) {
	panic(fmt.Errorf("not implemented"))
}

func (r *queryResolver) RootPosts(ctx context.Context) ([]*model.Post, error) {
	posts := make([]*model.Post, 0)
	for _, post := range r.posts {
		if post.IsReplyOf == nil {
			posts = append(posts, post)
		}
	}
	return posts, nil
}

func (r *subscriptionResolver) Posts(ctx context.Context) (<-chan []*model.Post, error) {
	panic(fmt.Errorf("not implemented"))
}

func (r *subscriptionResolver) Post(ctx context.Context, id string) (<-chan *model.Post, error) {
	panic(fmt.Errorf("not implemented"))
}

// Mutation returns generated.MutationResolver implementation.
func (r *Resolver) Mutation() generated.MutationResolver { return &mutationResolver{r} }

// Query returns generated.QueryResolver implementation.
func (r *Resolver) Query() generated.QueryResolver { return &queryResolver{r} }

// Subscription returns generated.SubscriptionResolver implementation.
func (r *Resolver) Subscription() generated.SubscriptionResolver { return &subscriptionResolver{r} }

type mutationResolver struct{ *Resolver }
type queryResolver struct{ *Resolver }
type subscriptionResolver struct{ *Resolver }
