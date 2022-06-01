import "./App.css";
import "bootstrap/dist/css/bootstrap.css";
import gql from "graphql-tag";
import { useCreateUserMutation } from "./generated/graphql";
import { Route, useLocation } from "wouter";
import { createContext, useContext } from "react";
import { PostsList } from "./components/PostsList";
import { Post } from "./components/Post";
import { Login } from "./components/Login";

export const UserContext = createContext<string | null>(null);

export const useAuth = (requireAuth: boolean) => {
  const userId = useContext(UserContext);
  const [, setLocation] = useLocation();

  if (requireAuth && !userId) setLocation("/login");
  else if (!requireAuth && userId) setLocation("/");
};

function Router({ handleLogin }: { handleLogin: (userId: string) => void }) {
  return (
    <>
      <Route path="/post/:id">{(params) => <Post id={params.id} />}</Route>
      <Route path="/login">
        <Login onLogin={handleLogin} />
      </Route>
      <Route path="/">
        <PostsList />
      </Route>
    </>
  );
}

function App() {
  gql`
    mutation createUser($name: String!) {
      createUser(name: $name) {
        id
      }
    }
  `;

  const [createUser, { data, loading, error }] = useCreateUserMutation();

  const handleLogin = (name: string) => createUser({ variables: { name } });

  if (loading) return <h3>Loading...</h3>;
  if (error) return <h3>Error {error.message}</h3>;

  const userId = data?.createUser?.id ?? "";

  return (
    <UserContext.Provider value={userId}>
      <body className="App-header">
        <div style={{ alignSelf: "center" }}>
          <Router handleLogin={handleLogin} />
        </div>
      </body>
    </UserContext.Provider>
  );
}

export default App;
