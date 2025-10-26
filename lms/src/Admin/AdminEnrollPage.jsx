import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaTrashAlt, FaCheck } from "react-icons/fa";

export default function AdminEnrollments() {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [credentials, setCredentials] = useState({});
  const [batchSelections, setBatchSelections] = useState({});
  const [courseBatches, setCourseBatches] = useState({});
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchEnrollments = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${API_URL}/enrollments`);
        setEnrollments(res.data);
      } finally {
        setLoading(false);
      }
    };
    fetchEnrollments();
  }, []);

  const fetchBatches = async (courseName, enrollId) => {
    const coursesRes = await axios.get(`${API_URL}/courses`);
    const course = coursesRes.data.find((c) => c.title === courseName);
    if (!course) return setCourseBatches((prev)=>({...prev, [enrollId]: []}));
    const batchesRes = await axios.get(`${API_URL}/batches`);
    const batches = batchesRes.data.filter((b) => b.courseId === course.id);
    setCourseBatches((prev) => ({ ...prev, [enrollId]: batches }));
  };

  const handleApprove = async (id) => {
    const enroll = enrollments.find((e) => e.id === id);
    const creds = credentials[id];
    const batchId = batchSelections[id];
    if (!creds?.username || !creds?.password || !batchId) {
      alert("Please enter username, password, and select batch.");
      return;
    }
    try {
      const updatedEnroll = { ...enroll, isApproved: true, username: creds.username, password: creds.password };
      await axios.put(`${API_URL}/enrollments/${id}`, updatedEnroll);

      await axios.post(`${API_URL}/users`, {
        name: enroll.name,
        email: enroll.email,
        username: creds.username,
        password: creds.password,
        role: "user",
      });

      await axios.post(`${API_URL}/enrolledcourses`, {
        name: enroll.name,
        email: enroll.email,
        courseName: enroll.courseName,
        enrolledDate: enroll.filledDate,
        courseImg: enroll.img || "https://via.placeholder.com/150",
        batchId,
      });

      await axios.delete(`${API_URL}/enrollments/${id}`);
      setEnrollments((prev) => prev.filter((e) => e.id !== id));
      alert(`${enroll.name} approved, allocated, and moved to active enrollments.`);
    } catch (err) {
      alert("Failed to approve enrollment.");
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/enrollments/${id}`);
      setEnrollments((prev) => prev.filter((e) => e.id !== id));
    } catch {
      alert("Failed to delete enrollment.");
    }
  };

  function getSortableDate(item) {
    if (!item.filledDate) return 0;
    const parsed = Date.parse(item.filledDate);
    if (!isNaN(parsed)) return parsed;
    const d = item.filledDate.split("/");
    if (d.length === 3) return Date.parse(`${d[2]}-${d[1]}-${d[0]}`);
    return 0;
  }
  const sortedEnrollments = [...enrollments].sort(
    (a, b) => getSortableDate(b) - getSortableDate(a)
  );

  if (loading) return (
    <div className="py-24 text-center text-xl text-blue-700 font-bold">
      Loading...
    </div>
  );

  return (
    <div className="p-8 max-w-6xl mx-auto min-h-screen">
      <h2 className="text-3xl font-bold mb-8 text-blue-700">Pending Enrollment Requests</h2>
      <div className="overflow-auto shadow-lg rounded-xl bg-white border border-blue-100">
        <table className="min-w-full text-sm text-blue-900">
          <thead className="sticky top-0 bg-blue-50 z-10">
            <tr>
              <th className="py-3 px-4 text-left">Name</th>
              <th className="py-3 px-4 text-left">Email</th>
              <th className="py-3 px-4 text-left">Course</th>
              <th className="py-3 px-4 text-left">Batch</th>
              <th className="py-3 px-4 text-left">Date</th>
              <th className="py-3 px-4 text-center">Approve</th>
              <th className="py-3 px-4 text-center">Delete</th>
            </tr>
          </thead>
          <tbody>
            {sortedEnrollments.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-12 text-center text-gray-400">
                  No pending enrollments.
                </td>
              </tr>
            ) : sortedEnrollments.map((enroll, idx) => (
              <tr key={enroll.id}
                  className={`hover:bg-blue-50 transition ${
                    idx % 2 === 0 ? "bg-gray-50" : "bg-white"
                  }`}>
                <td className="py-2 px-4 font-semibold">{enroll.name || <span className="italic text-gray-400">No Name</span>}</td>
                <td className="py-2 px-4">{enroll.email}</td>
                <td className="py-2 px-4">{enroll.courseName}</td>
                <td className="py-2 px-4">
                  <select
                    value={batchSelections[enroll.id] || ""}
                    onFocus={() => fetchBatches(enroll.courseName, enroll.id)}
                    onChange={e =>
                      setBatchSelections((prev) => ({ ...prev, [enroll.id]: e.target.value }))
                    }
                    className="border rounded px-2 py-1 text-sm focus:ring focus:ring-blue-200 min-w-[100px]"
                    required
                  >
                    <option value="">Choose</option>
                    {(courseBatches[enroll.id] || []).map((batch) => (
                      <option key={batch.id} value={batch.id}>
                        {batch.name || `Batch ${batch.batchNumber}`}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="py-2 px-4">
                  {enroll.filledDate
                    ? new Date(getSortableDate(enroll)).toLocaleDateString()
                    : <span className="italic text-gray-400">No Date</span>
                  }
                </td>
                <td className="py-2 px-4 text-center">
                  <div className="flex flex-col gap-1 items-center">
                    <input
                      type="text"
                      placeholder="Username"
                      value={credentials[enroll.id]?.username || ""}
                      onChange={e =>
                        setCredentials((prev) => ({
                          ...prev,
                          [enroll.id]: { ...prev[enroll.id], username: e.target.value },
                        }))
                      }
                      className="border rounded px-2 py-1 w-28 mb-1"
                    />
                    <input
                      type="text"
                      placeholder="Password"
                      value={credentials[enroll.id]?.password || ""}
                      onChange={e =>
                        setCredentials((prev) => ({
                          ...prev,
                          [enroll.id]: { ...prev[enroll.id], password: e.target.value },
                        }))
                      }
                      className="border rounded px-2 py-1 w-28 mb-2"
                    />
                    <button
                      onClick={() => handleApprove(enroll.id)}
                      className="flex items-center gap-2 px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded shadow transition"
                    >
                      <FaCheck /> Approve
                    </button>
                  </div>
                </td>
                <td className="py-2 px-4 text-center">
                  <button
                    onClick={() => handleDelete(enroll.id)}
                    className="flex items-center gap-2 px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded shadow transition"
                  >
                    <FaTrashAlt /> Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
