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
    <div className="max-w-md mx-auto mt-16 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4">Update Account</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          name="username"
          placeholder="New Username"
          value={formData.username}
          onChange={handleChange}
          className="px-4 py-2 border rounded-md"
        />
        <input
          type="email"
          name="email"
          placeholder="New Email"
          value={formData.email}
          onChange={handleChange}
          className="px-4 py-2 border rounded-md"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
        >
          Update
        </button>
      </form>
      {message && <p className="mt-4 text-center text-green-600">{message}</p>}
    </div>
  );
}

export default UpdateAccount;
