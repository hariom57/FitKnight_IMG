import { useContext, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { UserContext } from "../UserContext";

export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [redirect, setRedirect] = useState(false);
  const { setUserInfo } = useContext(UserContext);
  const navigate = useNavigate();
  async function register(ev) {
    ev.preventDefault();
    const response = await fetch("http://localhost:4000/register", {
      method: "POST",
      body: JSON.stringify({ username, password }),
      headers: { "Content-Type": "application/json" },
    });
    // console.log(":registerfunc ", username);
    if (response.status === 200) {
      // alert("Registeration successful!");
      navigate("/login");
    } else alert("Registration failed!");
  }
  if (redirect) {
    // console.log(":redirect ", username);
    return <Navigate to={"/login"} />;
  }
  return (
    <form className="register" onSubmit={register}>
      <h1>REGISTER</h1>
      <input
        type="text"
        placeholder="username"
        value={username}
        onChange={(ev) => setUsername(ev.target.value)}
      />
      <input
        type="password"
        placeholder="password"
        value={password}
        onChange={(ev) => setPassword(ev.target.value)}
      />
      <button>REGISTER</button>
    </form>
  );
}
