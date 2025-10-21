import React, { useState } from "react";
import { Doughnut, Line } from "react-chartjs-2";
import AdminCertificateManagement from "./AdminCertificate";
import SkillManagement from "../Components/skillManagment";
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

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("progress");

  // Doughnut chart data
  const studentData = {
    labels: ["Registered", "In Progress", "Completed"],
    datasets: [
      {
        label: "Students",
        data: [50, 30, 20], // replace with dynamic data
        backgroundColor: ["#3B82F6", "#F59E0B", "#10B981"],
        borderColor: ["#ffffff", "#ffffff", "#ffffff"],
        borderWidth: 2
      }
    ]
  };

  // Line chart data
  const monthlyData = {
    labels: ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],
    datasets: [
      {
        label: "Students Joined",
        data: [5, 8, 12, 7, 15, 10, 20, 18, 12, 25, 30, 28], // replace with dynamic data
        borderColor: "#3B82F6",
        backgroundColor: "rgba(59,130,246,0.2)",
        fill: true,
        tension: 0.4
      }
    ]
  };

  const renderContent = () => {
    switch (activeTab) {
      case "progress":
        return (
          <div className="flex flex-wrap justify-center gap-8 h-[550px] ">
            {/* Doughnut Chart */}
            <div className=" bg-gray-100 p-4 rounded shadow w-[40%] h-full  min-w-[300px] text-center">
              <h2 className="text-xl font-bold mb-4">Course Progress Overview</h2>
              <div className="h-[90%] ">
                <Doughnut data={studentData} />
              </div>
              <div className="mt-4 flex justify-center space-x-4">
                <div><span className="inline-block w-3 h-3 bg-blue-600 mr-2"></span> Registered</div>
                <div><span className="inline-block w-3 h-3 bg-yellow-500 mr-2"></span> In Progress</div>
                <div><span className="inline-block w-3 h-3 bg-green-500 mr-2"></span> Completed</div>
              </div>
            </div>

            {/* Line Chart */}
            <div className="bg-gray-100 p-4 rounded shadow w-[40%] min-w-[300px] text-center">
              <h2 className="text-xl font-bold mb-4">Students Joined Per Month</h2>
              <Line data={monthlyData} options={{
                responsive: true,
                plugins: {
                  legend: { position: "top" },
                  title: { display: true, text: "Monthly Student Enrollment" }
                }
              }} />
            </div>
          </div>
        );
      case "skills":
        return (
          <div>
            <SkillManagement />
          </div>
        );
      case "assignments":
        return (
          <div className="p-4 bg-gray-100 rounded shadow">
            <h2 className="text-xl font-bold mb-2">Assignments Management</h2>
            <ul className="mt-4 list-decimal list-inside">
              <li>React Project 1</li>
              <li>Python Script Assignment</li>
              <li>Database Design Exercise</li>
            </ul>
          </div>
        );
      case "certificates":
        return (
        //   <div className="p-4 bg-gray-100 rounded shadow">
        //     <h2 className="text-xl font-bold mb-2">Certificates</h2>
        //     <ul className="mt-4 list-disc list-inside">
        //       <li>React Fundamentals Certificate</li>
        //       <li>Python Basics Certificate</li>
        //       <li>Database Design Certificate</li>
        //     </ul>
        //   </div>
        <div>
            <AdminCertificateManagement />
        </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-60 bg-gray-800 text-white flex flex-col p-6 space-y-4">
        <h1 className="text-2xl font-bold mb-6 text-center">Admin Dashboard</h1>
        <button
          onClick={() => setActiveTab("progress")}
          className={`py-3 px-4 rounded text-left font-semibold ${
            activeTab === "progress" ? "bg-blue-600" : "hover:bg-gray-700"
          }`}
        >
          Progress
        </button>
        <button
          onClick={() => setActiveTab("skills")}
          className={`py-3 px-4 rounded text-left font-semibold ${
            activeTab === "skills" ? "bg-blue-600" : "hover:bg-gray-700"
          }`}
        >
          Technical Skills
        </button>
        <button
          onClick={() => setActiveTab("assignments")}
          className={`py-3 px-4 rounded text-left font-semibold ${
            activeTab === "assignments" ? "bg-blue-600" : "hover:bg-gray-700"
          }`}
        >
          Assignments
        </button>
        <button
          onClick={() => setActiveTab("certificates")}
          className={`py-3 px-4 rounded text-left font-semibold ${
            activeTab === "certificates" ? "bg-blue-600" : "hover:bg-gray-700"
          }`}
        >
          Certificates
        </button>
      </div>

      {/* Main content */}
      <div className="flex-1 p-6 overflow-auto">{renderContent()}</div>
    </div>
  );
};

export default AdminDashboard;
