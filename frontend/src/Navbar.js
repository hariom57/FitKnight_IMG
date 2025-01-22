import { useContext, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { UserContext } from "./UserContext";

export default function Navbar() {
  const navigate = useNavigate();
  const { setUserInfo, userInfo } = useContext(UserContext);
  useEffect(() => {
    fetch("http://localhost:4000/profile", {
      credentials: "include",
    }).then((response) => {
      response.json().then((userInfo) => {
        setUserInfo(userInfo);
      });
    });
  }, []);

  function logout() {
    fetch("http://localhost:4000/logout", {
      credentials: "include",
      method: "POST",
    });
    setUserInfo(null);
    navigate("/");
  }

  const username = userInfo?.username;

  return (
    <>
      <div className="navbar">
        <p className="logo">FITKNIGHT</p>
        <ul className="navs">
          <li>
            <NavLink
              to={"/"}
              end
              className={({ isActive }) => (isActive ? "active-link" : "")}
            >
              Home
            </NavLink>
          </li>
          <li>
            <NavLink
              to={"/Dashboard"}
              className={({ isActive }) => (isActive ? "active-link" : "")}
            >
              Dashboard
            </NavLink>
          </li>
          {username && (
            <>
              <li>
                <NavLink
                  to="/message"
                  className={({ isActive }) => (isActive ? "active-link" : "")}
                >
                  Message
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/createpost"
                  className={({ isActive }) => (isActive ? "active-link" : "")}
                >
                  Create Post
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/profile"
                  className={({ isActive }) => (isActive ? "active-link" : "")}
                >
                  Profile
                </NavLink>
              </li>
              <li>
                <a onClick={logout}>Logout</a>
              </li>
            </>
          )}
          {!username && (
            <>
              <li>
                <NavLink
                  to={"/register"}
                  className={({ isActive }) => (isActive ? "active-link" : "")}
                >
                  Register
                </NavLink>
              </li>
              <li>
                <NavLink
                  to={"/login"}
                  className={({ isActive }) => (isActive ? "active-link" : "")}
                >
                  Login
                </NavLink>
              </li>
            </>
          )}
        </ul>
      </div>
    </>
  );
}
