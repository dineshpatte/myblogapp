import { Link } from "react-router-dom";

function Navbar() {
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
          <Link to="/create" className="hover:text-gray-300">
            Create Post
          </Link>
          <Link to="/myposts" className="hover:text-gray-300">
            My Posts
          </Link>
          <Link to="/login" className="hover:text-gray-300">
            Login
          </Link>
          <Link to="/register" className="hover:text-gray-300">
            Register
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
