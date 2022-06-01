import { useState } from "react";
import { useAuth } from "../App";

export function Login({ onLogin }: { onLogin: (name: string) => void }) {
  useAuth(false);

  const [name, setName] = useState("");
  const setNameReactive = (event: React.ChangeEvent<HTMLInputElement>) => {
    const enteredName = event.target.value;
    setName(enteredName);
  };

  return (
    <form
      onSubmit={(ev) => {
        ev.preventDefault();
        onLogin(name);
      }}
    >
      <p>Create your user</p>
      <input
        type="text"
        onChange={setNameReactive}
        value={name}
        placeholder="cindy lopez"
      />
      <button type="submit">Log in</button>
    </form>
  );
}
