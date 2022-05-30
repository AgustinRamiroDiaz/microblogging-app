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
    }
  }
  `
  const { data, loading, error } = useGetRootPostsQuery()

  if (loading) return <>'Loading...'</>

  if (error) return <>`Error! ${error.message}` </>

  return <>
    {data?.rootPosts.map(post =>
      <Link href={`/post/${post.id}`}>
        <p>
          {post.text}
        </p>
      </Link>
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
    <Link href='/'><p>
      Go home
    </p>
    </Link>
    {!post.isReplyOf && <p>{post.user.name} posted at {post.createdAt}</p>}
    {
      post.isReplyOf && <Link href={`/post/${post.isReplyOf.id}`}>
        <p>{post.user.name} replied to {post.isReplyOf.user.name} at {post.createdAt}</p>
      </Link>
    }

    <h1>{post.text}</h1>
    <ul>
      {post.replies.map(reply =>
        <li key={reply.id}>
          <Link href={`/post/${reply.id}`}>
            <div>
              <p>{reply.user.name} replied at {reply.createdAt}</p>
              <h2>{reply.text}</h2>
            </div>
          </Link>

          {reply.replies.map(replyOfReply =>
            <Link href={`/post/${replyOfReply.id}`}>
              <>
                TABULADO
                <p>{replyOfReply.user.name} replied at {replyOfReply.createdAt}</p>
                <h2>{replyOfReply.text}</h2>
              </>
            </Link>
          )}

        </li>)}
    </ul>
  </>

}

function App() {
  return (
    <header className="App-header">
      <img src={logo} className="App-logo" alt="logo" />
      <Router />
    </header>
  );
}

export default App;
