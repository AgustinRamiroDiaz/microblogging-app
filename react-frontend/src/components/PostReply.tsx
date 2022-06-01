import gql from "graphql-tag";
import { Form } from "react-bootstrap";
import { useReplyPostMutation } from "../generated/graphql";
import { useContext, useState } from "react";
import { useAuth, UserContext } from "../App";

export function PostReply({ postId }: { postId: string }) {
  useAuth(true);
  const userId = useContext(UserContext);

  gql`
    mutation replyPost($text: String!, $userId: ID!, $postId: ID!) {
      reply(text: $text, postId: $postId, userId: $userId) {
        id
      }
    }
  `;

  const [replyPost, _] = useReplyPostMutation();

  const [text, setText] = useState("");

  return (
    <form
      onSubmit={(ev) => {
        ev.preventDefault();
        replyPost({
          variables: { text: text, userId: userId ?? "", postId: postId },
        });
        setText("");
      }}
    >
      <Form.Control
        type="text"
        onChange={(e) => setText(e.target.value)}
        value={text}
        size="sm"
        placeholder="Reply to this post!"
      />
    </form>
  );
}
