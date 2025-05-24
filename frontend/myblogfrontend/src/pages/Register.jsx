import { useState } from "react";
import axios from "axios"



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
      const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/users/register`, data);
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
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-[#111] text-white p-8 rounded-xl shadow-xl border border-gray-800">
        <h2 className="text-3xl font-bold mb-6 text-center">Register</h2>
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
            className="px-4 py-2 border border-gray-600 rounded-md bg-black text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white"
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
            className="px-4 py-2 border border-gray-600 rounded-md bg-black text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            className="px-4 py-2 border border-gray-600 rounded-md bg-black text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white"
          />
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="px-4 py-2 border border-gray-600 rounded-md bg-black text-white focus:outline-none focus:ring-2 focus:ring-white"
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
            className="text-white"
          />
          <button
            type="submit"
            className="mt-4 bg-white hover:bg-gray-300 text-black font-semibold py-2 rounded-md shadow transition duration-300"
          >
            Register
          </button>
        </form>
        {message && (
          <p
            className={`mt-4 text-center font-medium ${
              message === "Registered successfully!"
                ? "text-green-400"
                : "text-red-400"
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
