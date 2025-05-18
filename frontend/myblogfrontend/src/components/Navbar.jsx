import { Link, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "../api";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      setUser(null);
    }
  }, [location]);

  const handleLogout = async () => {
    try {
      await axios.post("/users/logout");
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setUser(null);
      navigate("/");
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  return (
    <nav className="bg-gray-800 text-white p-4 shadow-md">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link to="/" className="text-xl font-bold">
          MyBlog
        </Link>

        <div className="flex gap-8">
          <Link to="/" className="hover:text-gray-300">
            Home
          </Link>
          {user && (
            <>
              <Link to="/create-post" className="hover:text-gray-300">
                Create Post
              </Link>
              <Link to="/myposts" className="hover:text-gray-300">
                My Posts
              </Link>
              <Link to="/explore" className="hover:text-gray-300">
                Explore
              </Link>

              <button onClick={handleLogout} className="hover:text-gray-300">
                Logout
              </button>
            </>
          )}

          {!user && (
            <>
              <Link to="/login" className="hover:text-gray-300">
                Login
              </Link>
              <Link to="/register" className="hover:text-gray-300">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
