import { useContext, useEffect, useState } from "react";
import { UserContext } from "../UserContext";

export default function ProfilePage() {
  const { setUserInfo, userInfo } = useContext(UserContext);
  const [profileData, setProfileData] = useState(null);
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

  useEffect(() => {
    async function fetchProfileData() {
      try {
        const response = await fetch("http://localhost:4000/profilepage", {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(errorText);
        }

        const data = await response.json();
        setProfileData(data);
      } catch (err) {
        setError(err.message);
        console.error("Fetch error:", err);
      }
    }

    fetchProfileData();
  }, []);

  const usernamefound = userInfo?.username;

  useEffect(() => {
    async function findbyuser() {
      try {
        const response = await fetch("http://localhost:4000/postsbyuser", {
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
    findbyuser();
  }, []);

  return (
    <>
      {usernamefound ? (
        <div className="profileviewer">
          <img src={profileData?.pplink} alt="error" />
          <h1>Username: {userInfo.username}</h1>
          <p>First Name: {profileData?.firstname}</p>
          <p>Last Name: {profileData?.lastname}</p>
          <p>Country: {profileData?.country}</p>
          <p>State: {profileData?.state}</p>
          <p>City: {profileData?.city}</p>
          <p>Prefer: {profileData?.prefer}</p>
          <p>Activity: {profileData?.activity}</p>
          <p>Time: {profileData?.time}</p>
          {posts.length > 0 ? (
              <ul>
                {posts
                  .slice()
                  .reverse()
                  .map((post, index) => (
                    <>
                      <li key={index}>
                        <h2>{post.username}</h2>
                        <p>{post.post}</p>
                        <small>{new Date(post.time).toLocaleString()}</small>
                      </li>
                    </>
                  ))}
              </ul>
          ) : (
            <p>No posts available.</p>
          )}
        </div>
      ) : (
        <h1>Login to see profile</h1>
      )}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </>
  );
}
