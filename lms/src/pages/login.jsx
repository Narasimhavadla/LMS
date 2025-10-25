import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../Components/AuthContext";
import bgImage from "../assets/login_bg.jpg"; // 🖼️ Add a background image in your assets folder
// import logo from "../assets/digital-lync-logo.png"; // 🖼️ Add your logo here

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const API_URL = import.meta.env.VITE_API_URL;

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.get(`${API_URL}/users`);
      const user = response.data.find(
        (u) => u.username === username && u.password === password
      );

      if (user) {
        login(user.role, user.username, user.email);
        if (user.role === "admin") navigate("/admin-dashboard");
        else navigate("/mycourses");
      } else {
        alert("❌ Invalid username or password");
      }
    } catch (error) {
      console.error("Login failed", error);
      alert("Something went wrong while logging in. Please try again.");
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{
        backgroundImage: `url(${bgImage})`,
      }}
    >
      {/* Overlay for dim effect */}
      <div className="absolute inset-0 bg-black/40"></div>

      <div className="relative z-10 bg-white/90 backdrop-blur-md rounded-xl shadow-xl p-8 w-full max-w-md">
        <div className="flex flex-col items-center mb-6">
          {/* <img src={logo} alt="Logo" className="w-32 mb-3" /> */}
          <h2 className="text-2xl font-semibold text-gray-800">
            Welcome
          </h2>
          <p className="text-gray-500 text-sm text-center mt-1">
            Log in to continue to <span className="font-medium">LMS</span>
          </p>
        </div>

        <form onSubmit={handleLogin}>
          <label className="text-sm font-medium text-gray-700">Username</label>
          <input
            type="text"
            placeholder="Enter your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md mt-1 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />

          <label className="text-sm font-medium text-gray-700">Password</label>
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md mt-1 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />

          <div className="flex justify-end mb-4">
            <Link to="/forgot-password" className="text-blue-700 text-sm font-medium hover:underline">
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md font-semibold transition"
          >
            Continue
          </button>
        </form>

        <div className="text-center mt-5 text-sm text-gray-700">
          New User?{" "}
          <Link to="/signup" className="text-blue-900 font-medium hover:underline">
            Signup
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
