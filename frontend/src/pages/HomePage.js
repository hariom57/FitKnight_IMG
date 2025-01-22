import { useContext, useEffect, useState } from "react";
import { UserContext } from "../UserContext";

export default function HomePage() {
  const { setUserInfo, userInfo } = useContext(UserContext);
  const [posts, setPosts] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("http://localhost:4000/profile", {
      credentials: "include",
    })
      .then((response) => response.json())
      .then((userInfo) => {
        setUserInfo(userInfo);
      });
  }, []);

  const usernamefound = userInfo?.username;

  useEffect(() => {
    async function findbyuser() {
      try {
        const response = await fetch("http://localhost:4000/postrec", {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const postdata = await response.json();
        setPosts(postdata);
        // console.log("postdata:", postdata);
      } catch (e) {
        console.error("error: ", e);
      }
    }
    if(userInfo !== null) {
        findbyuser();
    }
  }, []);

  return (
    <>
      {usernamefound ? (
        <div className="homeposts">
          <p>{userInfo.username}</p>
          {posts.length > 0 ? (
            <ul>
              <br />
              <hr />
              <hr />
              {posts
                .slice()
                .reverse()
                .map((post, index) => (
                  <div key={index}>
                  <li key={index}>
                    <h2>{post.username}</h2>
                    <p>{post.post}</p>
                    <small>{new Date(post.time).toLocaleString()}</small>
                  </li>
                  <hr />
                  </div>
                ))}
            </ul>
          ) : (
            <p>No posts available.</p>
          )}
        </div>
      ) : (
        <h1>Login to see posts</h1>
      )}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </>
  );
}
