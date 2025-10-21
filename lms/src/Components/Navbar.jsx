import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "./AuthContext";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { isLoggedIn, logout } = useContext(AuthContext);
  // const { isLoggedIn, logout } = useState(false);


  return (
    <nav className="bg-gradient-to-r from-blue-700 to-indigo-800 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link to="/" className="text-2xl font-bold tracking-wide">
            LMS Portal
          </Link>

          <div className="hidden md:flex items-center space-x-6">
            <Link to="/" className="hover:text-gray-200">Home</Link>
            <Link to="/course" className="hover:text-gray-200">Courses</Link>
            <Link to="/service" className="hover:text-gray-200">Services</Link>

            {/* ✅ Show only if logged in */}
            {isLoggedIn && (
              <Link to="/assignment" className="hover:text-gray-200">
                Assignments
              </Link>
            )}

            <Link to="/editor" className="hover:text-gray-200">Compiler</Link>
            {isLoggedIn && (
              <Link to="/student-certificate" className="hover:text-gray-200">
                Certificate
              </Link>
            )}
            {isLoggedIn ? (
              <button onClick={logout} className="hover:text-gray-200">
                Logout
              </button>
            ) : (
              <Link to="/login" className="hover:text-gray-200">
                Login
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="text-white focus:outline-none"
            >
              {menuOpen ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-blue-600 px-4 pb-4 space-y-2">
          <Link to="/" className="block py-2 hover:text-gray-200">Home</Link>
          <Link to="/courses" className="block py-2 hover:text-gray-200">Courses</Link>

          {isLoggedIn && (
            <Link to="/assignments" className="block py-2 hover:text-gray-200">
              Assignments
            </Link>
          )}

          <Link to="/editor" className="block py-2 hover:text-gray-200">Editor</Link>

          {isLoggedIn ? (
            <button
              onClick={logout}
              className="block py-2 hover:text-gray-200 w-full text-left"
            >
              Logout
            </button>
          ) : (
            <Link to="/login" className="block py-2 hover:text-gray-200">
              Login
            </Link>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
