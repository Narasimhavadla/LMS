import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../Components/AuthContext";
import { FaSearch, FaList, FaThLarge, FaVideo, FaBook, FaChalkboardTeacher, FaArrowLeft, FaClock, FaCalendar } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import ReactPlayer from "react-player";
import "react-toastify/dist/ReactToastify.css";

const getPlayableUrl = (url) => {
  // Convert Wistia project/media pages into actual embed/video URLs
  if (url && url.includes("wistia.com/medias/")) {
    const match = url.match(/wistia.com\/medias\/([a-zA-Z0-9]+)/);
    if (match && match[1]) {
      return `https://fast.wistia.com/embed/medias/${match[1]}/video`;
    }
  }
  return url;
};

const MyCourses = () => {
  const { email } = useContext(AuthContext);
  const [userCourses, setUserCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [view, setView] = useState("list");
  const API_URL = import.meta.env.VITE_API_URL;
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [allocatedBatch, setAllocatedBatch] = useState(null);
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [videos, setVideos] = useState([]);
  const [loadingVideos, setLoadingVideos] = useState(false);
  const [playingVideo, setPlayingVideo] = useState(null);

  useEffect(() => {
    const fetchUserCourses = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${API_URL}/enrolledcourses?email=${email}`);
        setUserCourses(res.data);
      } catch {
        setUserCourses([]);
      } finally {
        setLoading(false);
      }
    };
    fetchUserCourses();
  }, [email, API_URL]);

  const handleCourseClick = async (userCourse) => {
    try {
      const coursesResponse = await axios.get(`${API_URL}/courses`);
      const fullCourse = coursesResponse.data.find(c => c.title === userCourse.courseName);
      if (!fullCourse) return toast.error("Course not found.");
      setSelectedCourse(fullCourse);
      if (userCourse.batchId) {
        const batchesResponse = await axios.get(`${API_URL}/batches`);
        const batch = batchesResponse.data.find(b => b.id === userCourse.batchId);
        if (batch) setAllocatedBatch(batch);
        else setAllocatedBatch(null);
      } else {
        setAllocatedBatch(null);
      }
      setSelectedBatch(null);
      setVideos([]);
    } catch {
      setAllocatedBatch(null);
      setSelectedBatch(null);
      toast.error("Failed to load batch info.");
    }
  };

  const handleEnterBatch = async () => {
    try {
      if (!allocatedBatch) return;
      setSelectedBatch(allocatedBatch);
      setLoadingVideos(true);
      const response = await axios.get(`${API_URL}/videos`);
      setVideos(response.data.filter(v => v.batchId === allocatedBatch.id));
    } catch {
      setVideos([]);
      toast.error("Failed to load videos.");
    } finally {
      setLoadingVideos(false);
    }
  };

  const handleBackToCourses = () => {
    setSelectedCourse(null);
    setAllocatedBatch(null);
    setSelectedBatch(null);
    setVideos([]);
    setPlayingVideo(null);
  };
  const handleBackToBatch = () => {
    setSelectedBatch(null);
    setVideos([]);
    setPlayingVideo(null);
  };

  const filteredCourses = userCourses.filter((course) =>
    course.courseName.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Video Player Modal
  if (playingVideo) {
    return (
      <div className="fixed inset-0 bg-black z-50 flex flex-col">
        <ToastContainer />
        <div className="bg-gray-900 text-white p-4 flex items-center">
          <button onClick={() => setPlayingVideo(null)} className="p-2 hover:bg-gray-800 rounded-lg">
            <FaArrowLeft className="text-xl" />
          </button>
          <span className="ml-4 text-xl font-bold">{playingVideo.title}</span>
        </div>
        <div className="flex-1 flex items-center justify-center bg-black">
          <div className="w-full h-full max-w-4xl">
            <ReactPlayer
              url={getPlayableUrl(playingVideo.videoUrl)}
              controls
              playing
              width="100%"
              height="100%"
            />
          </div>
        </div>
        {playingVideo.description && (
          <div className="bg-gray-900 text-white p-6">{playingVideo.description}</div>
        )}
      </div>
    );
  }

  if (selectedBatch && allocatedBatch && selectedBatch.id === allocatedBatch.id) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <ToastContainer />
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <button onClick={handleBackToBatch} className="flex items-center text-gray-600 hover:text-gray-900 mb-4">
              <FaArrowLeft className="mr-2" />
              Back to Batch
            </button>
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  {selectedCourse?.title}
                </h1>
                <p className="text-gray-600 mt-1">
                  Batch {allocatedBatch?.batchNumber} - {allocatedBatch?.name}
                </p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-blue-600">{videos.length}</div>
                <div className="text-xs text-gray-500">Videos</div>
              </div>
            </div>
          </div>
          {loadingVideos ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : videos.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-12 text-center">
              <FaVideo className="text-6xl text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Videos Yet</h3>
              <p className="text-gray-600">Videos will appear here once uploaded by the admin</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {videos
                .sort((a, b) => (a.order || 0) - (b.order || 0))
                .map((video, index) => (
                  <div
                    key={video.id}
                    className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-200 cursor-pointer group"
                    onClick={() => setPlayingVideo(video)}
                  >
                    <div className="relative bg-gray-200 aspect-video">
                      <img
                        src={video.thumbnail || "https://via.placeholder.com/320x180?text=Video"}
                        alt={video.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all flex items-center justify-center">
                        <div className="w-16 h-16 bg-white bg-opacity-90 rounded-full flex items-center justify-center transform scale-0 group-hover:scale-100 transition-transform">
                          <svg className="w-8 h-8 text-blue-600 ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                        </div>
                      </div>
                      <div className="absolute top-2 left-2 bg-blue-600 text-white px-2 py-1 rounded text-sm font-semibold">
                        #{video.order || index + 1}
                      </div>
                      {video.duration && (
                        <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white px-2 py-1 rounded text-xs">
                          {video.duration} min
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                        {video.title}
                      </h3>
                      {video.description && (
                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                          {video.description}
                        </p>
                      )}
                      {video.uploadedAt && (
                        <p className="text-xs text-gray-500 flex items-center">
                          <FaCalendar className="mr-1" />
                          {new Date(video.uploadedAt).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // Main Courses UI (rich previous version)
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <ToastContainer />
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Courses</h1>
          <p className="text-gray-600">Access your enrolled courses and learning materials</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 w-full">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search your courses..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setView("list")}
                className={`p-2 rounded-lg transition-colors ${
                  view === "list"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-600 hover:bg-gray-300"
                }`}
              >
                <FaList />
              </button>
              <button
                onClick={() => setView("grid")}
                className={`p-2 rounded-lg transition-colors ${
                  view === "grid"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-600 hover:bg-gray-300"
                }`}
              >
                <FaThLarge />
              </button>
            </div>
          </div>
        </div>
        {filteredCourses.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <FaBook className="text-6xl text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {search ? "No courses found" : "No Enrolled Courses"}
            </h3>
            <p className="text-gray-600">
              {search
                ? "Try adjusting your search"
                : "You haven't been approved for any courses yet."}
            </p>
          </div>
        ) : view === "list" ? (
          <div className="space-y-4">
            {filteredCourses.map((course) => (
              <div
                key={course.id}
                onClick={() => handleCourseClick(course)}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition-all duration-200 cursor-pointer group flex items-center gap-6"
              >
                <img
                  src={course.courseImg || "https://via.placeholder.com/150"}
                  alt={course.courseName}
                  className="w-24 h-24 rounded-lg object-cover"
                />
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors mb-2">
                    {course.courseName}
                  </h3>
                  <p className="text-sm text-gray-600 mb-2">
                    Enrolled on: {course.enrolledDate}
                  </p>
                  <button
                    className="bg-green-600 text-white px-4 py-2 rounded-lg mt-2 hover:bg-green-700"
                    onClick={e => { e.stopPropagation(); handleCourseClick(course); setTimeout(handleEnterBatch, 300); }}
                  >
                    Enter Batch
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course) => (
              <div
                key={course.id}
                onClick={() => handleCourseClick(course)}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-200 cursor-pointer group"
              >
                <img
                  src={course.courseImg || "https://via.placeholder.com/150"}
                  alt={course.courseName}
                  className="w-full h-48 object-cover"
                />
                <div className="p-5">
                  <h3 className="text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors mb-2">
                    {course.courseName}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Enrolled: {course.enrolledDate}
                  </p>
                  <button
                    className="bg-green-600 text-white px-4 py-2 rounded-lg mt-2 hover:bg-green-700"
                    onClick={e => { e.stopPropagation(); handleCourseClick(course); setTimeout(handleEnterBatch, 300); }}
                  >
                    Enter Batch
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyCourses;
