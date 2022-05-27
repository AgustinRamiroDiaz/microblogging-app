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
	r.UserStorage[id] = user
	r.userCounter++
	return user, nil
}

func (r *mutationResolver) Post(ctx context.Context, userID string, text string) (*model.Post, error) {
	user, ok := r.UserStorage[userID]
	if !ok {
		return nil, fmt.Errorf("user not found")
	}

	id := fmt.Sprintf("%d", r.postCounter)
	post := &model.Post{
		ID:        id,
		Text:      text,
		User:      user,
		IsReplyOf: nil,
		CreatedAt: time.Now().Format(time.RFC3339),
		Replies:   []*model.Post{},
	}
	user.Posts = append(user.Posts, post)
	r.PostStorage[id] = post
	r.postCounter++

	for _, subscriber := range r.RootPostSubscribers {
		subscriber <- getRootPosts(r.PostStorage)
	}

	return post, nil
}

func (r *mutationResolver) Reply(ctx context.Context, text string, postID string, userID string) (*model.Post, error) {
	post, ok := r.PostStorage[postID]
	if !ok {
		return nil, fmt.Errorf("post not found")
	}
	id := fmt.Sprintf("%d", r.postCounter)
	user := r.UserStorage[userID]
	reply := &model.Post{
		ID:        id,
		Text:      text,
		User:      user,
		IsReplyOf: post,
		CreatedAt: time.Now().Format(time.RFC3339),
		Replies:   []*model.Post{},
	}
	post.Replies = append(post.Replies, reply)
	user.Posts = append(user.Posts, reply)
	r.PostStorage[id] = reply
	r.postCounter++

	for _, p := range getPostAndReplies(getRootPost(post)) {
		subscribers, ok := r.PostSubscribers[p.ID]
		if !ok {
			continue
		}
		for _, subscriber := range subscribers {
			subscriber <- p
		}
	}

	for _, subscriber := range r.RootPostSubscribers {
		subscriber <- getRootPosts(r.PostStorage)
	}

	return reply, nil
}

// Mutation returns generated.MutationResolver implementation.
func (r *Resolver) Mutation() generated.MutationResolver { return &mutationResolver{r} }

type mutationResolver struct{ *Resolver }
