import { useState } from "react";
import axios from "../api";

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
      const res = await axios.post("/users/updatedetails", formData);
      setMessage("Account details updated successfully!");
    } catch (error) {
      setMessage(
        error.response?.data?.message || "Update failed, please try again."
      );
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f4e3] flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-[#f4ecdc] text-[#3a2e1e] p-8 rounded-xl shadow-lg">
        <h2 className="text-3xl font-serif font-bold mb-6 text-center">
          Update Account
        </h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            name="username"
            placeholder="New Username"
            value={formData.username}
            onChange={handleChange}
            className="px-4 py-2 border border-[#c6bfa3] rounded-md bg-white"
          />
          <input
            type="email"
            name="email"
            placeholder="New Email"
            value={formData.email}
            onChange={handleChange}
            className="px-4 py-2 border border-[#c6bfa3] rounded-md bg-white"
          />
          <button
            type="submit"
            className="bg-[#7a6e4f] hover:bg-[#6b6344] text-white font-semibold py-2 rounded-md shadow transition"
          >
            Update
          </button>
        </form>
        {message && (
          <p className="mt-4 text-center font-medium text-green-700">
            {message}
          </p>
        )}
      </div>
    </div>
  );
}

export default UpdateAccount;
