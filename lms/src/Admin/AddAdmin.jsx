import React, { useState } from "react";
import axios from "axios";

export default function AddAdmin() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    role: "admin",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const API_URL = import.meta.env.VITE_API_URL; // change this to your backend endpoint

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const res = await axios.post(`${API_URL}/users`, formData);
      setMessage("✅ Admin added successfully!");
      setFormData({ username: "", password: "", role: "admin" });
    } catch (err) {
      console.error(err);
      setMessage("❌ Failed to add admin. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-indigo-100 to-purple-100 px-4">
      <div className="bg-white shadow-xl rounded-2xl w-full max-w-md p-8 transition-transform transform hover:scale-[1.02]">
        <h2 className="text-3xl font-bold text-center text-blue-700 mb-6">
          Add New Admin
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Username */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Username
            </label>
            <input
              type="text"
              name="username"
              placeholder="Enter username"
              value={formData.username}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none transition duration-200"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Password
            </label>
            <input
              type="password"
              name="password"
              placeholder="Enter password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none transition duration-200"
            />
          </div>

          {/* Role */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Role
            </label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-400 focus:outline-none transition duration-200"
            >
              <option value="admin">Admin</option>
              <option value="super-admin">user</option>
            </select>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 mt-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition duration-300 disabled:bg-gray-400"
          >
            {loading ? "Adding Admin..." : "Add Admin"}
          </button>

          {message && (
            <p
              className={`text-center mt-3 font-medium ${
                message.startsWith("✅") ? "text-green-600" : "text-red-600"
              }`}
            >
              {message}
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
