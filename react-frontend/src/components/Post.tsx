import gql from "graphql-tag";
import { useGetPostWithRepliesQuery } from "../generated/graphql";
import { Link } from "wouter";
import { useAuth } from "../App";

export function Post({ id }: { id: string }) {
  useAuth(true);

  gql`
    query getPostWithReplies($id: ID!) {
      post(id: $id) {
        text
        user {
          name
        }
        createdAt
        replies {
          user {
            name
          }
          text
          createdAt
          id
          replies {
            user {
              name
            }
            text
            createdAt
            id
          }
        }
        isReplyOf {
          id
          user {
            name
          }
        }
      }
    }
  `;
  const { data, loading, error } = useGetPostWithRepliesQuery({
    variables: { id },
  });

  if (loading || !data) return <>'Loading...'</>;

  if (error) return <>`Error! ${error.message}` </>;

  const post = data.post;
  if (!post) return <>'Post not found'</>;

  return (
    <div style={{ alignSelf: "center" }}>
      <Link href="/">
        <button>Go home</button>
      </Link>
      {!post.isReplyOf && <p>@{post.user.name}</p>}
      {post.isReplyOf && (
        <Link href={`/post/${post.isReplyOf.id}`}>
          <p>
            @{post.user.name} replied to @{post.isReplyOf.user.name}
          </p>
        </Link>
      )}
      <h2>{post.text}</h2>

      {[...post.replies]
        .sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt))
        .map((reply) => (
          <div style={{ marginLeft: "4rem", borderLeft: "1px solid white" }}>
            <Link href={`/post/${reply.id}`}>
              <div style={{ margin: "1rem" }}>
                <p>{reply.user.name} replied</p>
                <h3>{reply.text}</h3>
              </div>
            </Link>

            {[...reply.replies]
              .sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt))
              .map((replyOfReply) => (
                <Link href={`/post/${replyOfReply.id}`}>
                  <div
                    style={{
                      marginLeft: "4rem",
                      borderLeft: "1px solid white",
                    }}
                  >
                    <div style={{ margin: "1rem" }}>
                      <p>{replyOfReply.user.name} replied</p>
                      <h3>{replyOfReply.text}</h3>
                    </div>
                  </div>
                </Link>
              ))}
          </div>
        ))}
    </div>
  );
}
