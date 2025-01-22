import { useContext, useEffect, useState } from "react";
import { UserContext } from "../UserContext";

export default function Dashboard() {
  const { setUserInfo, userInfo } = useContext(UserContext);
  const [users, setusers] = useState("");
  const [groups, setgroups] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [currentuserdata, setcurrentuserdata] = useState([]);
  const [groupcreated, setgroupcreated] = useState(false);
  const [groupname, setgroupname] = useState(false);
  const username = userInfo.username;
  const usernamefound = userInfo?.username;

  async function sendrequest(sendto) {
    const sendreq = await fetch("http://localhost:4000/sendreq", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ sendto }),
    });
    if (sendreq.ok) {
      setPendingRequests((prev) => [...prev, sendto]);
      setusers((prevUsers) =>
        prevUsers.map((user) => {
          if (user.username === sendto) {
            return {
              ...user,
              pendingreq: [...user.pendingreq, username],
            };
          }
          return user;
        })
      );
      alert("request sent");
    }
  }

  async function acceptrequest(acceptto) {
    const sendreq = await fetch("http://localhost:4000/acceptrequest", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ acceptto }),
    });
    if (sendreq.ok) {
      alert("request accepted");
    } else {
      console.log(sendreq.json());
    }
  }

  async function creategroup(ev, username) {
    ev.preventDefault();
    setgroupcreated(false);
    const sendreq = await fetch("http://localhost:4000/creategroup", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, groupname }),
    });
    if (sendreq.ok) {
      alert("group created");
    } else {
      console.log(sendreq.json());
    }
  }

  function showinput() {
    setgroupcreated(true);
  }

  async function joingroup(groupid) {
    const sendreq = await fetch("http://localhost:4000/joingroup", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ groupid, username }),
    });
    if (sendreq.ok) {
      alert("group joined");
    }
  }

  useEffect(() => {
    async function findgroups() {
      try {
        const response = await fetch("http://localhost:4000/groups", {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const data = await response.json();
        setgroups(data);
      } catch (e) {
        console.error("error: ", e);
      }
    }
    findgroups();
  });

  useEffect(() => {
    async function findbyuser() {
      try {
        const response = await fetch("http://localhost:4000/usernames", {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const data = await response.json();
        const userdata = data.userdata;

        setcurrentuserdata(data);

        setusers(userdata);
        // console.log("*****", currentuserdata);
        // Extract pending requests from userdata if needed
        const pendingReqs = userdata.reduce((reqs, user) => {
          if (user.pendingreq?.includes(username)) {
            reqs.push(user.username);
          }
          return reqs;
        }, []);
        setPendingRequests(pendingReqs);
      } catch (e) {
        console.error("error: ", e);
      }
    }
    if (userInfo !== null) {
      findbyuser();
    }
  }, [userInfo, username]);

  return (
    <>
      <div className="exploreusers">
        <h2>EXPLORE BUDDIES</h2>
        {usernamefound ? (
          users.length > 0 ? (
            users.map((user, index) => {
              return (
                <div key={index} className="users">
                  <li>
                    <img src={user.pplink} alt="" />
                    <div className="content">
                      <h3>{user.username}</h3>
                      {user.prefer === "createfitnessgroup" ? (
                        <p>ADMIN</p>
                      ) : (
                        <p></p>
                      )}
                      <p>{user.activity}</p>
                    </div>
                  </li>
                  {user.pendingreq?.includes(username) ||
                  pendingRequests.includes(user.username) ? (
                    <button disabled>REQUEST SENT</button>
                  ) : user.friends?.includes(username) ? (
                    <button
                    // onClick={() => {
                    //   sendrequest(user.username);
                    // }}
                    >
                      REMOVE FRIEND
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        sendrequest(user.username);
                      }}
                    >
                      ADD FRIEND
                    </button>
                  )}
                </div>
              );
            })
          ) : (
            <p>No user found</p>
          )
        ) : (
          <p>Login error</p>
        )}
      </div>
      <div className="friendlist">
        <div className="requestslist">
          <h2>REQUESTS FROM</h2>
          {usernamefound ? (
            users.length > 0 ? (
              users.map((user, index) => {
                return (
                  <div key={index} className="users">
                    {user.requestlist?.includes(username) ? (
                      <>
                        <li>
                          <img src={user.pplink} alt="" />
                          <div className="content">
                            <h3>{user.username}</h3>
                            {user.prefer === "createfitnessgroup" ? (
                              <p>ADMIN</p>
                            ) : (
                              <p></p>
                            )}
                            <p>{user.activity}</p>
                          </div>
                        </li>
                        <button
                          onClick={() => {
                            acceptrequest(user.username);
                          }}
                        >
                          ACCEPT REQUEST
                        </button>
                      </>
                    ) : (
                      <></>
                    )}
                  </div>
                );
              })
            ) : (
              <p>No user found</p>
            )
          ) : (
            <p>Login error</p>
          )}
        </div>
      </div>
      {currentuserdata.currentuser ? (
        currentuserdata.currentuser[0].prefer === "createfitnessgroup" ? (
          <div className="creategroup">
            <button onClick={() => showinput()}>CREATE GROUP</button>
            {groupcreated ? (
              <form onSubmit={(ev) => creategroup(ev, username)}>
                <input
                  type="text"
                  onChange={(ev) => setgroupname(ev.target.value)}
                />
                <button type="submit">CREATE GROUP</button>
              </form>
            ) : (
              <></>
            )}
          </div>
        ) : (
          <>
            <h1>GROUPS</h1>
            {groups.length > 0 ? (
              groups.map((group, index) => {
                return (
                  <div className="groups">
                    <div className="users" key={group._id || index}>
                      <li>
                        <div className="content">
                          <h3>{group.groupname}</h3>
                          <p>ADMIN: {group.admin}</p>
                          <p>MEMBERS: {group.members.length}</p>
                        </div>
                        <button onClick={() => joingroup(group._id)}>
                          JOIN GROUP
                        </button>
                      </li>
                    </div>
                  </div>
                );
              })
            ) : (
              <></>
            )}
          </>
        )
      ) : (
        <>LOGIN ERROR</>
      )}
    </>
  );
}
