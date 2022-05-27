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

func getRootPost(post *model.Post) *model.Post {
	for post.IsReplyOf != nil {
		post = post.IsReplyOf
	}
	return post
}

// getPostAndReplies returns all post and all its replies recursively.
func getPostAndReplies(post *model.Post) []*model.Post {
	posts := []*model.Post{post}
	for _, reply := range post.Replies {
		posts = append(posts, getPostAndReplies(reply)...)
	}
	return posts
}

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

func (r *subscriptionResolver) RootPosts(ctx context.Context) (<-chan []*model.Post, error) {
	ch := make(chan []*model.Post)
	r.RootPostSubscribers = append(r.RootPostSubscribers, ch)
	go func() {
		ch <- getRootPosts(r.PostStorage)
		<-ctx.Done()
		for i, subscriber := range r.RootPostSubscribers {
			if subscriber == ch {
				r.RootPostSubscribers = append(r.RootPostSubscribers[:i], r.RootPostSubscribers[i+1:]...)
				break
			}
		}
	}()
	return ch, nil
}

func getRootPosts(postsMap map[string]*model.Post) []*model.Post {
	posts := []*model.Post{}
	for _, post := range postsMap {
		if post.IsReplyOf == nil {
			posts = append(posts, post)
		}
	}
	return posts
}

func (r *subscriptionResolver) Post(ctx context.Context, id string) (<-chan *model.Post, error) {
	post := r.PostStorage[id]
	ch := make(chan *model.Post)
	r.PostSubscribers[id] = append(r.PostSubscribers[id], ch)
	go func() {
		ch <- post
		<-ctx.Done()
		for i, subscriber := range r.PostSubscribers[id] {
			if subscriber == ch {
				r.PostSubscribers[id] = append(r.PostSubscribers[id][:i], r.PostSubscribers[id][i+1:]...)
				break
			}
		}
	}()
	return ch, nil
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

// !!! WARNING !!!
// The code below was going to be deleted when updating resolvers. It has been copied here so you have
// one last chance to move it out of harms way if you want. There are two reasons this happens:
//  - When renaming or deleting a resolver the old code will be put in here. You can safely delete
//    it when you're done.
//  - You have helper methods in this file. Move them out to keep these resolver files clean.
func (r *subscriptionResolver) Posts(ctx context.Context) (<-chan []*model.Post, error) {
	panic(fmt.Errorf("not implemented"))
}
