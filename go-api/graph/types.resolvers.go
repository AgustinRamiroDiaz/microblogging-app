package graph

// This file will be automatically regenerated based on the schema, any resolver implementations
// will be copied through when generating and any unknown code will be moved to the end.

import (
	"api/graph/generated"
	"api/graph/model"
	"context"
)

func (r *postResolver) User(ctx context.Context, obj *model.Post) (*model.User, error) {
	return r.UserRepository.Get(ctx, obj.UserId)
}

func (r *postResolver) Replies(ctx context.Context, obj *model.Post) ([]*model.Post, error) {
	replies := make([]*model.Post, 0, len(obj.RepliesIds))
	for _, replyId := range obj.RepliesIds {
		reply, err := r.PostRepository.Get(ctx, replyId)
		if err != nil {
			return nil, err
		}
		replies = append(replies, reply)
	}
	return replies, nil
}

func (r *postResolver) IsReplyOf(ctx context.Context, obj *model.Post) (*model.Post, error) {
	if obj.IsReplyOfId == "" {
		return nil, nil
	}
	return r.PostRepository.Get(ctx, obj.IsReplyOfId)
}

func (r *userResolver) Posts(ctx context.Context, obj *model.User) ([]*model.Post, error) {
	posts := make([]*model.Post, 0, len(obj.PostsIds))
	for _, postId := range obj.PostsIds {
		post, err := r.PostRepository.Get(ctx, postId)
		if err != nil {
			return nil, err
		}
		posts = append(posts, post)
	}
	return posts, nil
}

// Post returns generated.PostResolver implementation.
func (r *Resolver) Post() generated.PostResolver { return &postResolver{r} }

// User returns generated.UserResolver implementation.
func (r *Resolver) User() generated.UserResolver { return &userResolver{r} }

type postResolver struct{ *Resolver }
type userResolver struct{ *Resolver }
