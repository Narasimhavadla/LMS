import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../Components/AuthContext";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

 const handleLogin = async (e) => {
  e.preventDefault();
  try {
    const response = await axios.get("http://localhost:3000/users");
    const user = response.data.find(
      (u) => u.username === username && u.password === password
    );

    if (user) {
      login(user.role); // ✅ pass role to AuthContext
      if (user.role === "admin") {
        navigate("/admin-dashboard");
      } else {
        navigate("/mycourses");
      }
    } else {
      alert("Invalid credentials");
    }
  } catch (error) {
    console.error("Login failed", error);
  }
};


  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleLogin}
        className="bg-white p-6 rounded-lg shadow-md w-80"
      >
        <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full p-2 border mb-3 rounded"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 border mb-4 rounded"
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Login
        </button>
        <div className="flex">
          <p>New User ? </p>
          <Link to={'/signup'} className="text-blue-900"> Signup</Link>
        </div>
      </form>
    </div>
  );
};

export default Login;
