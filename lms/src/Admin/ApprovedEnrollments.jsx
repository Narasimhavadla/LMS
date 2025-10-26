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
} from "react-icons/fa";

export default function ApprovedEnrollments() {
  const API_URL = import.meta.env.VITE_API_URL;
  const [approved, setApproved] = useState([]);
  const [courses, setCourses] = useState([]);
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedBatch, setSelectedBatch] = useState(null);

  // Fetch all on mount
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

  // 1. Filtered courses with at least one enrollment
  let courseList = courses
    .map((c) => ({
      ...c,
      enrollments: approved.filter((a) => a.courseName === c.title),
    }))
    .filter((c) => c.enrollments.length > 0);

  // 2. Global smart search (course title, user name, or email)
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

  // 3. Batches for selected course
  const courseBatches =
    selectedCourse &&
    batches.filter((b) => {
      return (
        b.courseId === selectedCourse.id ||
        (b.courseName && b.courseName === selectedCourse.title)
      );
    });

  // 4. Enrollments for selected batch (within selected course)
  const batchEnrollments =
    selectedBatch && selectedCourse
      ? approved.filter(
          (e) =>
            e.batchId === selectedBatch.id &&
            e.courseName === selectedCourse.title
        )
      : [];

  // --- UI ---

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-40">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mb-3"></div>
        <span className="text-blue-700 text-lg font-semibold">Loading...</span>
      </div>
    );
  }

  // Batch user roster view
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
                key={e.id || e.email + e.courseName + e.batchId}
                className="bg-white shadow rounded-xl p-5 border border-blue-100 hover:shadow-xl transition-all"
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
                      ? new Date(e.enrolledDate).toLocaleDateString()
                      : "-"}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-blue-700 text-xs">
                  <FaBookOpen />
                  <span>{e.courseName}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // Batches view for one course
  if (selectedCourse) {
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
        {courseBatches.length === 0 ? (
          <div className="p-12 bg-white shadow rounded-lg flex flex-col align-center items-center">
            <FaIdBadge className="text-5xl text-blue-200 mb-2" />
            <div className="text-lg text-gray-700">No batches for this course yet.</div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {courseBatches.map((batch) => {
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

  // Main: Courses grid + search
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
                  {/* <FaChalkboardTeacher /> */}
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
