import { useState } from "react";
import axios from "../api";

function ChangePassword() {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("/users/changepassword", {
        oldPassword,
        newPassword,
      });

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
    <div className="min-h-screen bg-[#f8f4e3] flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-[#f4ecdc] text-[#3a2e1e] p-8 rounded-xl shadow-lg">
        <h2 className="text-3xl font-serif font-bold mb-6 text-center">
          Change Password
        </h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="password"
            placeholder="Old Password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            className="px-4 py-2 border border-[#c6bfa3] rounded-md bg-white"
            required
          />
          <input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="px-4 py-2 border border-[#c6bfa3] rounded-md bg-white"
            required
          />
          <button
            type="submit"
            className="bg-[#7a6e4f] hover:bg-[#6b6344] text-white font-semibold py-2 rounded-md shadow transition"
          >
            Change Password
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

export default ChangePassword;
