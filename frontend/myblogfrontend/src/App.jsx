import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import CreatePost from "./pages/CreatePost";
import MyPosts from "./pages/Myposts";
import PostDetails from "./pages/PostDetails";
import UpdateAccount from "./pages/updateAccount";
import ChangePassword from "./pages/changePassword";
import Explore from "./pages/Explore";
import About from "./pages/About";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/create-post" element={<CreatePost />} />
        <Route path="/myposts" element={<MyPosts />} />
        <Route path="/posts/:postId" element={<PostDetails />} />
        <Route path="/update-account" element={<UpdateAccount />} />
        <Route path="/change-password" element={<ChangePassword />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </Router>
  );
}

export default App;
