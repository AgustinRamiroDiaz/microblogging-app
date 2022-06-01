import gql from "graphql-tag";
import { Button } from "react-bootstrap";
import { useCreatePostMutation } from "../generated/graphql";
import { useContext, useState } from "react";
import { useAuth, UserContext } from "../App";

export function PostForm() {
  useAuth(true);
  const userId = useContext(UserContext);

  gql`
    mutation createPost($text: String!, $userId: ID!) {
      post(userId: $userId, text: $text) {
        id
      }
    }
  `;

  const [createPost] = useCreatePostMutation();

  const [text, setText] = useState("");

  return (
    <form
      onSubmit={(ev) => {
        ev.preventDefault();
        createPost({ variables: { text: text, userId: userId ?? "" } });
        setText("");
      }}
    >
      <p>Post something!</p>
      <input
        type="text"
        onChange={(e) => setText(e.target.value)}
        value={text}
        placeholder="I'm thinking of..."
      />
      <Button type="submit" variant="btn btn-primary">
        Post!
      </Button>
    </form>
  );
}
