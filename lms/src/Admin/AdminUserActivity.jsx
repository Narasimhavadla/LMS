import React, { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import { FaArrowLeft, FaArrowRight, FaFileExcel } from "react-icons/fa";

const AdminUserActivity = () => {
  const [activities, setActivities] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [showTodayOnly, setShowTodayOnly] = useState(false);
  const [selectedDate, setSelectedDate] = useState(""); // Calendar filter
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("userActivities")) || [];
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

    let matchesDate = true;
    if (selectedDate) {
      const loginDate = new Date(a.loginTime).toISOString().slice(0, 10);
      matchesDate = loginDate === selectedDate;
    } else if (showTodayOnly) {
      matchesDate =
        new Date(a.loginTime).toDateString() === new Date().toDateString();
    }

    return matchesSearch && matchesRole && matchesDate;
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
    <div className="p-4 max-w-5xl mx-auto">
      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <input
          type="text"
          placeholder="Search by User"
          className="border rounded px-3 py-2 text-sm focus:outline-blue-400"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
        <select
          value={roleFilter}
          onChange={e => setRoleFilter(e.target.value)}
          className="border rounded px-3 py-2 text-sm"
        >
          <option value="all">All</option>
          <option value="admin">Admin</option>
          <option value="user">User</option>
        </select>
        <label className="inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={showTodayOnly}
            disabled={!!selectedDate}
            onChange={e => setShowTodayOnly(e.target.checked)}
            className="mr-1"
          />
          <span className="text-sm">Show Today Only</span>
        </label>
        {/* Date Picker */}
        <input
          type="date"
          className="border rounded px-3 py-2 text-sm"
          value={selectedDate}
          onChange={e => {
            setSelectedDate(e.target.value);
            setShowTodayOnly(false);
          }}
        />
        <button
          className={`px-3 py-2 text-sm rounded bg-gray-200 ${!selectedDate ? "opacity-40" : "hover:bg-gray-300"}`}
          onClick={() => setSelectedDate("")}
          disabled={!selectedDate}
        >
          Clear Date
        </button>
        <button
          className="px-3 py-2 text-sm rounded bg-green-600 text-white flex items-center gap-2 hover:bg-green-700"
          onClick={exportToExcel}
        >
          <FaFileExcel /> Export to Excel
        </button>
      </div>
      {/* Table */}
      <div className="overflow-x-auto rounded-md shadow">
        <table className="min-w-full bg-white text-sm">
          <thead>
            <tr className="bg-blue-50 text-blue-800">
              <th className="py-3 px-4 text-left font-semibold">User</th>
              <th className="py-3 px-4 text-left font-semibold">Role</th>
              <th className="py-3 px-4 text-left font-semibold">Login Date</th>
              <th className="py-3 px-4 text-left font-semibold">Login Time</th>
              <th className="py-3 px-4 text-left font-semibold">Logout Date</th>
              <th className="py-3 px-4 text-left font-semibold">Logout Time</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-6 text-gray-400">
                  No data found.
                </td>
              </tr>
            ) : (
              paginatedData.map((a, idx) => (
                <tr key={idx} className="odd:bg-gray-50 hover:bg-blue-50 transition">
                  <td className="px-4 py-3">{a.userId}</td>
                  <td className="px-4 py-3">{a.role || "N/A"}</td>
                  <td className="px-4 py-3">{new Date(a.loginTime).toLocaleDateString()}</td>
                  <td className="px-4 py-3">{new Date(a.loginTime).toLocaleTimeString()}</td>
                  <td className="px-4 py-3">
                    {a.logoutTime
                      ? new Date(a.logoutTime).toLocaleDateString()
                      : "-"}
                  </td>
                  <td className="px-4 py-3">
                    {a.logoutTime
                      ? new Date(a.logoutTime).toLocaleTimeString()
                      : "-"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {/* Pagination */}
      <div className="flex items-center gap-3 mt-6">
        <button
          className="px-3 py-1 rounded bg-blue-100 hover:bg-blue-200"
          onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
          disabled={currentPage === 1}
        >
          <FaArrowLeft className="inline mr-1" /> Prev
        </button>
        <span>
          Page <b>{currentPage}</b> of <b>{totalPages}</b>
        </span>
        <button
          className="px-3 py-1 rounded bg-blue-100 hover:bg-blue-200"
          onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
          disabled={currentPage === totalPages || totalPages === 0}
        >
          Next <FaArrowRight className="inline ml-1" />
        </button>
      </div>
    </div>
  );
};

export default AdminUserActivity;
