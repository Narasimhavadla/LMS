import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function SkillManagement() {
  const API_URL = import.meta.env.VITE_API_URL;
  const [courses, setCourses] = useState([]);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("popular");
  const [page, setPage] = useState(1);
  const pageSize = 6;
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editCourse, setEditCourse] = useState({
    id: "",
    title: "",
    instructor: "",
    category: "",
    duration: "",
    level: "",
    description: "",
    img: "",
    students: 0,
    rating: 0,
  });

  // 🆕 Batch Modal State
  const [isBatchModalOpen, setIsBatchModalOpen] = useState(false);
  const [batchForm, setBatchForm] = useState({
    batchNumber: "",
    courseId: "",
    name: "",
    startDate: "",
    endDate: "",
    status: "active",
  });
  const [creatingBatch, setCreatingBatch] = useState(false);

  // ✅ Fetch all courses on mount
  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const res = await axios.get(`${API_URL}/courses`);
      setCourses(res.data);
    } catch (err) {
      console.error("Error fetching courses:", err);
      toast.error("Failed to fetch courses");
    }
  };

  // ✅ Add new course (POST)
  const handleAddCourse = async () => {
    if (!editCourse.title.trim()) {
      toast.error("Course title is required");
      return;
    }
    try {
      const res = await axios.post(`${API_URL}/courses`, editCourse);
      setCourses([...courses, res.data]);
      resetForm();
      toast.success("Course added successfully!");
    } catch (err) {
      console.error("Error adding course:", err);
      toast.error("Failed to add course");
    }
  };

  // ✅ Update existing course (PUT)
  const handleUpdateCourse = async () => {
    try {
      const res = await axios.put(`${API_URL}/courses/${editCourse.id}`, editCourse);
      setCourses(courses.map((c) => (c.id === editCourse.id ? res.data : c)));
      resetForm();
      toast.success("Course updated successfully!");
    } catch (err) {
      console.error("Error updating course:", err);
      toast.error("Failed to update course");
    }
  };

  // ✅ Delete course (DELETE)
  const handleDeleteCourse = async (id) => {
    if (!window.confirm("Are you sure you want to delete this course?")) return;
    try {
      await axios.delete(`${API_URL}/courses/${id}`);
      setCourses(courses.filter((c) => c.id !== id));
      toast.success("Course deleted successfully!");
    } catch (err) {
      console.error("Error deleting course:", err);
      toast.error("Failed to delete course");
    }
  };

  const handleEditClick = (c) => {
    setIsEditing(true);
    setEditCourse(c);
  };

  const resetForm = () => {
    setIsEditing(false);
    setEditCourse({
      id: "",
      title: "",
      instructor: "",
      category: "",
      duration: "",
      level: "",
      description: "",
      img: "",
      students: 0,
      rating: 0,
    });
  };

  // 🆕 Batch Modal Functions
  const openBatchModal = () => {
    setIsBatchModalOpen(true);
    setBatchForm({
      batchNumber: "",
      courseId: "",
      name: "",
      startDate: "",
      endDate: "",
      status: "active",
    });
  };

  const closeBatchModal = () => {
    setIsBatchModalOpen(false);
    setBatchForm({
      batchNumber: "",
      courseId: "",
      name: "",
      startDate: "",
      endDate: "",
      status: "active",
    });
  };

  const handleBatchInputChange = (e) => {
    const { name, value } = e.target;
    setBatchForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // 🆕 Create Batch with courseName fix
  const handleCreateBatch = async (e) => {
    e.preventDefault();

    if (!batchForm.batchNumber.trim()) {
      toast.error("Batch number is required");
      return;
    }

    if (!batchForm.courseId) {
      toast.error("Please select a course");
      return;
    }

    setCreatingBatch(true);

    try {
      // 🔥 Find the selected course and get its title
      const selectedCourse = courses.find(course => course.id === batchForm.courseId);
      
      if (!selectedCourse) {
        toast.error("Selected course not found");
        setCreatingBatch(false);
        return;
      }

      const response = await axios.post(`${API_URL}/batches`, {
        batchNumber: batchForm.batchNumber,
        courseId: batchForm.courseId,
        courseName: selectedCourse.title, // 🔥 Include course name from selected course
        name: batchForm.name,
        startDate: batchForm.startDate,
        endDate: batchForm.endDate,
        status: batchForm.status,
      });

      toast.success("Batch created successfully! 🎉");
      closeBatchModal();
    } catch (err) {
      console.error("Error creating batch:", err);
      toast.error(err.response?.data?.message || "Failed to create batch");
    } finally {
      setCreatingBatch(false);
    }
  };

  // Filters + Sorting
  const categories = useMemo(() => {
    const set = new Set(courses.map((c) => c.category));
    return ["All", ...Array.from(set)];
  }, [courses]);

  const filtered = useMemo(() => {
    let out = courses.filter((c) => {
      const matchesQuery =
        query === "" ||
        c.title.toLowerCase().includes(query.toLowerCase()) ||
        c.instructor.toLowerCase().includes(query.toLowerCase());
      const matchesCategory = category === "All" || c.category === category;
      return matchesQuery && matchesCategory;
    });

    if (sort === "popular") out = out.sort((a, b) => b.students - a.students);
    if (sort === "rating") out = out.sort((a, b) => b.rating - a.rating);
    return out;
  }, [courses, query, category, sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paged = filtered.slice((page - 1) * pageSize, page * pageSize);

  const clearFilters = () => {
    setQuery("");
    setCategory("All");
    setSort("popular");
    setPage(1);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Skill Management</h1>
        <p className="text-gray-600 mt-2">Manage courses and batches</p>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setIsEditing(true)}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-md"
        >
          + Add New Course
        </button>
        
        {/* 🆕 Add Batch Button */}
        <button
          onClick={openBatchModal}
          className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium shadow-md"
        >
          + Add Batch
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <input
            type="text"
            placeholder="Search courses..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="popular">Most Popular</option>
            <option value="rating">Highest Rated</option>
          </select>
          <button
            onClick={clearFilters}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* Course Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {paged.map((c) => (
          <div key={c.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow">
            <img src={c.img} alt={c.title} className="w-full h-48 object-cover" />
            <div className="p-5">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{c.title}</h3>
              <p className="text-sm text-gray-600 mb-3">
                {c.instructor} • {c.category}
              </p>
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-gray-500">{c.duration}</span>
                <span className="text-sm font-semibold text-yellow-600">⭐ {c.rating}</span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setSelectedCourse(c)}
                  className="flex-1 px-4 py-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
                >
                  View
                </button>
                <button
                  onClick={() => handleEditClick(c)}
                  className="flex-1 px-4 py-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteCourse(c.id)}
                  className="flex-1 px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center gap-2">
        <button
          onClick={() => setPage(Math.max(1, page - 1))}
          disabled={page === 1}
          className="px-4 py-2 bg-white border border-gray-300 rounded-lg disabled:opacity-50 hover:bg-gray-50"
        >
          Previous
        </button>
        <span className="px-4 py-2 bg-white border border-gray-300 rounded-lg">
          Page {page} of {totalPages}
        </span>
        <button
          onClick={() => setPage(Math.min(totalPages, page + 1))}
          disabled={page === totalPages}
          className="px-4 py-2 bg-white border border-gray-300 rounded-lg disabled:opacity-50 hover:bg-gray-50"
        >
          Next
        </button>
      </div>

      {/* Course Edit/Add Modal */}
      {isEditing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4">
              {editCourse.id ? "Edit Course" : "Add New Course"}
            </h2>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Course Title"
                value={editCourse.title}
                onChange={(e) => setEditCourse({ ...editCourse, title: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                placeholder="Instructor"
                value={editCourse.instructor}
                onChange={(e) => setEditCourse({ ...editCourse, instructor: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                placeholder="Category"
                value={editCourse.category}
                onChange={(e) => setEditCourse({ ...editCourse, category: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                placeholder="Duration"
                value={editCourse.duration}
                onChange={(e) => setEditCourse({ ...editCourse, duration: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                placeholder="Level"
                value={editCourse.level}
                onChange={(e) => setEditCourse({ ...editCourse, level: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              <textarea
                placeholder="Description"
                value={editCourse.description}
                onChange={(e) => setEditCourse({ ...editCourse, description: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                rows={3}
              />
              <input
                type="text"
                placeholder="Image URL"
                value={editCourse.img}
                onChange={(e) => setEditCourse({ ...editCourse, img: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              <div className="flex gap-4 pt-4">
                <button
                  onClick={editCourse.id ? handleUpdateCourse : handleAddCourse}
                  className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  {editCourse.id ? "Update Course" : "Add Course"}
                </button>
                <button
                  onClick={resetForm}
                  className="flex-1 px-6 py-3 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors font-medium"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 🆕 Batch Creation Modal */}
      {isBatchModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-2xl font-bold mb-6 text-gray-900">Create New Batch</h2>
            <form onSubmit={handleCreateBatch} className="space-y-4">
              {/* Batch Number */}
              <div>
                <label htmlFor="batchNumber" className="block text-sm font-medium text-gray-700 mb-2">
                  Batch Number *
                </label>
                <input
                  type="text"
                  id="batchNumber"
                  name="batchNumber"
                  value={batchForm.batchNumber}
                  onChange={handleBatchInputChange}
                  placeholder="e.g., 1, 2, 3"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              {/* Course Dropdown */}
              <div>
                <label htmlFor="courseId" className="block text-sm font-medium text-gray-700 mb-2">
                  Select Course *
                </label>
                <select
                  id="courseId"
                  name="courseId"
                  value={batchForm.courseId}
                  onChange={handleBatchInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="">-- Select a course --</option>
                  {courses.map((course) => (
                    <option key={course.id} value={course.id}>
                      {course.title}
                    </option>
                  ))}
                </select>
              </div>

              {/* Batch Name */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Batch Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={batchForm.name}
                  onChange={handleBatchInputChange}
                  placeholder="e.g., Morning Batch, Evening Batch"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              {/* Start Date */}
              <div>
                <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-2">
                  Start Date
                </label>
                <input
                  type="date"
                  id="startDate"
                  name="startDate"
                  value={batchForm.startDate}
                  onChange={handleBatchInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              {/* End Date */}
              <div>
                <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-2">
                  End Date
                </label>
                <input
                  type="date"
                  id="endDate"
                  name="endDate"
                  value={batchForm.endDate}
                  onChange={handleBatchInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              {/* Status */}
              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  id="status"
                  name="status"
                  value={batchForm.status}
                  onChange={handleBatchInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="completed">Completed</option>
                </select>
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  disabled={creatingBatch}
                  className={`flex-1 px-6 py-3 rounded-lg font-medium text-white transition-colors ${
                    creatingBatch
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-green-600 hover:bg-green-700"
                  }`}
                >
                  {creatingBatch ? "Creating..." : "Create Batch"}
                </button>
                <button
                  type="button"
                  onClick={closeBatchModal}
                  disabled={creatingBatch}
                  className="flex-1 px-6 py-3 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors font-medium disabled:opacity-50"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Course Detail Modal */}
      {selectedCourse && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4">{selectedCourse.title}</h2>
            <img
              src={selectedCourse.img}
              alt={selectedCourse.title}
              className="w-full h-64 object-cover rounded-lg mb-4"
            />
            <div className="space-y-3">
              <p>
                <strong>Instructor:</strong> {selectedCourse.instructor}
              </p>
              <p>
                <strong>Category:</strong> {selectedCourse.category}
              </p>
              <p>
                <strong>Duration:</strong> {selectedCourse.duration}
              </p>
              <p>
                <strong>Level:</strong> {selectedCourse.level}
              </p>
              <p>
                <strong>Students:</strong> {selectedCourse.students}
              </p>
              <p>
                <strong>Rating:</strong> {selectedCourse.rating} ⭐
              </p>
              <p>
                <strong>Description:</strong> {selectedCourse.description}
              </p>
            </div>
            <button
              onClick={() => setSelectedCourse(null)}
              className="mt-6 w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
