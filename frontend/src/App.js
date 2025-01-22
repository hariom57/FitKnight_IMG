// import logo from "./logo.svg";
import "./App.scss";
import Layout from "./Layout";
import { Routes, Route } from "react-router-dom";
// import IndexPage from "./pages/IndexPage";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage,";
import RegisterPage from "./pages/RegisterPage";
import { UserContextProvider } from "./UserContext";
import ProfilePage from "./pages/ProfilePage";
import FormPage from "./pages/FormPage";
import CreatePostPage from "./pages/CreatePostPage";
import Dashboard from "./pages/Dashboard";
// import CreatePost from "./pages/CreatePost";
// 2:04:07      POST CREATING LEFT
function App() {
  return (
    <UserContextProvider>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path={"/login"} element={<LoginPage />} />
          <Route path={"/register"} element={<RegisterPage />} />
          <Route path={'/profile'} element={<ProfilePage/>} />
          <Route path={'/registerationform'} element={<FormPage/>} />
          <Route path={'/createpost'} element={<CreatePostPage/>} />
          <Route path={'/dashboard'} element={<Dashboard/>} />
        </Route>
      </Routes>
    </UserContextProvider>
  );
}

export default App;