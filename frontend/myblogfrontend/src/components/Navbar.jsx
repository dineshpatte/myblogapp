import { Link, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "../api";
import { Menu, X, LogOut } from "lucide-react";

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
    <nav className="bg-[#0e0e0e] text-[#c7c7c7] p-4 shadow-md border-b border-[#2e2e2e] font-sans">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link
          to="/"
          className="text-3xl font-extrabold tracking-wide text-white"
        >
          The Paper Quill
        </Link>

        {/* Desktop Menu */}
        <div className="gap-8 text-lg font-semibold hidden md:flex items-center">
          <Link to="/" className="hover:text-[#9ca3af] transition-colors">
            Home
          </Link>
          <Link to="/about" className="hover:text-[#9ca3af] transition-colors">
            About
          </Link>

          {user ? (
            <>
              <Link
                to="/create-post"
                className="hover:text-[#9ca3af] transition-colors"
              >
                Create Post
              </Link>
              <Link
                to="/myposts"
                className="hover:text-[#9ca3af] transition-colors"
              >
                My Posts
              </Link>
              <Link
                to="/explore"
                className="hover:text-[#9ca3af] transition-colors"
              >
                Explore
              </Link>

              <button
                onClick={handleLogout}
                className="hover:text-[#9ca3af] transition-colors bg-transparent border-none cursor-pointer p-1 rounded"
                aria-label="Logout"
              >
                <LogOut size={20} />
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="hover:text-[#9ca3af] transition-colors"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="hover:text-[#9ca3af] transition-colors"
              >
                Register
              </Link>
            </>
          )}
        </div>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-3xl text-[#c7c7c7] p-2 bg-transparent border-none"
          aria-label="Toggle menu"
        >
          {isOpen ? <X /> : <Menu />}
        </button>
      </div>

      {isOpen && (
        <div className="md:hidden flex flex-col mt-4 space-y-4 bg-[#0e0e0e] p-4 rounded-md text-lg font-medium shadow-md border border-[#2e2e2e]">
          <Link
            to="/"
            onClick={() => setIsOpen(false)}
            className="text-[#c7c7c7] hover:text-[#9ca3af] transition-colors"
          >
            Home
          </Link>
          <Link
            to="/about"
            onClick={() => setIsOpen(false)}
            className="text-[#c7c7c7] hover:text-[#9ca3af] transition-colors"
          >
            About
          </Link>

          {user ? (
            <>
              <Link
                to="/create-post"
                onClick={() => setIsOpen(false)}
                className="text-[#c7c7c7] hover:text-[#9ca3af] transition-colors"
              >
                Create Post
              </Link>
              <Link
                to="/myposts"
                onClick={() => setIsOpen(false)}
                className="text-[#c7c7c7] hover:text-[#9ca3af] transition-colors"
              >
                My Posts
              </Link>
              <Link
                to="/explore"
                onClick={() => setIsOpen(false)}
                className="text-[#c7c7c7] hover:text-[#9ca3af] transition-colors"
              >
                Explore
              </Link>
              <span className="text-sm text-gray-400 px-1">
                Hello, <span className="text-white">{user.username}</span>
              </span>
              <button
                onClick={handleLogout}
                className="text-[#c7c7c7] hover:text-[#9ca3af] transition-colors bg-transparent border-none cursor-pointer text-left p-1 rounded"
                aria-label="Logout"
              >
                <LogOut size={20} />
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                onClick={() => setIsOpen(false)}
                className="text-[#c7c7c7] hover:text-[#9ca3af] transition-colors"
              >
                Login
              </Link>
              <Link
                to="/register"
                onClick={() => setIsOpen(false)}
                className="text-[#c7c7c7] hover:text-[#9ca3af] transition-colors"
              >
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
