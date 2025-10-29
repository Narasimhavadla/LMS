import React, { useState, useEffect,useContext } from "react";
import { Doughnut, Line } from "react-chartjs-2";
import { FaBell, FaUsers, FaClipboardList, FaChartPie, FaPlus, FaUserCheck, FaVideo, FaCertificate, FaCogs, FaUserCircle } from "react-icons/fa";
import NotificationsView from "../Components/NotificationsView";
import { fetchNotifications } from "../Components/notificationsApi";
import AdminCertificateManagement from "./AdminCertificate";
import SkillManagement from "../Components/skillManagment";
import AdminEnrollments from "./AdminEnrollPage";
import AddAdmin from "./AddAdmin";
import AdminUserActivity from "./AdminUserActivity";
import VideoUploadManager from "./VideoUploadManager";
import ApprovedEnrollments from "./ApprovedEnrollments";
import AdminAssignments from "./Adminassignment";
import AdminNotificationPanel from "./AdminNotificationPanel";
import { AuthContext } from "../Components/AuthContext"; // adjust path as per your project


import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title
} from "chart.js";
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title
);

const sidebarTabs = [
  { key: "progress", label: "Progress", icon: <FaChartPie /> },
  { key: "enrollments", label: "Enrollments", icon: <FaUsers /> },
  { key: "approvedEnrollment", label: "Approved Enrollments", icon: <FaUserCheck /> },
  { key: "skills", label: "Course Management", icon: <FaCogs /> },
  { key: "videoUpload", label: "Add Videos", icon: <FaVideo /> },
  { key: "assignments", label: "Assignments", icon: <FaClipboardList /> },
  { key: "certificates", label: "Certificates", icon: <FaCertificate /> },
  { key: "addAdmin", label: "Add Admin", icon: <FaPlus /> },
  { key: "adminUserActivity", label: "Login Report", icon: <FaUserCircle /> },
  { key: "notifications", label: "Notifications", icon: <FaBell /> }
];

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("progress");
  const [notifications, setNotifications] = useState([]);
  
  // const adminUsername = "admin";  If you have auth, get from context
const [adminNotifCount, setAdminNotifCount] = useState(0);
const { username: adminUsername } = useContext(AuthContext);
// Fallback: if you use role, also get role = "admin"



  const API_URL = import.meta.env.VITE_API_URL

  useEffect(() => {
  // Replace with your actual API endpoint and response format!
  fetch(`${API_URL}/notifications`) // or wherever your data comes from!
    .then(res => res.json())
    .then(data => {
      // Update logic for unread notifications -- adapt as needed
      const count = Array.isArray(data)
        ? data.filter(n => n.status === "unread" || !n.read).length
        : 0;
      setAdminNotifCount(count);
    });
}, []);

 

  // useEffect(() => {
  //   fetchNotifications(adminUsername).then(setNotifications);
  // }, []);
  useEffect(() => {
  async function loadNotifications() {
    const notifData = await fetchNotifications(adminUsername, "admin");
    setNotifications(notifData || []);
    setAdminNotifCount((notifData || []).filter(n => n.status === "unread").length);
  }
  loadNotifications();
}, [adminUsername]);

useEffect(() => {
  setAdminNotifCount(notifications.filter(n => n.status === "unread").length);
}, [notifications]);


  const handleGotIt = async (id) => {
    await markNotificationRead(id);
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, status: "read" } : n))
    );
  };

  const unreadCount = notifications.filter((n) => n.status === "unread").length;

  const studentData = {
    labels: ["Registered", "In Progress", "Completed"],
    datasets: [
      {
        label: "Students",
        data: [50, 30, 20], // Replace with dynamic data!
        backgroundColor: ["#3B82F6", "#F59E0B", "#10B981"],
        borderColor: ["#ffffff", "#ffffff", "#ffffff"],
        borderWidth: 2
      }
    ]
  };

  const monthlyData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    datasets: [
      {
        label: "Students Joined",
        data: [5, 8, 12, 7, 15, 10, 20, 18, 12, 25, 30, 28], // Replace with dynamic data!
        borderColor: "#3B82F6",
        backgroundColor: "rgba(59,130,246,0.2)",
        fill: true,
        tension: 0.4
      }
    ]
  };

  // Tab render logic
  const renderContent = () => {
    switch (activeTab) {
      case "progress":
        return (
          <div className="flex flex-wrap justify-center gap-8 h-[550px]">
            {/* Doughnut Chart */}
            <div className="bg-gray-100 p-4 rounded shadow w-[40%] h-full min-w-[300px] text-center">
              <h2 className="text-xl font-bold mb-4">Course Progress Overview</h2>
              <div className="h-[190px] ">
                <Doughnut data={studentData} />
              </div>
              <div className="mt-4 flex justify-center space-x-4">
                <div>
                  <span className="inline-block w-3 h-3 bg-blue-600 mr-2"></span> Registered
                </div>
                <div>
                  <span className="inline-block w-3 h-3 bg-yellow-500 mr-2"></span> In Progress
                </div>
                <div>
                  <span className="inline-block w-3 h-3 bg-green-500 mr-2"></span> Completed
                </div>
              </div>
            </div>
            {/* Line Chart */}
            <div className="bg-gray-100 p-4 rounded shadow w-1/3 min-w-[300px] text-center">
              <h2 className="text-xl font-bold mb-4">Students Joined Per Month</h2>
              <Line
                data={monthlyData}
                options={{
                  responsive: true,
                  plugins: {
                    legend: { position: "top" },
                    title: { display: true, text: "Monthly Student Enrollment" }
                  }
                }}
              />
            </div>
          </div>
        );
      case "enrollments":
        return <AdminEnrollments />;
      case "approvedEnrollment":
        return <ApprovedEnrollments />;
      case "skills":
        return <SkillManagement />;
      case "videoUpload":
        return <VideoUploadManager />;
      case "assignments":
        return (
          <div className="p-4 bg-gray-100 rounded shadow">
            <AdminAssignments />
          </div>
        );
      case "certificates":
        return (
          <div className="p-4 bg-gray-100 rounded shadow">
            <h2 className="text-xl font-bold mb-2">Certificates</h2>
            
            <AdminCertificateManagement />
          </div>
        );
      case "addAdmin":
        return <AddAdmin />;
      case "adminUserActivity":
        return <AdminUserActivity />;
      case "notifications":
        return (
          <div>
            

            <AdminNotificationPanel />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-60 bg-gray-800 text-white flex flex-col p-6 space-y-2">
        <h1 className="text-2xl font-bold mb-6 text-center">Admin Dashboard</h1>
        {sidebarTabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-2 py-2 px-4 rounded text-left font-semibold transition ${
              activeTab === tab.key
                ? "bg-blue-600 font-bold"
                : "hover:bg-gray-700"
            } relative`}
          >
            {tab.icon}
            <span>{tab.label}</span>
            {tab.key === "notifications" && adminNotifCount > 0 && (
              <span
                className="ml-auto bg-red-500 text-white rounded-full px-2 text-xs"
                style={{ position: "absolute", right: "16px" }}
              >
                {adminNotifCount}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 overflow-auto">{renderContent()}</div>
    </div>
  );
};

export default AdminDashboard;
