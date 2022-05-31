import logo from './logo.svg';
import './App.css';

import gql from 'graphql-tag'
import { useGetRootPostsQuery, useGetPostWithRepliesQuery } from './generated/graphql'
import { Route, Link } from 'wouter';


function Router() {
  return (
    <>
      <Route path="/post/:id">
        {(params) => <Post id={params.id} />}
      </Route>
      <Route path="/">
        <PostsList />
      </Route>
    </>
  );
}


function PostsList() {
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
  `
  const { data, loading, error } = useGetRootPostsQuery()

  if (loading) return <>'Loading...'</>

  if (error) return <>`Error! ${error.message}` </>

  return <>
    {data?.rootPosts.map(post =>
      <div style={{ margin: "2rem" }}>
        <Link href={`/post/${post.id}`}>
          <div>
            <p>@{post.user.name}</p>
            <h2>{post.text}</h2>
          </div>
        </Link>
        {post.replies.map(reply =>
          <div style={{ marginLeft: '4rem', borderLeft: '1px solid white' }}>
            <Link href={`/post/${reply.id}`}>
              <div style={{ margin: '1rem' }}>
                <p>@{reply.user.name}</p>
                <h3>{reply.text}</h3>
              </div>
            </Link>

            {
              reply.replies.map(replyOfReply =>
                <Link href={`/post/${replyOfReply.id}`}>
                  <div style={{ marginLeft: '4rem', borderLeft: '1px solid white' }}>
                    <div style={{ margin: '1rem' }}>

                      <p>@{replyOfReply.user.name}</p>
                      <h3>{replyOfReply.text}</h3>
                    </div>
                  </div>
                </Link>
              )
            }
          </div>

        )}
      </div>
    )}
  </>
}


function Post({ id }: { id: string }) {
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
  `
  const { data, loading, error } = useGetPostWithRepliesQuery({ variables: { id } })

  if (loading || !data) return <>'Loading...'</>

  if (error) return <>`Error! ${error.message}` </>

  const post = data.post
  if (!post) return <>'Post not found'</>

  return <>
    <div style={{ margin: "2rem" }}>
      <Link href='/'><button>
        Go home
      </button>
      </Link>
      {!post.isReplyOf && <p>@{post.user.name}</p>}
      {
        post.isReplyOf && <Link href={`/post/${post.isReplyOf.id}`}>
          <p>@{post.user.name} replied to @{post.isReplyOf.user.name}</p>
        </Link>
      }
      <h2>{post.text}</h2>

      {post.replies.map(reply =>
        <div style={{ marginLeft: '4rem', borderLeft: '1px solid white' }}>
          <Link href={`/post/${reply.id}`}>
            <div style={{ margin: '1rem' }}>
              <p>{reply.user.name} replied</p>
              <h3>{reply.text}</h3>
            </div>
          </Link>

          {
            reply.replies.map(replyOfReply =>
              <Link href={`/post/${replyOfReply.id}`}>
                <div style={{ marginLeft: '4rem', borderLeft: '1px solid white' }}>
                  <div style={{ margin: '1rem' }}>

                    <p>{replyOfReply.user.name} replied</p>
                    <h3>{replyOfReply.text}</h3>
                  </div>
                </div>
              </Link>
            )
          }
        </div>

      )}
    </div>
  </>

}

function App() {
  return (
    <>
      <body className="App-header">
        <Router />
      </body>
    </>
  );
}

export default App;
