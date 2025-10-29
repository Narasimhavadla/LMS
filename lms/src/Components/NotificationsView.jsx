import React, { useState, useEffect } from 'react';
import { FaBell, FaCheck, FaTrash, FaEye, FaTimesCircle, FaCertificate, FaClipboardList, FaRegCheckCircle } from 'react-icons/fa';
import { fetchNotifications, markNotificationAsRead, deleteNotification } from './notificationsApi';

// ONLY user-relevant notification types sent "to" user from admin
const userNotificationTypes = [
  "certificate_approved",
  "assignment_created"
  // add more as needed, like "admin_message"
];

const NotificationsView = ({ username, role }) => {
  const [notifications, setNotifications] = useState([]);
  const [showAll, setShowAll] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadNotifications();
  }, [username, role]);

  const loadNotifications = async () => {
    setLoading(true);
    const data = await fetchNotifications(username, role);
    // Only show notifications meant for user, sent from admin
    setNotifications(data.filter(n => userNotificationTypes.includes(n.type)));
    setLoading(false);
  };

  const handleGotIt = async (id) => {
    await markNotificationAsRead(id);
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, status: "read" } : n));
  };

  const handleDelete = async (id) => {
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

  const getIcon = (type) => {
    switch (type) {
      case "certificate_approved": return <FaCertificate style={{ color: "#2563eb" }} />;
      case "assignment_created": return <FaClipboardList style={{ color: "#10b981" }} />;
      default: return <FaBell style={{ color: "#64748b" }} />;
    }
  };

  return (
    <div style={{ maxWidth: 800, margin: "30px auto", padding: "20px 10px" }}>
      <div style={{ display: "flex", alignItems: "center", marginBottom: 15 }}>
        <FaBell style={{ color: "#2563eb", fontSize: 22 }} />
        <span style={{ marginLeft: 10, fontSize: 22, fontWeight: "bold", color: "#111827" }}>Notifications</span>
        
        <div style={{ marginLeft: "auto", display: "flex", gap: 12 }}>
          <button style={{
            background: "#6b7280",
            color: "white",
            padding: "7px 18px",
            borderRadius: 8,
            fontWeight: 500,
            border: "none"
          }} onClick={() => setShowAll(!showAll)}>
            <FaEye /> {showAll ? "Show Unread Only" : "Show All"}
          </button>
          {notifications.length > 0 && (
            <button style={{
              background: "#ef4444",
              color: "white",
              padding: "7px 18px",
              borderRadius: 8,
              fontWeight: 500,
              border: "none"
            }} onClick={handleClearAll}>
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
            <div key={n.id} style={{
              background: n.status === 'unread' ? "#eff6ff" : "#f3f4f6",
              borderLeft: n.status === 'unread' ? "5px solid #2563eb" : "none",
              marginBottom: 15,
              borderRadius: 8,
              boxShadow: "0 1px 3px #cbd5e1",
              padding: 17,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between"
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 13 }}>
                {getIcon(n.type)}
                <div>
                  <div style={{ fontWeight: "bold", fontSize: 16 }}>
                    {n.type === "certificate_approved" ? "Certificate Ready" : n.type === "assignment_created" ? "New Assignment" : (n.title || n.type)}
                  </div>
                  <div style={{ color: "#2563eb", fontSize: 15 }}>
                    {n.message}
                  </div>
                  {/* Show course name if available */}
                  {n.courseName &&
                    <div style={{
                      color: "#10b981",
                      fontStyle: "italic",
                      marginTop: 4
                    }}>
                      Course: {n.courseName}
                    </div>
                  }
                </div>
              </div>
              <div style={{ display: "flex", gap: 12 }}>
                {n.status === 'unread' && (
                  <button style={{
                    background: "#2563eb",
                    color: "white",
                    borderRadius: 7,
                    border: "none",
                    padding: "8px 14px",
                    fontWeight: 500,
                    fontSize: 16
                  }} onClick={() => handleGotIt(n.id)}>
                    <FaCheck /> Got it
                  </button>
                )}
                <button style={{
                  background: "#ef4444",
                  color: "white",
                  borderRadius: 7,
                  border: "none",
                  padding: "8px 14px",
                  fontWeight: 500,
                  fontSize: 16
                }} onClick={() => handleDelete(n.id)}>
                  <FaTrash /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      {notifications.length > 0 &&
        <div style={{ marginTop: 18, fontSize: 15, color: "#64748b" }}>
          Total: {notifications.length}, Unread: {unread.length}, Read: {notifications.length - unread.length}
        </div>
      }
    </div>
  );
};

export default NotificationsView;
