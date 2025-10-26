import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../Components/AuthContext";
import bgImage from "../assets/login_bg.jpg";
// import logo from "../assets/digital-lync-logo.png";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

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
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className="bg-white bg-opacity-90 rounded-lg shadow-lg p-8 w-full max-w-md">
        {/* <div className="flex justify-center mb-5"><img src={logo} alt="Logo" className="h-12" /></div> */}
        <h2 className="text-2xl font-bold text-center text-blue-700 mb-6">
          Log in to continue to LMS
        </h2>
        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-gray-700 mb-2 font-semibold">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value)}
              placeholder="Enter username"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
              autoComplete="username"
            />
          </div>
          <div className="relative">
            <label className="block text-gray-700 mb-2 font-semibold">
              Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Enter password"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
              autoComplete="current-password"
            />
            <button
              type="button"
              tabIndex={-1}
              onClick={() => setShowPassword(p => !p)}
              className="absolute right-4 top-9 text-gray-500 hover:text-blue-700 focus:outline-none"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              <FontAwesomeIcon icon={showPassword ? faEye : faEyeSlash} />
            </button>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-700 hover:bg-blue-800 text-white font-semibold py-2 rounded-lg transition-colors"
          >
            Login
          </button>
        </form>
        <div className="mt-6 text-center">
          <span className="text-gray-600 text-sm">
            Don&apos;t have an account? please {" "}
            <Link to="/course" className="text-blue-700 hover:underline">
              Enroll
            </Link>
          </span>
        </div>
      </div>
    </div>
  );
};

export default Login;
