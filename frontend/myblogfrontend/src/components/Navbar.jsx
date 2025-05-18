import { Link, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "../api";
import { Menu, X } from "lucide-react";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      setUser(null);
    }

    // Close mobile menu on route change
    setIsOpen(false);
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

        {/* Desktop Menu */}
        <div className="gap-8 text-lg font-semibold hidden md:flex">
          <Link to="/" className="hover:text-[#1f1712] transition-colors">
            Home
          </Link>
          {user ? (
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
          ) : (
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

        {/* Hamburger Menu Button (Mobile) */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-3xl text-[#3e3229] p-2"
        >
          {isOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="md-hidden flex flex-col mt-4 space-y-4 bg-[#f8f3eb] p-4 rounded-md text-lg font-medium shadow-md">
          <Link
            to="/"
            onClick={() => {
              setIsOpen(false);
            }}
          >
            Home
          </Link>

          {user ? (
            <>
              <Link
                to="create-post"
                onClick={() => {
                  setIsOpen(false);
                }}
              >
                CreatePost
              </Link>
              <Link
                to="myposts"
                onClick={() => {
                  setIsOpen(false);
                }}
              >
                myPosts
              </Link>
              <Link
                to="explore"
                onClick={() => {
                  setIsOpen(false);
                }}
              >
                Explore
              </Link>
              <button onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={() => setIsOpen(false)}>
                Login
              </Link>
              <Link to="/register" onClick={() => setIsOpen(false)}>
                Register
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}

export default Navbar;
