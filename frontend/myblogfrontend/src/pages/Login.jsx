import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api";

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [message, setMessage] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.password || (!formData.username && !formData.email)) {
      setMessage("Please enter username or email and password.");
      return;
    }

    try {
      const res = await axios.post("/users/login", formData);
      setMessage("Login successful!");
      setLoggedIn(true);
      localStorage.setItem("token", res.data.token);
      if (res.data?.data?.user) {
        localStorage.setItem("user", JSON.stringify(res.data.data.user));
        navigate("/");
      } else {
        setMessage("Login failed. Try again.");
      }
    } catch (error) {
      setMessage(
        error.response?.data?.message || "Login failed, please try again."
      );
      setLoggedIn(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-[#111] text-white p-8 rounded-xl shadow-xl border border-gray-800">
        <h2 className="text-3xl font-bold mb-6 text-center">
          Login to The Paper Quill
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            className="px-4 py-2 border border-gray-600 rounded-md bg-black text-white placeholder-gray-400"
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="px-4 py-2 border border-gray-600 rounded-md bg-black text-white placeholder-gray-400"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            className="px-4 py-2 border border-gray-600 rounded-md bg-black text-white placeholder-gray-400"
          />
          <button
            type="submit"
            className="bg-white hover:bg-gray-300 text-black font-semibold py-2 rounded-md transition"
          >
            Login
          </button>
        </form>

        {message && (
          <p
            className={`mt-4 text-center font-medium ${
              loggedIn ? "text-green-400" : "text-red-500"
            }`}
          >
            {message}
          </p>
        )}

        <div className="mt-6 flex flex-col gap-3">
          <button
            onClick={() => navigate("/update-account")}
            className="bg-gray-800 hover:bg-gray-700 text-white font-semibold py-2 rounded-md transition"
          >
            Update Account Details
          </button>
          <button
            onClick={() => navigate("/change-password")}
            className="bg-gray-600 hover:bg-gray-500 text-white font-semibold py-2 rounded-md transition"
          >
            Change Password
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;
