import './App.css';
import gql from 'graphql-tag'
import { useGetPostWithRepliesQuery, useRootPostsSubscription, useCreateUserMutation } from './generated/graphql'
import { Route, Link, Redirect, useLocation } from 'wouter';
import { createContext, FormEventHandler, useContext, useState } from 'react';

const UserContext = createContext<string | null>(null)

const useAuth = (requireAuth: boolean) => {
  const userId = useContext(UserContext);
  const [_, setLocation] = useLocation();

  if (requireAuth && !userId) setLocation("/login");
  else if (!requireAuth && userId) setLocation("/");
}

function Router({ handleLogin }: { handleLogin: (userId: string) => void }) {
  return (
    <>
      <Route path="/post/:id">
        {(params) => <Post id={params.id} />}
      </Route>
      <Route path="/login">
        <Login onLogin={handleLogin} />
      </Route>
      <Route path="/">
        <PostsList />
      </Route>
    </>
  );
}


function PostsList() {
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
  `

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
  `

  const { data, loading, error } = useRootPostsSubscription()

  if (loading) return <>'Loading...'</>

  if (error) return <>`Error! ${error.message}` </>

  return <div style={{ alignSelf: 'center' }}>
    {data?.rootPosts.sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt)).map(post =>
      <div>
        <Link href={`/post/${post.id}`}>
          <div>
            <p>@{post.user.name}</p>
            <h2>{post.text}</h2>
          </div>
        </Link>

        {[...post.replies].sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt)).map(reply =>
          <div style={{ marginLeft: '4rem', borderLeft: '1px solid white' }}>
            <Link href={`/post/${reply.id}`}>
              <div style={{ margin: '1rem' }}>
                <p>@{reply.user.name}</p>
                <h3>{reply.text}</h3>
              </div>
            </Link>

            {
              [...reply.replies].sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt)).map(replyOfReply =>
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
    )
    }
  </div>
}


function Post({ id }: { id: string }) {
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
  `
  const { data, loading, error } = useGetPostWithRepliesQuery({ variables: { id } })

  if (loading || !data) return <>'Loading...'</>

  if (error) return <>`Error! ${error.message}` </>

  const post = data.post
  if (!post) return <>'Post not found'</>

  return <div style={{ alignSelf: 'center' }}>
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

    {[...post.replies].sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt)).map(reply =>
      <div style={{ marginLeft: '4rem', borderLeft: '1px solid white' }}>
        <Link href={`/post/${reply.id}`}>
          <div style={{ margin: '1rem' }}>
            <p>{reply.user.name} replied</p>
            <h3>{reply.text}</h3>
          </div>
        </Link>

        {
          [...reply.replies].sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt)).map(replyOfReply =>
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

}

function Login({ onLogin }: { onLogin: (name: string) => void }) {
  useAuth(false);

  const [name, setName] = useState('')
  const setNameReactive = (event: React.ChangeEvent<HTMLInputElement>) => {
    const enteredName = event.target.value;
    setName(enteredName);
  };

  return (
    <form onSubmit={(ev) => {
      ev.preventDefault();
      onLogin(name);
    }}>
      <p>Create your user</p>
      <input type="text" onChange={setNameReactive} value={name} placeholder="cindy lopez" />
      <button type="submit">Log in</button>
    </form>
  )
}

function App() {
  gql`
    mutation createUser($name: String!) {
      createUser(name: $name) {
        id
      }
    }
  `

  const [createUser, { data, loading, error }] = useCreateUserMutation()

  const handleLogin = (name: string) => createUser({ variables: { name } })

  // if (loading) return <h3>LOADING...</h3>
  // if (error) return <h3>ERROR...</h3>

  const userId = data?.createUser?.id ?? '';

  return (
    <UserContext.Provider value={userId}>
      <body className="App-header">
        <Router handleLogin={handleLogin} />
      </body>
    </UserContext.Provider>
  );
}

export default App;
