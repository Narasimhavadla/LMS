import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaRegCheckCircle, FaArrowLeft, FaLink } from "react-icons/fa";

export default function Assignment({ batchId, userId }) {
  const API_URL = import.meta.env.VITE_API_URL;
  const [assignments, setAssignments] = useState([]);
  const [selected, setSelected] = useState(null);
  const [fileUrl, setFileUrl] = useState("");
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Fetch assignments for this batch
  useEffect(() => {
    if (!batchId) return;
    axios.get(`${API_URL}/assignments?batchId=${batchId}`)
      .then(res => setAssignments(res.data || []));
  }, [API_URL, batchId]);

  // Check if user submitted for this assignment
  useEffect(() => {
    if (!selected) return;
    axios
      .get(`${API_URL}/submissions?assignmentId=${selected.id}&userId=${userId}`)
      .then(res => setHasSubmitted((res.data || []).length > 0));
  }, [selected, userId, API_URL]);

  const handleSubmit = async e => {
    e.preventDefault();
    setSubmitting(true);
    await axios.post(`${API_URL}/submissions`, {
      userId,
      assignmentId: selected.id,
      batchId,
      fileUrl,
      submittedDate: new Date().toISOString()
    });
    setHasSubmitted(true);
    setSubmitting(false);
    setSelected(null);
    setFileUrl("");
    alert("Assignment submitted!");
  };

  if (!assignments.length) {
    return <div className="text-gray-500 text-lg mt-10 text-center">No assignments for this batch.</div>;
  }

  if (selected) {
    return (
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg border mt-10 p-6 relative">
        <button
          className="flex items-center gap-2 mb-4 text-blue-600 hover:underline absolute left-4 top-4"
          onClick={() => setSelected(null)}>
          <FaArrowLeft /> Back
        </button>
        <h2 className="text-2xl font-bold mb-3">{selected.title}</h2>
        <p className="mb-2 text-gray-700">{selected.description}</p>
        <div className="mb-1 text-sm"><span className="font-medium">Due:</span> {selected.dueDate}</div>
        {hasSubmitted ? (
          <div className="text-green-600 flex items-center gap-2 mt-4"><FaRegCheckCircle /> You have already submitted!</div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-5">
            <label className="block mb-2 font-semibold" htmlFor="gdrive">
              <FaLink className="inline mr-2" />Upload Google Drive link
            </label>
            <input
              type="url"
              id="gdrive"
              value={fileUrl}
              onChange={e => setFileUrl(e.target.value)}
              className="border rounded w-full px-4 py-2 mb-3 focus:ring-2 focus:ring-blue-200"
              placeholder="https://drive.google.com/..."
              required
            />
            <button
              type="submit"
              disabled={submitting || !fileUrl}
              className="bg-blue-700 text-white px-6 py-2 mt-2 rounded font-bold hover:bg-blue-900 transition"
            >
              {submitting ? "Submitting..." : "Submit Assignment"}
            </button>
          </form>
        )}
      </div>
    );
  }

  return (
    <div className="grid sm:grid-cols-2 gap-6 px-2 max-w-4xl mx-auto mt-10">
      {assignments.map(a => (
        <div
          key={a.id}
          className="bg-white rounded-xl shadow-lg p-5 border hover:border-blue-600 cursor-pointer group transition"
          onClick={() => setSelected(a)}
        >
          <div className="text-xl font-bold text-blue-900 group-hover:underline">{a.title}</div>
          <div className="text-gray-700 mt-1 line-clamp-2">{a.description}</div>
          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-gray-600 font-medium">
              Due: <span className="font-bold">{a.dueDate}</span>
            </div>
            <button className="bg-blue-100 text-blue-700 px-3 py-1 rounded group-hover:bg-blue-700 group-hover:text-white transition">
              View & Submit
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
