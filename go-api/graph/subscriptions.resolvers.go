package graph

// This file will be automatically regenerated based on the schema, any resolver implementations
// will be copied through when generating and any unknown code will be moved to the end.

import (
	"api/graph/generated"
	"api/graph/model"
	"context"
)

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

// Subscription returns generated.SubscriptionResolver implementation.
func (r *Resolver) Subscription() generated.SubscriptionResolver { return &subscriptionResolver{r} }

type subscriptionResolver struct{ *Resolver }
