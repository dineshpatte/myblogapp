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
    <div className="max-w-md mx-auto mt-16 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Change Password</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="password"
          placeholder="Old Password"
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
          className="border px-4 py-2 rounded"
          required
        />
        <input
          type="password"
          placeholder="New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="border px-4 py-2 rounded"
          required
        />
        <button
          type="submit"
          className="bg-green-600 text-white py-2 rounded hover:bg-green-700"
        >
          Change Password
        </button>
      </form>

      {message && (
        <p className="mt-4 text-center text-blue-600 font-semibold">
          {message}
        </p>
      )}
    </div>
  );
}

export default ChangePassword;
