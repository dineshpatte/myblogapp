import { useState } from "react";
import axios from "axios";

function ChangePassword() {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");  // get token

      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/users/changepassword`,
        { oldPassword, newPassword },
        {
          headers: { Authorization: `Bearer ${token}` },  // pass token here
          // withCredentials: true, // only if you rely on cookies
        }
      );

      if (res.status === 200) {
        setMessage("Password changed successfully!");
      } else {
        setMessage("Something went wrong.");
      }
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to change password.");
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-[#111] text-white p-8 rounded-xl shadow-xl border border-gray-800">
        <h2 className="text-3xl font-bold mb-6 text-center">Change Password</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="password"
            placeholder="Old Password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            className="px-4 py-2 border border-gray-600 rounded-md bg-black text-white placeholder-gray-400"
            required
          />
          <input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="px-4 py-2 border border-gray-600 rounded-md bg-black text-white placeholder-gray-400"
            required
          />
          <button
            type="submit"
            className="bg-white hover:bg-gray-300 text-black font-semibold py-2 rounded-md transition"
          >
            Change Password
          </button>
        </form>

        {message && (
          <p className="mt-4 text-center font-medium text-green-400">{message}</p>
        )}
      </div>
    </div>
  );
}

export default ChangePassword;
