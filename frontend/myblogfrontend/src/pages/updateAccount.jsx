import { useState } from "react";
import axios from "axios";


function UpdateAccount() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
  });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.username && !formData.email) {
      setMessage("Please enter a new username or email.");
      return;
    }

    try {
      const res = await axios.post("http://localhost:3000/api/v1/users/updatedetails", formData);
      setMessage("Account details updated successfully!");
    } catch (error) {
      setMessage(
        error.response?.data?.message || "Update failed, please try again."
      );
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-[#111] text-white p-8 rounded-xl shadow-xl border border-gray-800">
        <h2 className="text-3xl font-bold mb-6 text-center">Update Account</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            name="username"
            placeholder="New Username"
            value={formData.username}
            onChange={handleChange}
            className="px-4 py-2 border border-gray-600 rounded-md bg-black text-white placeholder-gray-400"
          />
          <input
            type="email"
            name="email"
            placeholder="New Email"
            value={formData.email}
            onChange={handleChange}
            className="px-4 py-2 border border-gray-600 rounded-md bg-black text-white placeholder-gray-400"
          />
          <button
            type="submit"
            className="bg-white hover:bg-gray-300 text-black font-semibold py-2 rounded-md transition"
          >
            Update
          </button>
        </form>
        {message && (
          <p className="mt-4 text-center font-medium text-green-400">
            {message}
          </p>
        )}
      </div>
    </div>
  );
}

export default UpdateAccount;
