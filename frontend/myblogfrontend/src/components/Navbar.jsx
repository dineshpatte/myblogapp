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
    <nav className="bg-[#d5c4a1] text-[#3e3229] p-4 shadow-md border-b border-[#b9a88f] font-serif">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link to="/" className="text-3xl font-extrabold tracking-wide">
          The Paper Quill
        </Link>

        <div className="flex gap-8 text-lg font-semibold">
          <Link to="/" className="hover:text-[#1f1712] transition-colors">
            Home
          </Link>
          {user && (
            <>
              <Link
                to="/create-post"
                className="hover:text-[#1f1712] transition-colors"
              >
                Create Post
              </Link>
              <Link
                to="/myposts"
                className="hover:text-[#1f1712] transition-colors"
              >
                My Posts
              </Link>
              <Link
                to="/explore"
                className="hover:text-[#1f1712] transition-colors"
              >
                Explore
              </Link>
              <button
                onClick={handleLogout}
                className="hover:text-[#1f1712] transition-colors"
              >
                Logout
              </button>
            </>
          )}
          {!user && (
            <>
              <Link
                to="/login"
                className="hover:text-[#1f1712] transition-colors"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="hover:text-[#1f1712] transition-colors"
              >
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
