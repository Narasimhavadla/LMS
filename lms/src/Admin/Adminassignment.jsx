import React, { useEffect, useState } from "react";
import axios from "axios";
import { sendNotification } from "../Components/notificationsApi";
import { FaEdit, FaTrash, FaSave, FaPlus, FaEye, FaTimes } from "react-icons/fa";

export default function AdminAssignments() {
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
  const [assignments, setAssignments] = useState([]);
  const [form, setForm] = useState({ title: "", description: "", dueDate: "", courseId: "", batchId: "" });
  const [editing, setEditing] = useState(null);
  const [batches, setBatches] = useState([]);
  const [courses, setCourses] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);

  // Submission modal states
  const [showSubmissionsModal, setShowSubmissionsModal] = useState(false);
  const [submissions, setSubmissions] = useState([]);
  const [modalAssignment, setModalAssignment] = useState(null);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      axios.get(`${API_URL}/assignments`),
      axios.get(`${API_URL}/courses`),
      axios.get(`${API_URL}/batches`)
    ]).then(([aRes, cRes, bRes]) => {
      setAssignments(aRes.data || []);
      setCourses(cRes.data || []);
      setBatches(bRes.data || []);
      setLoading(false);
    });
  }, [API_URL]);

  const handleFormSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    let batchUsers = [];
    let batchName = "";
    let courseTitle = "";
    const batch = batches.find(b => b.id === form.batchId);
    batchUsers = batch ? batch.users || [] : [];
    batchName = batch ? batch.name : "";
    courseTitle = courses.find(c => c.id === form.courseId)?.title || "";
    if (editing) {
      await axios.put(`${API_URL}/assignments/${editing.id}`, { ...editing, ...form });
      setAssignments(assignments.map(a => a.id === editing.id ? { ...a, ...form } : a));
      setEditing(null);
    } else {
      const newAssignment = { ...form, id: `a${Date.now()}` };
      await axios.post(`${API_URL}/assignments`, newAssignment);
      setAssignments([...assignments, newAssignment]);
      // Notify batch users
      if (batchUsers.length) {
        await sendNotification({
          type: "assignment_created",
          to: batchUsers.map(u => u.username),
          message: `New assignment added for batch ${batchName} in ${courseTitle}`,
          batchId: form.batchId,
          courseName: courseTitle,
          createdAt: new Date().toISOString(),
          status: "unread",
          forRole: "user"
        });
      }
    }
    setForm({ title: "", description: "", dueDate: "", courseId: "", batchId: "" });
    setShowForm(false);
    setLoading(false);
  };

  const handleEdit = a => {
    setForm({ ...a });
    setEditing(a);
    setShowForm(true);
  };

  const handleDelete = async id => {
    if (!window.confirm("Are you sure you want to delete this assignment?")) return;
    setLoading(true);
    await axios.delete(`${API_URL}/assignments/${id}`);
    setAssignments(assignments.filter(a => a.id !== id));
    setLoading(false);
  };

  // View submissions: fetch and show in modal
  const handleViewSubmissions = async assignment => {
    setModalAssignment(assignment);
    setShowSubmissionsModal(true);
    // Fetch submissions for this assignment
    try {
      const res = await axios.get(`${API_URL}/submissions?assignmentId=${assignment.id}`);
      setSubmissions(res.data || []);
    } catch {
      setSubmissions([]);
    }
  };

  // Batches filtered by selected course
  const filteredBatches = form.courseId ? batches.filter(b => b.courseId === form.courseId) : [];

  return (
    <div className="p-7">
      <div className="bg-gray-100 border rounded-xl shadow p-6 mb-6 flex items-center justify-between">
        <div className="font-bold text-xl">Assignments Admin</div>
        <button
          className="flex items-center gap-2 bg-blue-700 text-white px-4 py-2 rounded hover:bg-blue-900 font-semibold transition"
          onClick={() => { setShowForm(true); setEditing(null); setForm({ title: "", description: "", dueDate: "", courseId: "", batchId: "" }); }}
        >
          <FaPlus /> Add Assignment
        </button>
      </div>
      {showForm && (
        <form onSubmit={handleFormSubmit} className="bg-white border rounded-xl shadow p-6 mb-8 animate-fadeIn">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 mb-4">
            <input
              className="border rounded px-4 py-2"
              type="text"
              placeholder="Title"
              value={form.title}
              onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
              required
            />
            <input
              className="border rounded px-4 py-2"
              type="text"
              placeholder="Description"
              value={form.description}
              onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              required
            />
            <input
              className="border rounded px-4 py-2"
              type="date"
              value={form.dueDate}
              onChange={e => setForm(f => ({ ...f, dueDate: e.target.value }))}
              required
            />
            <select
              className="border rounded px-4 py-2"
              value={form.courseId}
              onChange={e => setForm(f => ({ ...f, courseId: e.target.value, batchId: "" }))}
              required
            >
              <option value="">Select Course</option>
              {courses.map(c => (
                <option key={c.id} value={c.id}>{c.title}</option>
              ))}
            </select>
            <select
              className="border rounded px-4 py-2"
              value={form.batchId}
              onChange={e => setForm(f => ({ ...f, batchId: e.target.value }))}
              required
              disabled={!form.courseId}
            >
              <option value="">Select Batch</option>
              {filteredBatches.map(b => (
                <option key={b.id} value={b.id}>{b.name}</option>
              ))}
            </select>
          </div>
          <div className="flex gap-3 mt-4">
            <button
              type="submit"
              className="bg-blue-700 text-white px-4 py-2 rounded font-bold hover:bg-blue-900 flex items-center gap-2"
              disabled={loading}
            >
              <FaSave /> {editing ? "Save Changes" : "Add Assignment"}
            </button>
            <button
              type="button"
              className="bg-gray-200 text-gray-800 px-4 py-2 rounded font-bold hover:bg-gray-400"
              onClick={() => { setShowForm(false); setEditing(null); }}
            >
              Cancel
            </button>
          </div>
        </form>
      )}
      <div className="bg-white border rounded-xl shadow p-6">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-blue-50">
              <th className="py-3 px-4 font-medium text-gray-700">Title</th>
              <th className="py-3 px-4 font-medium text-gray-700">Description</th>
              <th className="py-3 px-4 font-medium text-gray-700">Due Date</th>
              <th className="py-3 px-4 font-medium text-gray-700">Course</th>
              <th className="py-3 px-4 font-medium text-gray-700">Batch</th>
              <th className="py-3 px-4 font-medium text-gray-700">Submissions</th>
              <th className="py-3 px-4"></th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={7} className="py-8 text-center text-gray-400">Loading assignments...</td>
              </tr>
            )}
            {!loading && assignments.length === 0 && (
              <tr>
                <td colSpan={7} className="py-8 text-center text-gray-400">No assignments found.</td>
              </tr>
            )}
            {assignments.map(a => (
              <tr key={a.id} className="border-t hover:bg-blue-50 transition">
                <td className="py-2 px-4">{a.title}</td>
                <td className="py-2 px-4">{a.description}</td>
                <td className="py-2 px-2 ">{a.dueDate}</td>
                <td className="py-2 px-4">
                  {courses.find(c => c.id === a.courseId)?.title || "-"}
                </td>
                <td className="py-2 px-4">
                  {batches.find(b => b.id === a.batchId)?.name || "-"}
                </td>
                <td className="py-2 px-4 text-center">
                  <button
                    className="text-green-700 hover:text-green-800 px-2 py-1 rounded flex items-center gap-1 border border-green-100 bg-green-50 hover:bg-green-200 transition"
                    onClick={() => handleViewSubmissions(a)}
                  >
                    <FaEye /> View
                  </button>
                </td>
                <td className="py-2 px-4 text-right min-w-[110px]">
                  <button className="text-blue-700 hover:text-blue-900 mr-3" onClick={() => handleEdit(a)}>
                    <FaEdit />
                  </button>
                  <button className="text-red-600 hover:text-red-800" onClick={() => handleDelete(a.id)}>
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Modal for submissions */}
      {showSubmissionsModal && (
        <div className="fixed z-50 left-0 top-0 w-full h-full flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-xl shadow-2xl p-7 relative w-full max-w-2xl">
            <button
              className="absolute right-5 top-5 text-gray-400 hover:text-gray-700 text-2xl"
              onClick={() => setShowSubmissionsModal(false)}
              title="Close"
            >
              <FaTimes />
            </button>
            <h3 className="text-2xl font-bold mb-5">
              Submissions for: <span className="text-blue-700">{modalAssignment?.title}</span>
            </h3>
            {submissions.length === 0 ? (
              <div className="text-gray-500 py-12 text-center">No submissions yet.</div>
            ) : (
              <table className="w-full text-left border">
                <thead>
                  <tr className="bg-blue-50">
                    <th className="py-3 px-4 font-medium text-gray-700">User</th>
                    <th className="py-3 px-4 font-medium text-gray-700">File URL</th>
                    <th className="py-3 px-4 font-medium text-gray-700">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {submissions.map((s, idx) => (
                    <tr key={idx} className="border-t">
                      <td className="py-2 px-4">{s.userId || s.username || "-"}</td>
                      <td className="py-2 px-4 break-words">
                        <a
                          className="text-blue-700 underline hover:text-blue-900"
                          href={s.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {s.fileUrl ? "File Link" : "-"}
                        </a>
                      </td>
                      <td className="py-2 px-4">{s.submittedDate?.slice(0, 10) || "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
