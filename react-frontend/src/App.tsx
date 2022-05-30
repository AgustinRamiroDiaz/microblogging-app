import logo from './logo.svg';
import './App.css';

import gql from 'graphql-tag'
import { useRootPostsQuery } from './generated/graphql'

function Test() {
  gql`
    query RootPosts {
      rootPosts {
        text
        id
      }
    }
    `

  const { data, loading, error } = useRootPostsQuery()
  console.log(loading)
  console.log(error)
  if (loading) return <>'Loading...'</>

  if (error) return <>`Error! ${error.message}` </>

  console.log(data?.rootPosts)

  return <>
    <ul>
      {data?.rootPosts.map(post => <li key={post.id}>{post.text}</li>)}
    </ul>
  </>
}

function App() {
  return (
    <header className="App-header">
      <img src={logo} className="App-logo" alt="logo" />
      <Test />
    </header>
  );
}

export default App;
