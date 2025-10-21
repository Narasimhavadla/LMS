import React, { useState, useMemo } from "react";

export default function AdminAssignments() {
  // Sample assignment data
  const sampleAssignments = [
    {
      id: "a1",
      title: "React Project 1",
      course: "React for Beginners",
      user: "Lakshmi V.",
      dueDate: "2025-11-01",
      status: "Pending",
      description: "Build a small React app using hooks and components.",
    },
    {
      id: "a2",
      title: "SQL Query Optimization",
      course: "Advanced SQL Queries",
      user: "N. Srikanth",
      dueDate: "2025-10-25",
      status: "Completed",
      description: "Optimize given SQL queries and submit performance report.",
    },
  ];

  const [assignments, setAssignments] = useState(sampleAssignments);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const [isEditing, setIsEditing] = useState(false);
  const [editAssignment, setEditAssignment] = useState({
    id: "",
    title: "",
    course: "",
    user: "",
    dueDate: "",
    status: "Pending",
    description: "",
  });

  // Search & filter
  const filtered = useMemo(() => {
    return assignments.filter((a) => {
      const matchesQuery =
        query === "" ||
        a.title.toLowerCase().includes(query.toLowerCase()) ||
        a.course.toLowerCase().includes(query.toLowerCase()) ||
        a.user.toLowerCase().includes(query.toLowerCase());
      const matchesStatus = statusFilter === "All" || a.status === statusFilter;
      return matchesQuery && matchesStatus;
    });
  }, [assignments, query, statusFilter]);

  // CRUD Handlers
  const handleAddAssignment = () => {
    const newAssignment = { ...editAssignment, id: Date.now().toString() };
    setAssignments([...assignments, newAssignment]);
    setEditAssignment({
      id: "",
      title: "",
      course: "",
      user: "",
      dueDate: "",
      status: "Pending",
      description: "",
    });
    setIsEditing(false);
  };

  const handleUpdateAssignment = () => {
    setAssignments(
      assignments.map((a) => (a.id === editAssignment.id ? editAssignment : a))
    );
    setEditAssignment({
      id: "",
      title: "",
      course: "",
      user: "",
      dueDate: "",
      status: "Pending",
      description: "",
    });
    setIsEditing(false);
  };

  const handleDeleteAssignment = (id) => {
    setAssignments(assignments.filter((a) => a.id !== id));
  };

  const handleEditClick = (a) => {
    setIsEditing(true);
    setEditAssignment(a);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <header className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
        <h1 className="text-3xl font-semibold text-gray-800">Assignments</h1>
        <div className="flex gap-2 items-center">
          <button
            onClick={() => {
              setIsEditing(true);
              setEditAssignment({
                id: "",
                title: "",
                course: "",
                user: "",
                dueDate: "",
                status: "Pending",
                description: "",
              });
            }}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg shadow hover:opacity-95"
          >
            + Add Assignment
          </button>
        </div>
        <div className="mt-2 flex flex-col md:flex-row gap-2 w-full md:w-auto">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by title, course, or user..."
            className="border rounded-lg p-2 flex-1"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border rounded-lg p-2"
          >
            <option value="All">All Status</option>
            <option value="Pending">Pending</option>
            <option value="Completed">Completed</option>
          </select>
        </div>
      </header>

      {/* Add/Edit Form */}
      {isEditing && (
        <div className="max-w-3xl mx-auto bg-white p-6 rounded-2xl shadow mb-6">
          <h2 className="text-xl font-semibold mb-4">
            {editAssignment.id ? "Edit Assignment" : "Add New Assignment"}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Assignment Title"
              value={editAssignment.title}
              onChange={(e) =>
                setEditAssignment({ ...editAssignment, title: e.target.value })
              }
              className="border p-2 rounded"
            />
            <input
              type="text"
              placeholder="Course"
              value={editAssignment.course}
              onChange={(e) =>
                setEditAssignment({ ...editAssignment, course: e.target.value })
              }
              className="border p-2 rounded"
            />
            <input
              type="text"
              placeholder="User"
              value={editAssignment.user}
              onChange={(e) =>
                setEditAssignment({ ...editAssignment, user: e.target.value })
              }
              className="border p-2 rounded"
            />
            <input
              type="date"
              placeholder="Due Date"
              value={editAssignment.dueDate}
              onChange={(e) =>
                setEditAssignment({ ...editAssignment, dueDate: e.target.value })
              }
              className="border p-2 rounded"
            />
            <select
              value={editAssignment.status}
              onChange={(e) =>
                setEditAssignment({ ...editAssignment, status: e.target.value })
              }
              className="border p-2 rounded"
            >
              <option value="Pending">Pending</option>
              <option value="Completed">Completed</option>
            </select>
            <textarea
              placeholder="Description"
              value={editAssignment.description}
              onChange={(e) =>
                setEditAssignment({ ...editAssignment, description: e.target.value })
              }
              className="border p-2 rounded md:col-span-2"
            />
          </div>
          <div className="mt-4 flex gap-2">
            <button
              onClick={editAssignment.id ? handleUpdateAssignment : handleAddAssignment}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              {editAssignment.id ? "Update Assignment" : "Add Assignment"}
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Assignments Table */}
      <div className="max-w-7xl mx-auto bg-white shadow rounded-2xl overflow-x-auto">
        <table className="w-full table-auto">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left">Title</th>
              <th className="px-4 py-2 text-left">Course</th>
              <th className="px-4 py-2 text-left">User</th>
              <th className="px-4 py-2 text-left">Due Date</th>
              <th className="px-4 py-2 text-left">Status</th>
              <th className="px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((a) => (
              <tr key={a.id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-2">{a.title}</td>
                <td className="px-4 py-2">{a.course}</td>
                <td className="px-4 py-2">{a.user}</td>
                <td className="px-4 py-2">{a.dueDate}</td>
                <td className="px-4 py-2">{a.status}</td>
                <td className="px-4 py-2 flex gap-2">
                  <button
                    onClick={() => handleEditClick(a)}
                    className="px-2 py-1 bg-yellow-500 text-white rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteAssignment(a.id)}
                    className="px-2 py-1 bg-red-600 text-white rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center py-4 text-gray-500">
                  No assignments found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
