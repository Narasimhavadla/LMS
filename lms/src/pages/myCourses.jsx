import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../Components/AuthContext";
import { FaSearch, FaList, FaThLarge, FaVideo, FaBook, FaChalkboardTeacher } from "react-icons/fa";

const MyCourses = () => {
  const { email } = useContext(AuthContext); // logged-in user's email
  const [userCourses, setUserCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [view, setView] = useState("list");
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchUserCourses = async () => {
      if (!email) {
        setUserCourses([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const res = await axios.get(`${API_URL}/enrolledcourses?email=${email}`);
        setUserCourses(res.data);
      } catch (err) {
        console.error("Error fetching enrolled courses:", err);
        setUserCourses([]);
      } finally {
        setLoading(false);
      }
    };

    fetchUserCourses();
  }, [email, API_URL]);

  const filteredCourses = userCourses.filter((course) =>
    course.courseName.toLowerCase().includes(search.toLowerCase())
  );

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen text-gray-600 text-lg font-semibold">
        Loading your enrolled courses...
      </div>
    );

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="flex justify-between items-center px-10 pt-8 pb-4 border-b">
        <h1 className="text-2xl font-bold text-gray-900">My Courses</h1>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search Courses..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border rounded-lg pl-10 pr-4 py-2 text-sm w-72 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <FaSearch className="absolute left-3 top-3 text-gray-400" />
          </div>

          <div className="flex border rounded-md overflow-hidden">
            <button
              onClick={() => setView("list")}
              className={`px-3 py-2 ${
                view === "list" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600"
              }`}
            >
              <FaList />
            </button>
            <button
              onClick={() => setView("grid")}
              className={`px-3 py-2 ${
                view === "grid" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600"
              }`}
            >
              <FaThLarge />
            </button>
          </div>
        </div>
      </div>

      {/* Course List */}
      <div className="px-10 py-8">
        {filteredCourses.length === 0 ? (
          <p className="text-center text-gray-500 text-lg">
            You haven’t been approved for any courses yet.
          </p>
        ) : view === "list" ? (
          <div className="space-y-5 ">
            {filteredCourses.map((course) => (
              <div
                key={course.id}
                className="h-36 flex items-center justify-between border rounded-xl shadow-sm hover:shadow-md transition bg-white px-5 py-4"
              >
                <div className="flex items-center space-x-4 w-full">
                  <img
                    src={course.courseImg}
                    alt={course.courseName}
                    className="w-36 h-24 rounded-lg object-cover "
                  />
                  <div className="flex-1">
                    <h2 className="text-lg font-semibold text-gray-800">
                      {course.courseName}
                    </h2>
                    <p className="text-gray-500 text-sm mt-1 line-clamp-2">
                      {course.description || "No description available."}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  {/* <button className="flex items-center gap-1 bg-gray-100 text-gray-500 font-medium text-sm px-3 py-1.5 rounded-md">
                    <FaChalkboardTeacher /> Live Class
                  </button>
                  <button className="flex items-center gap-1 bg-gray-100 text-gray-500 font-medium text-sm px-3 py-1.5 rounded-md">
                    <FaBook /> Documents
                  </button> */}
                  <button className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm px-3 py-1.5 rounded-md">
                    <FaVideo /> Videos
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          // Grid View
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course) => (
              <div
                key={course.id}
                className="border rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition bg-white"
              >
                <img
                  src={course.courseImg}
                  alt={course.courseName}
                  className="w-full h-40 object-cover"
                />
                <div className="p-4">
                  <h2 className="text-lg font-semibold text-gray-800">
                    {course.courseName}
                  </h2>
                  <p className="text-gray-600 text-sm mt-1 line-clamp-2">
                    {course.description || "No description available."}
                  </p>
                  <div className="flex justify-end mt-3 space-x-2">
                    {/* <button className="bg-gray-100 text-gray-500 text-sm px-3 py-1.5 rounded-md">
                      Live
                    </button>
                    <button className="bg-gray-100 text-gray-500 text-sm px-3 py-1.5 rounded-md">
                      Docs
                    </button> */}
                    <button className="bg-blue-600 text-white text-sm px-3 py-1.5 rounded-md">
                      Videos
                    </button>
                  </div>
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
