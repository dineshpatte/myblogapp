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
      if (res.data && res.data.data && res.data.data.user) {
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
    <div className="min-h-screen bg-[#f8f4e3] flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-[#f4ecdc] text-[#3a2e1e] p-8 rounded-xl shadow-lg">
        <h2 className="text-3xl font-serif font-bold mb-6 text-center">
          Login to The Paper Quill
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            className="px-4 py-2 border border-[#c6bfa3] rounded-md bg-white"
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="px-4 py-2 border border-[#c6bfa3] rounded-md bg-white"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            className="px-4 py-2 border border-[#c6bfa3] rounded-md bg-white"
          />
          <button
            type="submit"
            className="bg-[#7a6e4f] hover:bg-[#6b6344] text-white font-semibold py-2 rounded-md shadow transition"
          >
            Login
          </button>
        </form>

        {message && (
          <p
            className={`mt-4 text-center font-medium ${
              loggedIn ? "text-green-700" : "text-red-600"
            }`}
          >
            {message}
          </p>
        )}

        <div className="mt-6 flex flex-col gap-3">
          <button
            onClick={() => navigate("/update-account")}
            className="bg-[#a8997e] hover:bg-[#988a6e] text-[#3a2e1e] font-semibold py-2 rounded-md shadow transition"
          >
            Update Account Details
          </button>
          <button
            onClick={() => navigate("/change-password")}
            className="bg-[#8aaf85] hover:bg-[#7a9e75] text-white font-semibold py-2 rounded-md shadow transition"
          >
            Change Password
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;
