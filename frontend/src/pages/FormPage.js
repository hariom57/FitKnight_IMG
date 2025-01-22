import { useContext, useEffect, useState } from "react";
import { UserContext } from "../UserContext";
import { useNavigate } from "react-router-dom";

export default function FormPage() {
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [country, setCountry] = useState("");
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [prefer, setprefer] = useState("");
  const [activity, setactivity] = useState("");
  const [time, settime] = useState("");
  const [pplink, setPplink] = useState("");
  const [profilePicture, setProfilePicture] = useState(null);
  const navigate = useNavigate();
  const { setUserInfo, userInfo } = useContext(UserContext);
  const [profileData, setProfileData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("http://localhost:4000/profile", {
      credentials: "include",
    }).then((response) => {
      response.json().then((userInfo) => {
        setUserInfo(userInfo);
      });
    });
  }, [setUserInfo]);

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

  useEffect(() => {
    if (profileData) {
      setFirstname(profileData.firstname || "");
      setLastname(profileData.lastname || "");
      setCountry(profileData.country || "");
      setState(profileData.state || "");
      setCity(profileData.city || "");
      setprefer(profileData.prefer || "");
      setactivity(profileData.activity || "");
      settime(profileData.time || "");
      setPplink(profileData.pplink || "");
    }
  }, [profileData]);

  const usernamec = userInfo?.username;

  async function registerationform(ev) {
    ev.preventDefault();
    const data = new FormData();
    data.append("username", usernamec);
    data.append("firstname", firstname);
    data.append("lastname", lastname);
    data.append("country", country);
    data.append("state", state);
    data.append("city", city);
    data.append("prefer", prefer);
    data.append("activity", activity);
    data.append("time", time);
    if (profilePicture) {
      data.append("profilePicture", profilePicture);
    }

    
    const response = await fetch("http://localhost:4000/registerationpage", {
      method: "POST",
      body: data,
    });
    if (response.status === 200) {
      setUserInfo(data);
      navigate("/profile");
    } else {
      alert("Process failed");
    }
  }
console.log(activity, prefer, time)
  return (
    <form onSubmit={registerationform}>
      <h1>REGISTRATION FORM</h1>
      <label>
        Username:
        <input type="text" value={usernamec || ""} disabled />
      </label>
      <label>
        First Name:
        <input
          type="text"
          placeholder="First name"
          value={firstname}
          onChange={(ev) => setFirstname(ev.target.value)}
        />
      </label>
      <label>
        Last Name:
        <input
          type="text"
          placeholder="Last name"
          value={lastname}
          onChange={(ev) => setLastname(ev.target.value)}
        />
      </label>
      <label>
        Country:
        <input
          type="text"
          placeholder="Country"
          value={country}
          onChange={(ev) => setCountry(ev.target.value)}
        />
      </label>
      <label>
        State:
        <input
          type="text"
          placeholder="State"
          value={state}
          onChange={(ev) => setState(ev.target.value)}
        />
      </label>
      <label>
        City:
        <input
          type="text"
          placeholder="City"
          value={city}
          onChange={(ev) => setCity(ev.target.value)}
        />
      </label>
      <label>
        Prefer:
        <select name="prefer" onChange={(ev) => setprefer(ev.target.value)}>
          <option value="workoutbuddy">Find a workout buddy</option>
          <option value="createfitnessgroup">Create fitness group</option>
        </select>
      </label>
      <label>
        Activity:
        <select name="activity" onChange={(ev) => setactivity(ev.target.value)}>
          <option value="gym">Gym</option>
          <option value="yoga">Yoga</option>
          <option value="running">Running</option>
          <option value="other">Other</option>
        </select>
      </label>
      <label>
        Time:
        <select name="time" onChange={(ev) => settime(ev.target.value)}>
          <option value="morning">Morning</option>
          <option value="afternoon">Afternoon</option>
          <option value="evening">Evening</option>
          <option value="night">Night</option>
        </select>
      </label>
      {!pplink && (
        <>
          <label>
            Profile Picture:
            <input
              type="file"
              onChange={(ev) => setProfilePicture(ev.target.files[0])}
            />
          </label>
        </>
      )}
      {pplink && (
        <>
          <img src={pplink} alt="" />
        </>
      )}
      <button type="submit">CREATE ACCOUNT</button>
    </form>
  );
}
