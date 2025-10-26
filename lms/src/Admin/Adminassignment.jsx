import React, { useEffect, useState } from "react";
import axios from "axios";

export default function AdminAssignments() {
  const API_URL = import.meta.env.VITE_API_URL;
  const [assignments, setAssignments] = useState([]);
  const [form, setForm] = useState({ title: "", description: "", dueDate: "", courseId: "", batchId: "" });
  const [editing, setEditing] = useState(null);
  const [batches, setBatches] = useState([]);
  const [courses, setCourses] = useState([]);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [submissions, setSubmissions] = useState([]);

  useEffect(() => {
    axios.get(`${API_URL}/assignments`).then(res => setAssignments(res.data));
    axios.get(`${API_URL}/courses`).then(res => setCourses(res.data));
    axios.get(`${API_URL}/batches`).then(res => setBatches(res.data));
  }, [API_URL]);

  // View submissions for selected assignment
  const handleViewSubmissions = assignment => {
    setSelectedAssignment(assignment);
    axios.get(`${API_URL}/submissions?assignmentId=${assignment.id}`)
      .then(res => setSubmissions(res.data));
  };

  const handleFormSubmit = async e => {
    e.preventDefault();
    if (editing) {
      await axios.put(`${API_URL}/assignments/${editing.id}`, {...editing, ...form});
      setAssignments(assignments.map(a =>
        a.id === editing.id ? {...a, ...form} : a
      ));
      setEditing(null);
    } else {
      const newAssignment = {...form, id: `a${Date.now()}`};
      await axios.post(`${API_URL}/assignments`, newAssignment);
      setAssignments([...assignments, newAssignment]);
    }
    setForm({ title: "", description: "", dueDate: "", courseId: "", batchId: "" });
  };

  const handleEdit = assignment => {
    setEditing(assignment);
    setForm({
      title: assignment.title,
      description: assignment.description,
      dueDate: assignment.dueDate,
      courseId: assignment.courseId,
      batchId: assignment.batchId,
    });
  };

  const handleDelete = async id => {
    await axios.delete(`${API_URL}/assignments/${id}`);
    setAssignments(assignments.filter(a => a.id !== id));
  };

  return (
    <div className="max-w-5xl mx-auto p-8">
      <h2 className="text-2xl font-bold mb-4">Assignments Management</h2>
      <form className="bg-blue-50 rounded px-6 pt-5 pb-6 mb-7" onSubmit={handleFormSubmit}>
        <div className="flex flex-col md:flex-row gap-3 mb-3">
          <input
            type="text"
            value={form.title}
            onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
            className="border rounded px-3 py-2 flex-1"
            placeholder="Assignment Title"
            required
          />
          <input
            type="date"
            value={form.dueDate}
            onChange={e => setForm(f => ({ ...f, dueDate: e.target.value }))}
            className="border rounded px-3 py-2"
            required
          />
        </div>
        <textarea
          className="border rounded px-3 py-2 w-full mb-2"
          value={form.description}
          onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
          placeholder="Assignment description"
        />
        <div className="flex gap-3 mb-3">
          <select
            value={form.courseId}
            onChange={e => setForm(f => ({ ...f, courseId: e.target.value }))}
            className="border rounded px-3 py-2"
            required>
            <option value="">Choose Course</option>
            {courses.map(c => (
              <option key={c.id} value={c.id}>{c.title}</option>
            ))}
          </select>
          <select
            value={form.batchId}
            onChange={e => setForm(f => ({ ...f, batchId: e.target.value }))}
            className="border rounded px-3 py-2"
            required>
            <option value="">Choose Batch</option>
            {batches.filter(b => !form.courseId || b.courseId === form.courseId).map(b => (
              <option key={b.id} value={b.id}>
                {b.name || `Batch ${b.batchNumber}`}
              </option>
            ))}
          </select>
        </div>
        <button type="submit" className="bg-blue-600 text-white px-5 py-2 rounded font-bold">
          {editing ? "Save Changes" : "Create Assignment"}
        </button>
        {editing && (
          <button type="button" onClick={() => setEditing(null)} className="ml-3 text-gray-500 underline">
            Cancel Edit
          </button>
        )}
      </form>

      <table className="min-w-full border mb-8 bg-white rounded shadow">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2">Title</th>
            <th className="p-2">Course</th>
            <th className="p-2">Batch</th>
            <th className="p-2">Batch Number</th>
            <th className="p-2">Due Date</th>
            <th className="p-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {assignments.map(a => {
            const batch = batches.find(b => b.id === a.batchId);
            return (
              <tr key={a.id}>
                <td className="p-2">{a.title}</td>
                <td className="p-2">{courses.find(c => c.id === a.courseId)?.title || "--"}</td>
                <td className="p-2">{batch?.name || "--"}</td>
                <td className="p-2">{batch?.batchNumber || "--"}</td>
                <td className="p-2">{a.dueDate}</td>
                <td className="p-2 flex gap-2">
                  <button onClick={() => handleEdit(a)} className="text-blue-600 underline">Edit</button>
                  <button onClick={() => handleDelete(a.id)} className="text-red-500 underline">Delete</button>
                  <button onClick={() => handleViewSubmissions(a)} className="text-green-700 underline">View Submissions</button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Submissions modal */}
      {selectedAssignment && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl relative">
            <button onClick={() => setSelectedAssignment(null)} className="absolute top-3 right-4 text-2xl text-gray-400 hover:text-gray-800">×</button>
            <h3 className="text-lg font-bold mb-2">
              Submissions for: {selectedAssignment.title}
            </h3>
            {submissions.length === 0 ? (
              <p className="text-gray-500">No submissions yet.</p>
            ) : (
              <table className="min-w-full text-sm">
                <thead>
                  <tr>
                    <th className="p-2">Name</th>
                    <th className="p-2">Answer</th>
                    <th className="p-2">Link</th>
                    <th className="p-2">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {submissions.map(s => (
                    <tr key={s.id}>
                      <td className="p-2">{s.userName}</td>
                      <td className="p-2">{s.answer || "-"}</td>
                      <td className="p-2">
                        {s.fileUrl ? <a className="underline text-blue-600" href={s.fileUrl} target="_blank" rel="noopener noreferrer">File</a> : "-"}
                      </td>
                      <td className="p-2">{s.submittedDate?.slice(0, 10)}</td>
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
