import logo from './logo.svg';
import './App.css';

import gql from 'graphql-tag'
import { useGetRootPostsQuery, useGetPostQuery } from './generated/graphql'

function RootPosts() {
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
      {data?.rootPosts.map(post => <li key={post.id}>{post.text}</li>)}
    </ul>
  </>
}


function Post(props: { id: string }) {
  gql`
    query getPost($id: ID!) {
      post(id: $id) {
        text
      }
    }
  `
  const { data, loading, error } = useGetPostQuery({ variables: { id: props.id } })

  if (loading) return <>'Loading...'</>

  if (error) return <>`Error! ${error.message}` </>

  return <>
    id 0 : {data?.post?.text}
  </>

}

function App() {
  return (
    <header className="App-header">
      <img src={logo} className="App-logo" alt="logo" />
      <RootPosts />
      <Post id='0' />
    </header>
  );
}

export default App;
