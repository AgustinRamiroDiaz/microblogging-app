package repository

import (
	"api/graph/model"
	"context"
	"fmt"
	"time"
)

type PostRepository interface {
	Create(ctx context.Context, text string, userId string) (*model.Post, error)
	Get(ctx context.Context, id string) (*model.Post, error)
	GetRoot(ctx context.Context, id string) (*model.Post, error)
	GetPostAndReplies(ctx context.Context, id string) ([]*model.Post, error)
	List(ctx context.Context) ([]*model.Post, error)
	ListRoot(ctx context.Context) ([]*model.Post, error)
	Reply(ctx context.Context, text string, postId string, userId string) (*model.Post, error)
}

type PostRepositoryInMemory struct {
	PostStorage map[string]*model.Post
	PostCounter int
}

func NewPostRepositoryInMemory() PostRepository {
	return &PostRepositoryInMemory{
		PostStorage: make(map[string]*model.Post),
		PostCounter: 0,
	}
}

func (r *PostRepositoryInMemory) Create(ctx context.Context, text string, userId string) (*model.Post, error) {
	id := fmt.Sprintf("%d", r.PostCounter)
	post := &model.Post{
		ID:     id,
		Text:   text,
		UserId: userId,
	}
	r.PostStorage[id] = post
	r.PostCounter++
	return post, nil
}

func (r *PostRepositoryInMemory) Get(ctx context.Context, id string) (*model.Post, error) {
	if post, ok := r.PostStorage[id]; ok {
		return post, nil
	}
	return nil, fmt.Errorf("post not found")
}

func (r *PostRepositoryInMemory) GetRoot(ctx context.Context, id string) (*model.Post, error) {
	post, err := r.Get(ctx, id)
	if err != nil {
		return nil, err
	}

	for post.IsReplyOfId != "" {
		post, err = r.Get(ctx, post.IsReplyOfId)
		if err != nil {
			return nil, err
		}
	}
	return post, nil
}

func (r *PostRepositoryInMemory) GetPostAndReplies(ctx context.Context, id string) ([]*model.Post, error) {
	post, err := r.Get(ctx, id)
	if err != nil {
		return nil, err
	}

	posts := []*model.Post{post}
	for post.IsReplyOfId != "" {
		post, err = r.Get(ctx, post.IsReplyOfId)
		if err != nil {
			return nil, err
		}
		posts = append(posts, post)
	}
	return posts, nil
}

func (r *PostRepositoryInMemory) List(ctx context.Context) ([]*model.Post, error) {
	posts := make([]*model.Post, 0, len(r.PostStorage))
	for _, post := range r.PostStorage {
		posts = append(posts, post)
	}
	return posts, nil
}

func (r *PostRepositoryInMemory) ListRoot(ctx context.Context) ([]*model.Post, error) {
	posts := make([]*model.Post, 0, len(r.PostStorage))
	for _, post := range r.PostStorage {
		if post.IsReplyOfId == "" {
			posts = append(posts, post)
		}
	}
	return posts, nil
}

func (r *PostRepositoryInMemory) Reply(ctx context.Context, text string, postId string, userId string) (*model.Post, error) {
	post, ok := r.PostStorage[postId]
	if !ok {
		return nil, fmt.Errorf("post not found")
	}
	replyId := fmt.Sprintf("%d", r.PostCounter)
	reply := &model.Post{
		ID:          replyId,
		Text:        text,
		UserId:      userId,
		IsReplyOfId: postId,
		CreatedAt:   time.Now().Format(time.RFC3339),
	}
	post.RepliesIds = append(post.RepliesIds, replyId)
	r.PostCounter++
	return reply, nil
}
