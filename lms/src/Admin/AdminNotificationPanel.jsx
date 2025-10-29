import React, { useState, useEffect } from "react";
import { FaBell, FaCheck, FaTrash, FaEye, FaTimesCircle } from "react-icons/fa";
import { fetchNotifications, markNotificationAsRead, deleteNotification } from "../Components/notificationsApi";

// Only show requests FROM users to admin!
const adminNotificationTypes = [
  "certificate_requested",
  "contact_form_submitted",
  "assignment_submitted" // Add more if users trigger other types
];

const AdminNotificationPanel = ({ username, role }) => {
  const [notifications, setNotifications] = useState([]);
  const [showAll, setShowAll] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => { loadNotifications(); }, [username, role]);

  const loadNotifications = async () => {
    setLoading(true);
    // All admin-relevant notifications: only filter to those actually SENT FROM users
    const data = await fetchNotifications(username, role);
    // Optionally, ensure not sent by admin: (n.from !== "admin" or n.forRole === "admin")
    setNotifications(data.filter(
      n =>
        adminNotificationTypes.includes(n.type) &&
        (!n.forRole || n.forRole === "admin")
    ));
    setLoading(false);
  };

  const handleGotIt = async id => {
    await markNotificationAsRead(id);
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, status: "read" } : n))
    );
  };
  const handleDelete = async id => {
    await deleteNotification(id);
    setNotifications(prev => prev.filter(n => n.id !== id));
  };
  const handleClearAll = async () => {
    for (const notif of notifications) {
      await deleteNotification(notif.id);
    }
    setNotifications([]);
  };

  const unread = notifications.filter(n => n.status === "unread");
  const displayNotifications = showAll ? notifications : unread;

  return (
    <div style={{ maxWidth: 800, margin: "30px auto", padding: "20px 10px" }}>
      <div style={{ display: "flex", alignItems: "center", marginBottom: 15 }}>
        <FaBell style={{ color: "#2563eb", fontSize: 22 }} />
        <span style={{ marginLeft: 10, fontSize: 22, fontWeight: "bold", color: "#111827" }}>
          Notifications
        </span>
        <span
          style={{
            marginLeft: 15,
            background: "#ef4444",
            color: "white",
            borderRadius: 14,
            padding: "2px 10px",
            fontSize: 17
          }}
        >
          {unread.length}
        </span>
        <div style={{ marginLeft: "auto", display: "flex", gap: 12 }}>
          <button
            style={{
              background: "#6b7280",
              color: "white",
              padding: "7px 18px",
              borderRadius: 8,
              fontWeight: 500,
              border: "none"
            }}
            onClick={() => setShowAll(!showAll)}
          >
            <FaEye /> {showAll ? "Show Unread Only" : "Show All"}
          </button>
          {notifications.length > 0 && (
            <button
              style={{
                background: "#ef4444",
                color: "white",
                padding: "7px 18px",
                borderRadius: 8,
                fontWeight: 500,
                border: "none"
              }}
              onClick={handleClearAll}
            >
              <FaTimesCircle /> Clear All
            </button>
          )}
        </div>
      </div>
      {loading ? (
        <div style={{ textAlign: "center", color: "#1e293b", fontSize: 17 }}>Loading...</div>
      ) : displayNotifications.length === 0 ? (
        <div style={{ textAlign: "center", color: "#64748b", marginTop: 56 }}>
          <FaBell style={{ fontSize: 37, color: "#dbeafe" }} />
          <div>No notifications for you yet</div>
        </div>
      ) : (
        <div>
          {displayNotifications.map(n => (
            <div
              key={n.id}
              style={{
                background: n.status === "unread" ? "#eff6ff" : "#f3f4f6",
                borderLeft: n.status === "unread" ? "5px solid #2563eb" : "none",
                marginBottom: 15,
                borderRadius: 8,
                boxShadow: "0 1px 3px #cbd5e1",
                padding: 17,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between"
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 13 }}>
                <FaBell />
                <div>
                  <div style={{ fontWeight: "bold", fontSize: 16 }}>
                    {n.type === "certificate_requested"
                      ? "Certificate Request"
                      : n.type === "contact_form_submitted"
                      ? "Contact Submission"
                      : n.title || n.type}
                  </div>
                  <div style={{ color: "#2563eb", fontSize: 15 }}>{n.message}</div>
                  {n.courseName && (
                    <div style={{
                      color: "#10b981",
                      fontStyle: "italic",
                      marginTop: 4
                    }}>
                      Course: {n.courseName}
                    </div>
                  )}
                  {n.from && (
                    <div style={{
                      color: "#6b7280",
                      fontSize: 14,
                      marginTop: 2
                    }}>
                      From: {n.from}
                    </div>
                  )}
                </div>
              </div>
              <div style={{ display: "flex", gap: 12 }}>
                {n.status === "unread" && (
                  <button style={{
                    background: "#2563eb",
                    color: "white",
                    borderRadius: 7,
                    border: "none",
                    padding: "8px 14px",
                    fontWeight: 500,
                    fontSize: 16
                  }}
                    onClick={() => handleGotIt(n.id)}>
                    <FaCheck /> Got it
                  </button>
                )}
                <button
                  style={{
                    background: "#ef4444",
                    color: "white",
                    borderRadius: 7,
                    border: "none",
                    padding: "8px 14px",
                    fontWeight: 500,
                    fontSize: 16
                  }}
                  onClick={() => handleDelete(n.id)}
                >
                  <FaTrash /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      {notifications.length > 0 && (
        <div style={{ marginTop: 18, fontSize: 15, color: "#64748b" }}>
          Total: {notifications.length}, Unread: {unread.length}, Read:{" "}
          {notifications.length - unread.length}
        </div>
      )}
    </div>
  );
};

export default AdminNotificationPanel;
