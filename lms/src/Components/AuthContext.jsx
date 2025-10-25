import React, { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState(null); // "admin" or "user"
  const [username, setUsername] = useState(null);
  const [email, setEmail] = useState(null); // NEW: store email
  const navigate = useNavigate();

  // 🧩 Utility: Save login/logout events
  const logUserActivity = (userName, type, userRole = null) => {
    const activities = JSON.parse(localStorage.getItem("userActivities")) || [];
    const now = new Date();

    if (type === "login") {
      activities.push({
        userId: userName,
        role: userRole,
        loginTime: now.toISOString(),
        logoutTime: null,
      });
    } else if (type === "logout") {
      const index = activities.findIndex(
        (a) => a.userId === userName && a.logoutTime === null
      );
      if (index !== -1) {
        activities[index].logoutTime = now.toISOString();
      }
    }

    localStorage.setItem("userActivities", JSON.stringify(activities));
  };

  useEffect(() => {
    const loggedIn = localStorage.getItem("isLoggedIn") === "true";
    const storedRole = localStorage.getItem("role");
    const storedUsername = localStorage.getItem("username");
    const storedEmail = localStorage.getItem("email"); // NEW
    setIsLoggedIn(loggedIn);
    setRole(storedRole);
    setUsername(storedUsername);
    setEmail(storedEmail); // NEW
  }, []);

  // ✅ When user logs in
  const login = (userRole, userName, userEmail) => {
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("role", userRole);
    localStorage.setItem("username", userName);
    localStorage.setItem("email", userEmail); // NEW

    setIsLoggedIn(true);
    setRole(userRole);
    setUsername(userName);
    setEmail(userEmail); // NEW

    // Track login
    logUserActivity(userName, "login", userRole);
  };

  // ✅ When user logs out
  const logout = () => {
    logUserActivity(username, "logout");

    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("role");
    localStorage.removeItem("username");
    localStorage.removeItem("email"); // NEW

    setIsLoggedIn(false);
    setRole(null);
    setUsername(null);
    setEmail(null); // NEW
    navigate("/", { replace: true });
  };

  return (
    <AuthContext.Provider
      value={{ isLoggedIn, role, username, email, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};
