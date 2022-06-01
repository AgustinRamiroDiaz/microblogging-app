import gql from "graphql-tag";
import { useRootPostsSubscription } from "../generated/graphql";
import { Link } from "wouter";
import { useAuth } from "../App";
import { PostForm } from "./PostForm";

export function PostsList() {
  useAuth(true);

  gql`
    query getRootPosts {
      rootPosts {
        text
        id
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
      }
    }
  `;

  gql`
    subscription rootPosts {
      rootPosts {
        text
        id
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
      }
    }
  `;

  const { data, loading, error } = useRootPostsSubscription();

  if (loading) return <>'Loading...'</>;

  if (error) return <>`Error! ${error.message}` </>;

  return (
    <div style={{ alignSelf: "center" }}>
      <PostForm />
      {data?.rootPosts
        .sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt))
        .map((post) => (
          <div>
            <Link href={`/post/${post.id}`}>
              <div>
                <p>@{post.user.name}</p>
                <h2>{post.text}</h2>
              </div>
            </Link>

            {[...post.replies]
              .sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt))
              .map((reply) => (
                <div
                  style={{ marginLeft: "4rem", borderLeft: "1px solid white" }}
                >
                  <Link href={`/post/${reply.id}`}>
                    <div style={{ margin: "1rem" }}>
                      <p>@{reply.user.name}</p>
                      <h3>{reply.text}</h3>
                    </div>
                  </Link>

                  {[...reply.replies]
                    .sort(
                      (a, b) =>
                        Date.parse(b.createdAt) - Date.parse(a.createdAt)
                    )
                    .map((replyOfReply) => (
                      <Link href={`/post/${replyOfReply.id}`}>
                        <div
                          style={{
                            marginLeft: "4rem",
                            borderLeft: "1px solid white",
                          }}
                        >
                          <div style={{ margin: "1rem" }}>
                            <p>@{replyOfReply.user.name}</p>
                            <h3>{replyOfReply.text}</h3>
                          </div>
                        </div>
                      </Link>
                    ))}
                </div>
              ))}
          </div>
        ))}
    </div>
  );
}
