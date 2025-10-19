import React from "react";
import { Link } from "react-router-dom";

const Signup = () => (
  <div className="flex items-center justify-center min-h-screen bg-gray-50">
    <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-md">
      <h2 className="text-2xl font-bold text-center mb-6 text-blue-700">Create Account</h2>
      <form>
        <input type="text" placeholder="Full Name" className="w-full border p-3 mb-4 rounded" />
        <input type="email" placeholder="Email" className="w-full border p-3 mb-4 rounded" />
        <input type="password" placeholder="Password" className="w-full border p-3 mb-4 rounded" />
        <button className="w-full bg-blue-700 text-white py-3 rounded hover:bg-blue-600 transition">
          Sign Up
        </button>
      </form>
      <p className="text-center mt-4">
        Already have an account? <Link to="/login" className="text-blue-700 font-semibold">Login</Link>
      </p>
    </div>
  </div>
);

export default Signup;
