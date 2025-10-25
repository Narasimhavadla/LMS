import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaTrashAlt, FaCheck } from "react-icons/fa";

export default function AdminEnrollments() {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);
  const [credentials, setCredentials] = useState({});
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchEnrollments = async () => {
      try {
        const res = await axios.get(`${API_URL}/enrollments`);
        const sorted = [...res.data].sort(
          (a, b) => new Date(b.filledDate) - new Date(a.filledDate)
        );
        setEnrollments(sorted);
      } catch (err) {
        console.error("Error fetching enrollments:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchEnrollments();
  }, []);

  const handleApprove = async (id) => {
    const enroll = enrollments.find((e) => e.id === id);
    const creds = credentials[id];

    if (!creds?.username || !creds?.password) {
      alert("Please enter username and password before approving.");
      return;
    }

    try {
      // 1️⃣ Mark as approved
      const updatedEnroll = {
        ...enroll,
        isApproved: true,
        username: creds.username,
        password: creds.password,
      };
      await axios.put(`${API_URL}/enrollments/${id}`, updatedEnroll);

      // 2️⃣ Add user to users API
      await axios.post(`${API_URL}/users`, {
        name: enroll.name,
        email: enroll.email,
        username: creds.username,
        password: creds.password,
        role: "user",
      });

      // 3️⃣ Add to enrolledcourses API
      await axios.post(`${API_URL}/enrolledcourses`, {
        email: enroll.email,
        courseName: enroll.courseName,
        enrolledDate: enroll.filledDate,
        courseImg: enroll.img || "https://via.placeholder.com/150",
      });

      // 4️⃣ Update UI
      setEnrollments((prev) =>
        prev.map((e) => (e.id === id ? updatedEnroll : e))
      );
      setCredentials((prev) => ({ ...prev, [id]: {} }));
      alert(`✅ ${enroll.name} approved and added to enrolled courses!`);
    } catch (err) {
      console.error("Error approving enrollment:", err);
      alert("Failed to approve enrollment.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this enrollment?")) return;
    setDeleting(id);
    try {
      await axios.delete(`${API_URL}/enrollments/${id}`);
      setEnrollments((prev) => prev.filter((e) => e.id !== id));
    } catch (err) {
      console.error("Error deleting:", err);
    } finally {
      setDeleting(null);
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
              <th className="p-3 border-b">Course</th>
              <th className="p-3 border-b">Date</th>
              <th className="p-3 border-b">Status</th>
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
                  <td className="p-3 border-b">{enroll.name}</td>
                  <td className="p-3 border-b">{enroll.email}</td>
                  <td className="p-3 border-b">{enroll.courseName}</td>
                  <td className="p-3 border-b">{enroll.filledDate}</td>
                  <td className="p-3 border-b">
                    {enroll.isApproved ? (
                      <span className="text-green-600 font-semibold">✅ Approved</span>
                    ) : (
                      <span className="text-red-500 font-medium">Pending</span>
                    )}
                  </td>
                  <td className="p-3 border-b text-center">
                    {enroll.isApproved ? (
                      <button
                        onClick={() => handleDelete(enroll.id)}
                        disabled={deleting === enroll.id}
                        className={`px-3 py-1 rounded text-white flex items-center gap-1 justify-center ${
                          deleting === enroll.id
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-red-600 hover:bg-red-700 transition"
                        }`}
                      >
                        <FaTrashAlt /> {deleting === enroll.id ? "..." : "Delete"}
                      </button>
                    ) : (
                      <div className="flex flex-col sm:flex-row gap-2 items-center justify-center">
                        <input
                          type="text"
                          placeholder="Username"
                          value={credentials[enroll.id]?.username || ""}
                          onChange={(e) =>
                            setCredentials((prev) => ({
                              ...prev,
                              [enroll.id]: {
                                ...prev[enroll.id],
                                username: e.target.value,
                              },
                            }))
                          }
                          className="border rounded px-2 py-1 w-28 text-sm"
                        />
                        <input
                          type="text"
                          placeholder="Password"
                          value={credentials[enroll.id]?.password || ""}
                          onChange={(e) =>
                            setCredentials((prev) => ({
                              ...prev,
                              [enroll.id]: {
                                ...prev[enroll.id],
                                password: e.target.value,
                              },
                            }))
                          }
                          className="border rounded px-2 py-1 w-28 text-sm"
                        />
                        <button
                          onClick={() => handleApprove(enroll.id)}
                          className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 flex items-center gap-1"
                        >
                          <FaCheck /> Approve
                        </button>
                      </div>
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
