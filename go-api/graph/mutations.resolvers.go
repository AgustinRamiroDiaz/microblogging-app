package graph

// This file will be automatically regenerated based on the schema, any resolver implementations
// will be copied through when generating and any unknown code will be moved to the end.

import (
	"api/graph/generated"
	"api/graph/model"
	"context"
	"fmt"
)

func (r *mutationResolver) CreateUser(ctx context.Context, name string) (*model.User, error) {
	return r.UserRepository.Create(ctx, name)
}

func (r *mutationResolver) Post(ctx context.Context, userID string, text string) (*model.Post, error) {
	post, err := r.PostRepository.Create(ctx, text, userID)

	if err != nil {
		return nil, err
	}

	rootRepositories, err := r.PostRepository.ListRoot(ctx)
	if err != nil {
		fmt.Printf("error getting root posts: %s", err.Error())
		return post, nil
	}

	for _, subscriber := range r.RootPostSubscribers {
		subscriber <- rootRepositories
	}

	return post, nil
}

func (r *mutationResolver) Reply(ctx context.Context, text string, postID string, userID string) (*model.Post, error) {
	reply, err := r.PostRepository.Reply(ctx, text, postID, userID)

	if err != nil {
		return nil, err
	}

	rootPost, err := r.PostRepository.GetRoot(ctx, postID)

	if err != nil {
		fmt.Printf("error getting root post: %s", err.Error())
		return reply, nil
	}

	postAndReplies, err := r.PostRepository.GetPostAndReplies(ctx, rootPost.ID)

	if err != nil {
		fmt.Printf("error getting post and replies: %s", err.Error())
		return reply, nil
	}

	for _, p := range postAndReplies {
		subscribers, ok := r.PostSubscribers[p.ID]
		if !ok {
			continue
		}
		for _, subscriber := range subscribers {
			subscriber <- p
		}
	}

	rootRepositories, err := r.PostRepository.ListRoot(ctx)
	if err != nil {
		fmt.Printf("error getting root posts: %s", err.Error())
		return reply, nil
	}
	for _, subscriber := range r.RootPostSubscribers {
		subscriber <- rootRepositories
	}

	return reply, nil
}

// Mutation returns generated.MutationResolver implementation.
func (r *Resolver) Mutation() generated.MutationResolver { return &mutationResolver{r} }

type mutationResolver struct{ *Resolver }
