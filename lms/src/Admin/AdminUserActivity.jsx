import React, { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import { FaSearch, FaArrowLeft, FaArrowRight, FaFileExcel } from "react-icons/fa";

const AdminUserActivity = () => {
  const [activities, setActivities] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [showTodayOnly, setShowTodayOnly] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("userActivities")) || [];
    // Most recent first
    const sorted = stored.sort(
      (a, b) => new Date(b.loginTime) - new Date(a.loginTime)
    );
    setActivities(sorted);
  }, []);

  // Filtering logic
  const filtered = activities.filter((a) => {
    const matchesSearch = a.userId
      ?.toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesRole =
      roleFilter === "all" || (a.role && a.role.toLowerCase() === roleFilter);
    const matchesToday = !showTodayOnly
      ? true
      : new Date(a.loginTime).toDateString() === new Date().toDateString();
    return matchesSearch && matchesRole && matchesToday;
  });

  // Pagination
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filtered.slice(startIndex, startIndex + itemsPerPage);

  // Export to Excel
  const exportToExcel = () => {
    const exportData = filtered.length > 0 ? filtered : activities;
    const ws = XLSX.utils.json_to_sheet(
      exportData.map((a) => ({
        User: a.userId,
        Role: a.role || "N/A",
        "Login Date": new Date(a.loginTime).toLocaleDateString(),
        "Login Time": new Date(a.loginTime).toLocaleTimeString(),
        "Logout Date": a.logoutTime
          ? new Date(a.logoutTime).toLocaleDateString()
          : "",
        "Logout Time": a.logoutTime
          ? new Date(a.logoutTime).toLocaleTimeString()
          : "",
      }))
    );
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "User Activity");
    XLSX.writeFile(wb, "User_Activity_Report.xlsx");
  };

  return (
    <div className="p-6 max-w-6xl mx-auto min-h-screen">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div className="flex gap-2 items-center grow">
          <div className="relative grow">
            <input
              type="text"
              placeholder="Search user..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="pl-10 pr-3 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-300 w-full"
            />
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400" />
          </div>
          <select
            value={roleFilter}
            onChange={(e) => {
              setRoleFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="border border-blue-200 rounded px-3 py-2 focus:ring-blue-300"
          >
            <option value="all">All Roles</option>
            <option value="admin">Admin</option>
            <option value="user">User</option>
          </select>
          <button
            onClick={() => setShowTodayOnly((t) => !t)}
            className={`px-4 py-2 rounded transition text-sm font-semibold border ${
              showTodayOnly
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-gray-50 text-blue-800 border-blue-200"
            }`}
          >
            Today Only
          </button>
        </div>
        <button
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm"
          onClick={exportToExcel}
        >
          <FaFileExcel /> Export Excel
        </button>
      </div>
      <div className="overflow-auto bg-white rounded-xl border border-blue-100 shadow">
        <table className="w-full text-sm min-w-[800px]">
          <thead className="sticky top-0 bg-blue-100">
            <tr>
              <th className="px-4 py-3 text-left">User</th>
              <th className="px-4 py-3 text-left">Role</th>
              <th className="px-4 py-3 text-left">Login Date</th>
              <th className="px-4 py-3 text-left">Login Time</th>
              <th className="px-4 py-3 text-left">Logout Date</th>
              <th className="px-4 py-3 text-left">Logout Time</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-12 text-center text-gray-300">
                  No data found.
                </td>
              </tr>
            ) : (
              paginatedData.map((a, idx) => (
                <tr
                  key={a.loginTime + a.userId}
                  className={`hover:bg-blue-50 transition ${
                    idx % 2 === 0 ? "bg-gray-50" : "bg-white"
                  }`}
                >
                  <td className="px-4 py-2 font-semibold">{a.userId}</td>
                  <td className="px-4 py-2">{a.role || "N/A"}</td>
                  <td className="px-4 py-2">
                    {new Date(a.loginTime).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-2">
                    {new Date(a.loginTime).toLocaleTimeString()}
                  </td>
                  <td className="px-4 py-2">
                    {a.logoutTime
                      ? new Date(a.logoutTime).toLocaleDateString()
                      : <span className="text-gray-400">-</span>}
                  </td>
                  <td className="px-4 py-2">
                    {a.logoutTime
                      ? new Date(a.logoutTime).toLocaleTimeString()
                      : <span className="text-gray-400">-</span>}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {/* Pagination */}
      <div className="flex justify-center items-center gap-2 my-8">
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((p) => p - 1)}
          className={`p-2 rounded-md ${
            currentPage === 1
              ? "bg-gray-200 text-gray-400"
              : "bg-blue-200 text-blue-800 hover:bg-blue-300"
          }`}
        >
          <FaArrowLeft />
        </button>
        <span className="px-3 font-bold text-blue-700">
          Page {currentPage} of {totalPages || 1}
        </span>
        <button
          disabled={currentPage === totalPages || totalPages === 0}
          onClick={() => setCurrentPage((p) => p + 1)}
          className={`p-2 rounded-md ${
            currentPage === totalPages || totalPages === 0
              ? "bg-gray-200 text-gray-400"
              : "bg-blue-200 text-blue-800 hover:bg-blue-300"
          }`}
        >
          <FaArrowRight />
        </button>
      </div>
    </div>
  );
};

export default AdminUserActivity;
