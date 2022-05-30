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
    <ul>
      {data?.rootPosts.map(post =>
        <li key={post.id}>
          <Link href={`/post/${post.id}`}>{post.text}</Link>
        </li>)}
    </ul>
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
    {!post.isReplyOf && <h6>{post.user.name} posted at {post.createdAt}</h6>}
    {post.isReplyOf && <h6>{post.user.name} replied to {post.isReplyOf.user.name} at {post.createdAt}</h6>}
    <h1>{post.text}</h1>
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
