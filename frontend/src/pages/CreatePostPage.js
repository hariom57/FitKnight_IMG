import { useContext, useEffect, useState } from "react";
import { UserContext } from "../UserContext";
import { useNavigate } from "react-router-dom";

export default function CreatePostPage() {
  const [post, setPost] = useState("");
  const { setUserInfo, userInfo } = useContext(UserContext);
  const [dateTime, setDateTime] = useState({
    hour: 0,
    minute: 0,
    month: 0,
    year: 0,
    date: 0,
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:4000/profile", {
      credentials: "include",
    }).then((response) => {
      response.json().then((userInfo) => {
        setUserInfo(userInfo);
      });
    });
  }, []);

  const username = userInfo?.username;

  async function createpost(ev) {
    ev.preventDefault();
    const time = new Date();
    setDateTime({
      hour: time.getHours(),
      minute: time.getMinutes(),
      month: time.getMonth() + 1,
      year: time.getFullYear(),
      date: time.getDate(),
    });

    const response = await fetch("http://localhost:4000/createpost", {
      method: "POST",
      body: JSON.stringify({ username, post }),
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });
    const data = await response.json();
    if (response.status === 200) {
      navigate("/profile");
    } else {
      console.log("Process failed ", data);
    }
  }
  return (
    <>
      <h1>Create Post</h1>
      <form onSubmit={createpost}>
        <textarea
          cols={60}
          rows={10}
          value={post}
          onChange={(ev) => setPost(ev.target.value)}
        />
        <button type="submit">SUBMIT POST</button>
      </form>
    </>
  );
}
