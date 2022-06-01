package model

type Post struct {
	ID          string   `json:"id"`
	Text        string   `json:"text"`
	CreatedAt   string   `json:"createdAt"`
	User        *User    `json:"user"`
	UserId      string   `json:"userId"`
	Replies     []*Post  `json:"replies"`
	RepliesIds  []string `json:"repliesIds"`
	IsReplyOf   *Post    `json:"isReplyOf"`
	IsReplyOfId string   `json:"isReplyOfId"`
}
