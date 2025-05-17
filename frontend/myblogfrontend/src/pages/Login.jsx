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

      console.log(res.data.user);
    } catch (error) {
      setMessage(
        error.response?.data?.message || "Login failed, please try again."
      );
      setLoggedIn(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-16 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-6">Login</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleChange}
          className="px-4 py-2 border rounded-md"
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className="px-4 py-2 border rounded-md"
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
          className="px-4 py-2 border rounded-md"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
        >
          Login
        </button>
      </form>

      {message && (
        <p
          className={`mt-4 text-center font-medium ${
            loggedIn ? "text-green-600" : "text-red-600"
          }`}
        >
          {message}
        </p>
      )}

      <div className="mt-6 flex flex-col gap-4">
        <button
          onClick={() => navigate("/update-account")}
          className="bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
        >
          Update Account Details
        </button>
        <button
          onClick={() => navigate("/change-password")}
          className="bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition"
        >
          Change Password
        </button>
      </div>
    </div>
  );
}

export default Login;
