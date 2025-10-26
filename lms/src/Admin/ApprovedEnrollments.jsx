import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  FaUserCircle,
  FaBookOpen,
  FaIdBadge,
  FaCalendarAlt,
  FaUsers,
  FaChevronRight,
  FaArrowLeft,
  FaSearch,
  FaChalkboardTeacher,
} from "react-icons/fa";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash, faTimes } from "@fortawesome/free-solid-svg-icons";

export default function ApprovedEnrollments() {
  const API_URL = import.meta.env.VITE_API_URL;
  const [approved, setApproved] = useState([]);
  const [courses, setCourses] = useState([]);
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedBatch, setSelectedBatch] = useState(null);

  // CRUD state
  const [editing, setEditing] = useState(null);
  const [editForm, setEditForm] = useState({ name: "", email: "" });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      const [enrolledRes, coursesRes, batchesRes] = await Promise.all([
        axios.get(`${API_URL}/enrolledcourses`),
        axios.get(`${API_URL}/courses`),
        axios.get(`${API_URL}/batches`),
      ]);
      setApproved(enrolledRes.data);
      setCourses(coursesRes.data);
      setBatches(batchesRes.data);
      setLoading(false);
    };
    fetchAll();
  }, [API_URL]);

  function getSortableDate(item) {
    if (!item.enrolledDate) return 0;
    const parsed = Date.parse(item.enrolledDate);
    if (!isNaN(parsed)) return parsed;
    const d = item.enrolledDate.split("/");
    if (d.length === 3) return Date.parse(`${d[2]}-${d[1]}-${d[0]}`);
    return 0;
  }

  // Course search & navigation
  let courseList = courses
    .map((c) => ({
      ...c,
      enrollments: approved.filter((a) => a.courseName === c.title)
    }))
    .filter((c) => c.enrollments.length > 0)
    .map((c) => ({
      ...c,
      enrollments: [...c.enrollments].sort(
        (a, b) => getSortableDate(b) - getSortableDate(a)
      ),
    }));

  if (search.trim()) {
    const S = search.trim().toLowerCase();
    courseList = courseList
      .map((course) => ({
        ...course,
        enrollments: course.enrollments.filter(
          (enr) =>
            (enr.name && enr.name.toLowerCase().includes(S)) ||
            (enr.courseName && enr.courseName.toLowerCase().includes(S)) ||
            (enr.email && enr.email.toLowerCase().includes(S))
        ),
      }))
      .filter((c) => c.enrollments.length > 0);
  }

  // Drill-down: batches for a course
  const courseBatches =
    selectedCourse &&
    batches.filter(
      (b) =>
        b.courseId === selectedCourse.id ||
        (b.courseName && b.courseName === selectedCourse.title)
    );

  // Drill-down: user cards for a batch sorted by most recent
  const batchEnrollments =
    selectedBatch && selectedCourse
      ? approved
          .filter(
            (e) =>
              e.batchId === selectedBatch.id &&
              e.courseName === selectedCourse.title
          )
          .sort((a, b) => getSortableDate(b) - getSortableDate(a))
      : [];

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-40">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mb-3"></div>
        <span className="text-blue-700 text-lg font-semibold">Loading...</span>
      </div>
    );
  }

  // Batch user CRUD cards
  if (selectedBatch && selectedCourse) {
    return (
      <div className="max-w-6xl mx-auto p-5 min-h-screen">
        <button
          onClick={() => setSelectedBatch(null)}
          className="mb-6 inline-flex items-center text-blue-600 hover:text-blue-900 text-lg"
        >
          <FaArrowLeft className="mr-2" /> Back to Batches
        </button>
        <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
          <FaBookOpen className="text-xl" /> {selectedCourse.title}
        </h2>
        <div className="mb-6 flex items-center gap-4">
          <span className="bg-green-100 text-green-800 font-semibold rounded-full px-4 py-2 text-md">
            Batch: {selectedBatch.name || selectedBatch.batchNumber}
          </span>
          <span className="bg-blue-100 text-blue-800 font-semibold rounded-full px-4 py-2 text-md flex items-center gap-2">
            <FaUsers />
            {batchEnrollments.length} Enrolled{" "}
          </span>
        </div>
        {batchEnrollments.length === 0 ? (
          <div className="p-12 bg-white shadow rounded-lg flex flex-col align-center items-center">
            <FaIdBadge className="text-5xl text-blue-200 mb-2" />
            <div className="text-lg text-gray-700">No enrollments in this batch.</div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {batchEnrollments.map((e) => (
              <div
                key={e.id}
                className="bg-white shadow rounded-xl p-5 border border-blue-100 hover:shadow-xl transition-all relative"
              >
                <div className="flex items-center gap-4 mb-3">
                  <FaUserCircle className="text-4xl text-blue-900" />
                  <div>
                    <div className="font-semibold text-blue-900 leading-tight">{e.name || <span className="italic text-gray-500">No Name</span>}</div>
                    <div className="text-xs text-blue-600">{e.email}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-green-800 mb-1">
                  <FaIdBadge />
                  <span>Batch: {selectedBatch.name || selectedBatch.batchNumber}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700 mb-1">
                  <FaCalendarAlt />
                  <span>
                    {e.enrolledDate
                      ? new Date(getSortableDate(e)).toLocaleDateString()
                      : "Invalid Date"}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-blue-700 text-xs">
                  <FaBookOpen />
                  <span>{e.courseName}</span>
                </div>
                {/* CRUD icons */}
                <div className="absolute top-3 right-3 flex gap-2">
                  <button
                    title="Edit"
                    className="text-blue-500 hover:text-blue-700 p-1 rounded"
                    onClick={() => {
                      setEditing(e);
                      setEditForm({ name: e.name, email: e.email });
                    }}
                  >
                    <FontAwesomeIcon icon={faEdit} />
                  </button>
                  <button
                    title="Delete"
                    className="text-red-500 hover:text-red-700 p-1 rounded"
                    onClick={async () => {
                      if (window.confirm("Delete this enrollment?")) {
                        await axios.delete(`${API_URL}/enrolledcourses/${e.id}`);
                        setApproved((prev) => prev.filter((a) => a.id !== e.id));
                      }
                    }}
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
        {/* --- EDIT MODAL --- */}
        {editing && (
          <div className="fixed z-50 inset-0 bg-black bg-opacity-40 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl relative">
              <button
                className="absolute right-4 top-4 text-lg text-gray-400 hover:text-gray-700"
                onClick={() => setEditing(null)}
              >
                <FontAwesomeIcon icon={faTimes} />
              </button>
              <h3 className="font-bold text-lg text-blue-900 mb-4">Edit Enrollment</h3>
              <form
                onSubmit={async (ev) => {
                  ev.preventDefault();
                  setSaving(true);
                  await axios.put(`${API_URL}/enrolledcourses/${editing.id}`, {
                    ...editing,
                    name: editForm.name,
                    email: editForm.email,
                  });
                  setApproved((prev) =>
                    prev.map((a) =>
                      a.id === editing.id
                        ? { ...a, name: editForm.name, email: editForm.email }
                        : a
                    )
                  );
                  setEditing(null);
                  setSaving(false);
                }}
                className="flex flex-col gap-3"
              >
                <label className="text-sm font-medium text-gray-700">
                  Name
                  <input
                    type="text"
                    value={editForm.name}
                    onChange={(e) =>
                      setEditForm((f) => ({ ...f, name: e.target.value }))
                    }
                    className="w-full mt-1 border px-3 py-2 rounded focus:ring focus:ring-blue-200"
                    required
                  />
                </label>
                <label className="text-sm font-medium text-gray-700">
                  Email
                  <input
                    type="email"
                    value={editForm.email}
                    onChange={(e) =>
                      setEditForm((f) => ({ ...f, email: e.target.value }))
                    }
                    className="w-full mt-1 border px-3 py-2 rounded focus:ring focus:ring-blue-200"
                    required
                  />
                </label>
                <div className="flex gap-2 pt-2">
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 font-medium"
                    disabled={saving}
                  >
                    {saving ? "Saving..." : "Save"}
                  </button>
                  <button
                    type="button"
                    disabled={saving}
                    className="flex-1 px-4 py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300 font-medium"
                    onClick={() => setEditing(null)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Drilldown for batches (same as before)
  if (selectedCourse) {
    const sortedBatches =
      courseBatches &&
      [...courseBatches].sort((a, b) => {
        const aMax = Math.max(
          ...approved
            .filter(
              (e) =>
                e.batchId === a.id && e.courseName === selectedCourse.title
            )
            .map(getSortableDate)
        );
        const bMax = Math.max(
          ...approved
            .filter(
              (e) =>
                e.batchId === b.id && e.courseName === selectedCourse.title
            )
            .map(getSortableDate)
        );
        return (bMax || 0) - (aMax || 0);
      });
    return (
      <div className="max-w-6xl mx-auto p-5 min-h-screen">
        <button
          onClick={() => setSelectedCourse(null)}
          className="mb-6 inline-flex items-center text-blue-600 hover:text-blue-900 text-lg"
        >
          <FaArrowLeft className="mr-2" /> Back to Courses
        </button>
        <h2 className="text-3xl font-bold mb-8 flex items-center gap-2">
          <FaBookOpen className="text-2xl" /> {selectedCourse.title}
        </h2>
        <p className="text-lg text-gray-600 mb-3">
          Click on a batch to view enrolled users in that batch.
        </p>
        {sortedBatches.length === 0 ? (
          <div className="p-12 bg-white shadow rounded-lg flex flex-col align-center items-center">
            <FaIdBadge className="text-5xl text-blue-200 mb-2" />
            <div className="text-lg text-gray-700">No batches for this course yet.</div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {sortedBatches.map((batch) => {
              const enrolledCount = approved.filter(
                (e) =>
                  e.batchId === batch.id &&
                  e.courseName === selectedCourse.title
              ).length;
              return (
                <div
                  key={batch.id}
                  className="bg-gradient-to-tr from-blue-50 via-green-50 to-blue-100 shadow-lg rounded-2xl border border-blue-200 p-6 cursor-pointer hover:shadow-2xl transition-all"
                  onClick={() => setSelectedBatch(batch)}
                >
                  <h3 className="font-bold text-blue-900 mb-2 text-lg">
                    {batch.name || `Batch ${batch.batchNumber}`}
                  </h3>
                  <div className="flex items-center gap-2 text-green-700 mb-1">
                    <FaIdBadge />
                    <span>Batch No: {batch.batchNumber}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-700 mb-1">
                    <FaCalendarAlt />
                    <span>
                      {batch.startDate} - {batch.endDate}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-blue-700 font-bold mt-4">
                    <FaUsers />
                    <span>{enrolledCount} Enrolled</span>
                    <FaChevronRight className="ml-auto" />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  // Main grid: courses sorted, global search
  courseList = courseList.sort(
    (a, b) =>
      getSortableDate(b.enrollments[0]) - getSortableDate(a.enrollments[0])
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-100 to-green-50 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-blue-900 mb-8">
          Approved & Allocated Enrollments
        </h1>
        <div className="mb-8 flex items-center gap-4">
          <div className="relative w-full md:w-2/3">
            <input
              type="text"
              className="pl-12 pr-5 py-3 rounded-xl w-full border border-blue-200 focus:border-blue-500 focus:outline-none text-lg shadow-sm"
              placeholder="Search by name, course, or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-lg text-blue-400" />
          </div>
        </div>
        {courseList.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 flex flex-col items-center">
            <FaBookOpen className="text-6xl text-gray-300 mb-2" />
            <div className="text-lg text-gray-700">
              No enrollments match your search.
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
            {courseList.map((c) => (
              <div
                key={c.id}
                className="relative bg-white rounded-2xl shadow-lg p-6 border border-blue-100 hover:shadow-2xl cursor-pointer group transition-all"
                onClick={() => {
                  setSelectedCourse(c);
                  setSelectedBatch(null);
                }}
              >
                <img
                  src={c.img || "https://via.placeholder.com/150"}
                  alt={c.title}
                  className="w-full h-32 object-cover rounded-xl mb-4"
                />
                <div className="font-bold text-xl text-blue-900 group-hover:underline mb-2 flex items-center gap-2">
                  {c.title}
                </div>
                <div className="text-gray-700 font-semibold mb-1 flex items-center gap-2">
                  <FaChalkboardTeacher />
                  {c.instructor}
                </div>
                <div className="text-green-800 font-medium mb-3">
                  {c.category}
                </div>
                <div className="flex items-center gap-2 text-blue-700 font-bold">
                  <FaUsers />
                  <span>{c.enrollments.length} Enrolled</span>
                  <FaChevronRight className="ml-auto" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
