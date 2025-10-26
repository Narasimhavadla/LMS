import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function VideoUploadManager() {
  const API_URL = import.meta.env.VITE_API_URL;

  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [batches, setBatches] = useState([]);
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [loadingCourses, setLoadingCourses] = useState(true);
  const [loadingBatches, setLoadingBatches] = useState(false);

  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [videoForm, setVideoForm] = useState({
    title: "",
    videoUrl: "",
    description: "",
    duration: "",
  });
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [videosInBatch, setVideosInBatch] = useState([]);

  useEffect(() => {
    fetchCourses();
  }, []);

  // Fetch courses
  const fetchCourses = async () => {
    try {
      setLoadingCourses(true);
      const response = await axios.get(`${API_URL}/courses`);
      setCourses(response.data);
    } catch (err) {
      toast.error("Failed to load courses");
    } finally {
      setLoadingCourses(false);
    }
  };

  // Fetch batches for selected course
  const fetchBatches = async (courseId) => {
    try {
      setLoadingBatches(true);
      const response = await axios.get(`${API_URL}/batches`);
      const filteredBatches = response.data.filter(
        (batch) => batch.courseId === courseId
      );
      setBatches(filteredBatches);
      if (filteredBatches.length === 0) toast.info("No batches found for this course");
    } catch (err) {
      toast.error("Failed to load batches");
      setBatches([]);
    } finally {
      setLoadingBatches(false);
    }
  };

  // Handle course select
  const handleCourseClick = (course) => {
    setSelectedCourse(course);
    setSelectedBatch(null);
    fetchBatches(course.id);
  };

  // Handle batch select
  const handleBatchClick = async (batch) => {
    setSelectedBatch(batch);
    await openUploadModal(batch);
  };

  // Back to courses
  const handleBackToCourses = () => {
    setSelectedCourse(null);
    setBatches([]);
    setSelectedBatch(null);
  };

  // Open Modal and fetch existing batch videos
  const openUploadModal = async (batch) => {
    setIsUploadModalOpen(true);
    setVideoForm({ title: "", videoUrl: "", description: "", duration: "" });
    setUploadProgress(0);
    try {
      const res = await axios.get(`${API_URL}/videos`);
      const filtered = res.data.filter((v) => v.batchId === batch.id);
      setVideosInBatch(filtered);
    } catch {
      setVideosInBatch([]);
    }
  };

  // Close Modal and go back to batches
  const closeUploadModal = () => {
    setIsUploadModalOpen(false);
    setSelectedBatch(null);
    setVideoForm({ title: "", videoUrl: "", description: "", duration: "" });
    setUploadProgress(0);
  };

  // Input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setVideoForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle video upload (save)
  const handleVideoUpload = async (e) => {
    e.preventDefault();

    if (!videoForm.videoUrl?.trim()) {
      toast.error("Please paste the video URL.");
      return;
    }
    if (!videoForm.title.trim()) {
      toast.error("Please enter a video title");
      return;
    }
    setUploading(true);

    let nextOrder = 1;
    if (videosInBatch.length > 0) {
      nextOrder =
        1 + Math.max(...videosInBatch.map((v) => (typeof v.order === "number" ? v.order : 0)));
    }

    const videoData = {
      title: videoForm.title,
      description: videoForm.description,
      duration: parseInt(videoForm.duration) || 0,
      order: nextOrder,
      courseId: selectedCourse.id,
      courseName: selectedCourse.title,
      batchId: selectedBatch.id,
      batchNumber: selectedBatch.batchNumber,
      uploadedAt: new Date().toISOString(),
      videoUrl: videoForm.videoUrl,
      thumbnail: "https://via.placeholder.com/320x180?text=Video+Thumbnail",
    };

    try {
      setUploadProgress(60);
      const response = await axios.post(`${API_URL}/videos`, videoData);
      setUploadProgress(100);
      if (response.status === 201 || response.status === 200) {
        toast.success("Video saved successfully! 🎉");
        setTimeout(() => {
          closeUploadModal();
        }, 500);
      } else {
        toast.error("Failed to save video.");
      }
    } catch (err) {
      toast.error("Save failed. Please check the details and try again.");
    } finally {
      setUploading(false);
      setTimeout(() => {
        setUploadProgress(0);
      }, 1000);
    }
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

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Video Upload Manager</h1>
        <p className="text-gray-600 mt-2">Upload videos to course batches</p>
      </div>

      {!selectedCourse && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Select a Course</h2>
          {loadingCourses ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : courses.length === 0 ? (
            <div className="text-center py-12">
              <h3 className="mt-2 text-sm font-medium text-gray-900">No courses available</h3>
              <p className="mt-1 text-sm text-gray-500">Create a course to start uploading videos.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course) => (
                <div
                  key={course.id}
                  onClick={() => handleCourseClick(course)}
                  className="bg-white border-2 border-gray-200 rounded-lg overflow-hidden hover:border-blue-500 hover:shadow-xl transition-all duration-200 cursor-pointer group"
                >
                  {course.img && (
                    <div className="relative h-40 overflow-hidden">
                      <img
                        src={course.img}
                        alt={course.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}
                  <div className="p-5">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors flex-1 line-clamp-2">
                        {course.title}
                      </h3>
                      <svg
                        className="w-6 h-6 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all flex-shrink-0 ml-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{course.instructor}</p>
                    <div className="flex items-center gap-2 flex-wrap text-xs">
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded font-medium">
                        {course.category}
                      </span>
                      <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded">
                        {course.duration}
                      </span>
                      {course.level && (
                        <span className={`px-2 py-1 rounded font-medium ${
                          course.level === 'Beginner' ? 'bg-green-100 text-green-800' :
                          course.level === 'Intermediate' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {course.level}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {selectedCourse && !selectedBatch && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <button onClick={handleBackToCourses} className="flex items-center text-gray-600 hover:text-gray-900 mb-4 transition-colors">
            <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Courses
          </button>
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900">{selectedCourse.title}</h2>
            <p className="text-sm text-gray-500 mt-1">Select a batch to upload videos</p>
          </div>
          {loadingBatches ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : batches.length === 0 ? (
            <div className="text-center py-12">
              <h3 className="mt-2 text-sm font-medium text-gray-900">No batches available</h3>
              <p className="mt-1 text-sm text-gray-500">
                Create a batch for this course to upload videos.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {batches.map((batch) => (
                <div
                  key={batch.id}
                  onClick={() => handleBatchClick(batch)}
                  className="border-2 border-gray-200 rounded-lg p-5 hover:border-green-500 hover:shadow-lg transition-all duration-200 cursor-pointer group"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="bg-gradient-to-r from-green-500 to-green-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      Batch {batch.batchNumber}
                    </span>
                    {batch.status && (
                      <span className={`text-xs px-2 py-1 rounded ${
                        batch.status === "active"
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                      }`}>
                        {batch.status}
                      </span>
                    )}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 group-hover:text-green-600 mb-3">
                    {batch.name || `Batch ${batch.batchNumber}`}
                  </h3>
                  <div className="space-y-2 text-sm text-gray-600">
                    {batch.startDate && batch.endDate && (
                      <div className="flex items-center">
                        <svg className="w-4 h-4 mr-2 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span>
                          {new Date(batch.startDate).toLocaleDateString()} - {new Date(batch.endDate).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="mt-4 flex items-center text-green-600 group-hover:text-green-700">
                    <span className="text-sm font-medium">Upload Video</span>
                    <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform"
                      fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* External URL Upload Modal */}
      {isUploadModalOpen && selectedBatch && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-2 text-gray-900">Add Video by URL</h2>
            <p className="text-sm text-gray-600 mb-6">
              {selectedCourse.title} - Batch {selectedBatch.batchNumber}
              {selectedBatch.name && ` (${selectedBatch.name})`}
            </p>
            <form onSubmit={handleVideoUpload} className="space-y-5">
              {/* Video Title */}
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                  Video Title *
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={videoForm.title}
                  onChange={handleInputChange}
                  disabled={uploading}
                  required
                  placeholder="Enter video title"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                />
              </div>
              {/* External Video URL Input */}
              <div>
                <label htmlFor="videoUrl" className="block text-sm font-medium text-gray-700 mb-2">
                  Video URL (Wistia, YouTube, etc) *
                </label>
                <input
                  type="url"
                  id="videoUrl"
                  name="videoUrl"
                  value={videoForm.videoUrl}
                  onChange={handleInputChange}
                  disabled={uploading}
                  required
                  placeholder="Paste the full video URL"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                />
              </div>
              {/* Description */}
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={videoForm.description}
                  onChange={handleInputChange}
                  disabled={uploading}
                  rows={3}
                  placeholder="Enter video description (optional)"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                />
              </div>
              <div>
                <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-2">
                  Duration (min)
                </label>
                <input
                  type="number"
                  id="duration"
                  name="duration"
                  value={videoForm.duration}
                  onChange={handleInputChange}
                  disabled={uploading}
                  placeholder="e.g., 45"
                  min="0"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                />
              </div>
              {/* Progress + Buttons */}
              {uploading && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Saving...</span>
                    <span className="font-semibold text-blue-600">{uploadProgress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                    <div
                      className="bg-blue-600 h-full rounded-full transition-all duration-300 ease-out"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
              )}
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  disabled={uploading}
                  className={`flex-1 px-6 py-3 rounded-lg font-medium text-white transition-colors ${
                    uploading
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700"
                  }`}
                >
                  {uploading ? `Saving...` : "Save Video"}
                </button>
                <button
                  type="button"
                  onClick={closeUploadModal}
                  disabled={uploading}
                  className="flex-1 px-6 py-3 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
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
