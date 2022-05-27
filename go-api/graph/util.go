package graph

import "api/graph/model"

func getRootPosts(postsMap map[string]*model.Post) []*model.Post {
	posts := []*model.Post{}
	for _, post := range postsMap {
		if post.IsReplyOf == nil {
			posts = append(posts, post)
		}
	}
	return posts
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
