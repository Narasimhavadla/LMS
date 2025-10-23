import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Signup = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  // Handle form input changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const API_URL = import.meta.env.VITE_API_URL;

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    const { username, email, password } = formData;

    if (!username || !email || !password) {
      toast.error("Please fill in all fields!");
      return;
    }

    try {
      // Replace with your JSON server endpoint
      await axios.post(`${API_URL}/users`, formData);

      toast.success("Signup successful! Redirecting to login...");
      setTimeout(() => navigate("/login"), 2000);
    } catch (error) {
      console.error("Error during signup:", error);
      toast.error("Signup failed. Please try again.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <ToastContainer />
      <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6 text-blue-700">
          Create Account
        </h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="username"
            placeholder="Full Name"
            value={formData.username}
            onChange={handleChange}
            className="w-full border p-3 mb-4 rounded"
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full border p-3 mb-4 rounded"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full border p-3 mb-4 rounded"
          />
          <button
            type="submit"
            className="w-full bg-blue-700 text-white py-3 rounded hover:bg-blue-600 transition"
          >
            Sign Up
          </button>
        </form>
        <p className="text-center mt-4">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-700 font-semibold">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
