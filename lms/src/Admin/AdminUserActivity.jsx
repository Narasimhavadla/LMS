import React, { useState, useEffect } from "react";
import * as XLSX from "xlsx";

const AdminUserActivity = () => {
  const [activities, setActivities] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [showTodayOnly, setShowTodayOnly] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("userActivities")) || [];
    // 🔄 Reverse order (most recent first)
    const sorted = stored.sort(
      (a, b) => new Date(b.loginTime) - new Date(a.loginTime)
    );
    setActivities(sorted);
  }, []);

  // 🧩 Filter logic
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

  // 🧮 Pagination logic
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filtered.slice(startIndex, startIndex + itemsPerPage);

  // 🧾 Export filtered data to Excel
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
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">User Login/Logout Report</h2>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4 mb-4">
        {/* 🔍 Search Bar */}
        <input
          type="text"
          placeholder="Search by username..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
          className="border p-2 rounded w-60"
        />

        {/* 🎭 Role Filter */}
        <select
          value={roleFilter}
          onChange={(e) => {
            setRoleFilter(e.target.value);
            setCurrentPage(1);
          }}
          className="border p-2 rounded"
        >
          <option value="all">All Roles</option>
          <option value="admin">Admin</option>
          <option value="user">User</option>
        </select>

        {/* 📅 Today Button */}
        <button
          onClick={() => {
            setShowTodayOnly(!showTodayOnly);
            setCurrentPage(1);
          }}
          className={`px-4 py-2 rounded ${
            showTodayOnly
              ? "bg-blue-600 text-white"
              : "bg-gray-200 hover:bg-gray-300"
          }`}
        >
          {showTodayOnly ? "Showing Today" : "Show Today Only"}
        </button>

        {/* 📤 Export Button */}
        <button
          onClick={exportToExcel}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Export to Excel
        </button>
      </div>

      {/* Table */}
      <table className="w-full border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 border">User</th>
            <th className="p-2 border">Role</th>
            <th className="p-2 border">Login Date</th>
            <th className="p-2 border">Login Time</th>
            <th className="p-2 border">Logout Date</th>
            <th className="p-2 border">Logout Time</th>
          </tr>
        </thead>
        <tbody>
          {paginatedData.length > 0 ? (
            paginatedData.map((a, i) => (
              <tr key={i} className="text-center border-t">
                <td className="p-2 border">{a.userId}</td>
                <td className="p-2 border">{a.role || "N/A"}</td>
                <td className="p-2 border">
                  {new Date(a.loginTime).toLocaleDateString()}
                </td>
                <td className="p-2 border">
                  {new Date(a.loginTime).toLocaleTimeString()}
                </td>
                <td className="p-2 border">
                  {a.logoutTime
                    ? new Date(a.logoutTime).toLocaleDateString()
                    : "-"}
                </td>
                <td className="p-2 border">
                  {a.logoutTime
                    ? new Date(a.logoutTime).toLocaleTimeString()
                    : "-"}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td className="text-center p-4 border" colSpan="6">
                No data found.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-4">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Prev
          </button>

          <span className="font-medium">
            Page {currentPage} of {totalPages}
          </span>

          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default AdminUserActivity;
