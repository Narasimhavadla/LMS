import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaTrashAlt, FaEdit, FaSave, FaTimes } from "react-icons/fa";

export default function AdminEnrollments() {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [editData, setEditData] = useState({});

  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchEnrollments = async () => {
      try {
        const res = await axios.get(`${API_URL}/enrollments`);
        const sortedData = [...res.data].sort(
          (a, b) => new Date(b.filledDate) - new Date(a.filledDate)
        );
        setEnrollments(sortedData);
      } catch (err) {
        console.error("Error fetching enrollments:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchEnrollments();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this enrollment?")) return;

    setDeleting(id);
    try {
      await axios.delete(`${API_URL}/enrollments/${id}`);
      setEnrollments((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      console.error("Error deleting enrollment:", err);
      alert("Failed to delete enrollment.");
    } finally {
      setDeleting(null);
    }
  };

  const handleEdit = (enroll) => {
    setEditingId(enroll.id);
    setEditData({
      name: enroll.name,
      email: enroll.email,
      phone: enroll.phone,
      courseName: enroll.courseName,
    });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditData({});
  };

  const handleSave = async (id) => {
    try {
      await axios.put(`${API_URL}/enrollments/${id}`, {
        ...editData,
        filledDate: enrollments.find((e) => e.id === id).filledDate, // keep original date
      });
      setEnrollments((prev) =>
        prev.map((e) => (e.id === id ? { ...e, ...editData } : e))
      );
      setEditingId(null);
      setEditData({});
    } catch (error) {
      console.error("Error updating enrollment:", error);
      alert("Failed to update enrollment.");
    }
  };

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen text-gray-600 text-lg font-semibold">
        Loading enrollments...
      </div>
    );

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-800 text-center">
        Enrolled Students List
      </h1>

      <div className="overflow-x-auto bg-white shadow-lg rounded-xl">
        <table className="min-w-full text-left border-collapse">
          <thead className="bg-blue-700 text-white">
            <tr>
              <th className="p-3 border-b">#</th>
              <th className="p-3 border-b">Name</th>
              <th className="p-3 border-b">Email</th>
              <th className="p-3 border-b">Phone</th>
              <th className="p-3 border-b">Course</th>
              <th className="p-3 border-b">Date</th>
              <th className="p-3 border-b text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {enrollments.length === 0 ? (
              <tr>
                <td colSpan="7" className="p-4 text-center text-gray-500">
                  No enrollments found
                </td>
              </tr>
            ) : (
              enrollments.map((enroll, index) => (
                <tr key={enroll.id} className="hover:bg-gray-100 transition-all">
                  <td className="p-3 border-b">{index + 1}</td>
                  <td className="p-3 border-b">
                    {editingId === enroll.id ? (
                      <input
                        value={editData.name}
                        onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                        className="border rounded px-2 py-1 w-full"
                      />
                    ) : (
                      enroll.name
                    )}
                  </td>
                  <td className="p-3 border-b">
                    {editingId === enroll.id ? (
                      <input
                        value={editData.email}
                        onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                        className="border rounded px-2 py-1 w-full"
                      />
                    ) : (
                      enroll.email
                    )}
                  </td>
                  <td className="p-3 border-b">
                    {editingId === enroll.id ? (
                      <input
                        value={editData.phone}
                        onChange={(e) => setEditData({ ...editData, phone: e.target.value })}
                        className="border rounded px-2 py-1 w-full"
                      />
                    ) : (
                      enroll.phone
                    )}
                  </td>
                  <td className="p-3 border-b">
                    {editingId === enroll.id ? (
                      <input
                        value={editData.courseName}
                        onChange={(e) => setEditData({ ...editData, courseName: e.target.value })}
                        className="border rounded px-2 py-1 w-full"
                      />
                    ) : (
                      enroll.courseName
                    )}
                  </td>
                  <td className="p-3 border-b">{enroll.filledDate}</td>
                  <td className="p-3 border-b text-center flex justify-center gap-2">
                    {editingId === enroll.id ? (
                      <>
                        <button
                          onClick={() => handleSave(enroll.id)}
                          className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 flex items-center gap-1"
                        >
                          <FaSave /> Save
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          className="bg-gray-400 text-white px-3 py-1 rounded hover:bg-gray-500 flex items-center gap-1"
                        >
                          <FaTimes /> Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => handleEdit(enroll)}
                          className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 flex items-center gap-1"
                        >
                          <FaEdit /> Edit
                        </button>
                        <button
                          onClick={() => handleDelete(enroll.id)}
                          disabled={deleting === enroll.id}
                          className={`px-3 py-1 rounded text-white flex items-center gap-1 ${
                            deleting === enroll.id
                              ? "bg-gray-400 cursor-not-allowed"
                              : "bg-red-600 hover:bg-red-700 transition-all"
                          }`}
                        >
                          <FaTrashAlt /> {deleting === enroll.id ? "Deleting..." : "Delete"}
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
