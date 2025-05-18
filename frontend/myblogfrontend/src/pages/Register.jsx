import { useState } from "react";
import axios from "../api";

function Register() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    role: "reader",
    avatar: null,
  });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "avatar") {
      setFormData({ ...formData, avatar: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("username", formData.username);
    data.append("email", formData.email);
    data.append("password", formData.password);
    data.append("role", formData.role);
    if (formData.avatar) data.append("avatar", formData.avatar);

    try {
      const res = await axios.post("/users/register", data);
      setMessage("Registered successfully!");
      console.log(res.data);
    } catch (error) {
      if (error.response?.status === 409) {
        setMessage("User already exists");
      } else {
        setMessage(error.response?.data?.message || "Registration failed");
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f4e3] flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-[#f4ecdc] text-[#3a2e1e] p-8 rounded-xl shadow-lg">
        <h2 className="text-3xl font-serif font-bold mb-6 text-center">
          Register
        </h2>
        <form
          onSubmit={handleSubmit}
          encType="multipart/form-data"
          className="flex flex-col gap-4"
        >
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            required
            className="px-4 py-2 border border-[#c6bfa3] rounded-md bg-white text-[#3a2e1e] focus:outline-none focus:ring-2 focus:ring-[#7a6e4f]"
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
            className="px-4 py-2 border border-[#c6bfa3] rounded-md bg-white text-[#3a2e1e] focus:outline-none focus:ring-2 focus:ring-[#7a6e4f]"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            className="px-4 py-2 border border-[#c6bfa3] rounded-md bg-white text-[#3a2e1e] focus:outline-none focus:ring-2 focus:ring-[#7a6e4f]"
          />
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="px-4 py-2 border border-[#c6bfa3] rounded-md bg-white text-[#3a2e1e] focus:outline-none focus:ring-2 focus:ring-[#7a6e4f]"
          >
            <option value="reader">Reader</option>
            <option value="author">Author</option>
            <option value="admin">Admin</option>
          </select>
          <input
            type="file"
            name="avatar"
            accept="image/*"
            onChange={handleChange}
            className="text-[#3a2e1e]"
          />
          <button
            type="submit"
            className="mt-4 bg-[#7a6e4f] hover:bg-[#6b6344] text-white font-semibold py-2 rounded-md shadow transition duration-300"
          >
            Register
          </button>
        </form>
        {message && (
          <p
            className={`mt-4 text-center font-medium ${
              message === "Registered successfully!"
                ? "text-green-600"
                : "text-red-600"
            }`}
          >
            {message}
          </p>
        )}
      </div>
    </div>
  );
}

export default Register;
