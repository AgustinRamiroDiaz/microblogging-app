import logo from './logo.svg';
import './App.css';

import gql from 'graphql-tag'
import { useGetRootPostsQuery, useGetPostQuery } from './generated/graphql'
import { useState } from 'react';

gql`
query getRootPosts {
  rootPosts {
    text
    id
  }
}
`

function RootPosts() {
  const [postId, setPostId] = useState(null as string | null);

  if (postId === null) return <PostsList onSelect={setPostId} />

  return <Post id={postId} onExit={() => setPostId(null)} />
}


function PostsList({ onSelect }: { onSelect: (postId: string) => void }) {
  const { data, loading, error } = useGetRootPostsQuery()

  if (loading) return <>'Loading...'</>

  if (error) return <>`Error! ${error.message}` </>

  return <>
    <ul>
      {data?.rootPosts.map(post =>
        <li key={post.id}>

          <button onClick={() => onSelect(post.id)}>{post.text}</button>
        </li>)}
    </ul>
  </>
}


function Post({ id, onExit }: { id: string, onExit: () => void }) {
  gql`
    query getPost($id: ID!) {
      post(id: $id) {
        text
      }
    }
  `
  const { data, loading, error } = useGetPostQuery({ variables: { id } })

  if (loading) return <>'Loading...'</>

  if (error) return <>`Error! ${error.message}` </>

  return <>
    id 0 : {data?.post?.text}
    <button onClick={onExit}>Go back</button>
  </>

}

function App() {
  return (
    <header className="App-header">
      <img src={logo} className="App-logo" alt="logo" />
      <RootPosts />
    </header>
  );
}

export default App;
