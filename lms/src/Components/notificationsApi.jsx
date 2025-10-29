import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// Get notifications (optionally for role)
export const fetchNotifications = async (username, role = null) => {
    const queryParams = new URLSearchParams({ username });
    if (role) queryParams.append('role', role);
    const res = await axios.get(`${API_URL}/notifications?${queryParams}`);
    return res.data;
};
// Send notification
export const sendNotification = async (notification) => {
  await axios.post(`${API_URL}/notifications`, notification);
};
// Mark as read ("Got it")
export const markNotificationAsRead = async (id) => {
  await axios.put(`${API_URL}/notifications/${id}`, { status: "read" });
};
// Delete notification
export const deleteNotification = async (id) => {
  await axios.delete(`${API_URL}/notifications/${id}`);
};
// Get unread count (for badge)
export const getNotificationCount = async (username, role = null) => {
    const notifications = await fetchNotifications(username, role);
    return notifications.filter(n => n.status === "unread").length;
};
