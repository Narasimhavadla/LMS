import React, { useState } from "react";

const MyCourses = () => {
  const [view, setView] = useState("list");
  const [search, setSearch] = useState("");

  const courses = [
    {
      id: 1,
      title: "React-2408-9:30am-Manideep",
      description: "React is the Framework for Fullstack",
      image: "https://via.placeholder.com/100x100",
    },
    {
      id: 2,
      title: "Fs-Basic-2415 8 AM Lokesh",
      description:
        "This comprehensive course introduces you to website development with HTML, CSS, and JavaScript. Learn to build responsive, user-friendly websites from scratch.",
      image: "https://via.placeholder.com/100x100",
    },
  ];

  const filteredCourses = courses.filter((course) =>
    course.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="w-4/5 mx-auto min-h-screen bg-white px-6 py-10">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">My Courses</h1>

      {/* Search and View Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
        <div className="flex items-center border rounded-lg w-full sm:w-1/2 bg-white">
          <input
            type="text"
            placeholder="Search Courses..."
            className="flex-1 px-4 py-2 rounded-l-lg outline-none"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button
              className="px-3 text-gray-400 hover:text-gray-600"
              onClick={() => setSearch("")}
            >
              ✕
            </button>
          )}
        </div>

        <div className="flex border rounded-lg overflow-hidden">
          <button
            className={`px-4 py-2 ${
              view === "list"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700"
            }`}
            onClick={() => setView("list")}
          >
            ☰
          </button>
          <button
            className={`px-4 py-2 ${
              view === "grid"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700"
            }`}
            onClick={() => setView("grid")}
          >
            ⬚
          </button>
        </div>
      </div>

      {/* Course Cards */}
      {view === "list" ? (
        <div className="flex flex-col gap-6">
          {filteredCourses.map((course) => (
            <div
              key={course.id}
              className="flex flex-col sm:flex-row items-center bg-white border rounded-lg p-4 shadow-sm hover:shadow-md transition"
            >
              <img
                src={course.image}
                alt={course.title}
                className="w-36 h-36 object-cover rounded-md mr-4"
              />
              <div className="flex-1">
                <h2 className="text-lg font-semibold text-gray-900">
                  {course.title}
                </h2>
                <p className="text-gray-600 text-sm mt-1">
                  {course.description}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-2 mt-4 sm:mt-0">
                <button className="bg-gray-200 text-gray-700 px-4 py-2 rounded text-sm">
                  🎥 Live Class
                </button>
                <button className="bg-gray-200 text-gray-700 px-4 py-2 rounded text-sm">
                  📘 Documents
                </button>
                <button className="bg-blue-600 text-white px-4 py-2 rounded text-sm">
                  ▶️ Videos
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <div
              key={course.id}
              className="bg-white border rounded-lg p-4 shadow-sm hover:shadow-md transition"
            >
              <img
                src={course.image}
                alt={course.title}
                className="w-full h-40 object-cover rounded-md mb-4"
              />
              <h2 className="text-lg font-semibold text-gray-900 mb-2">
                {course.title}
              </h2>
              <p className="text-gray-600 text-sm mb-4">
                {course.description.slice(0, 100)}...
              </p>
              <div className="flex justify-between">
                <button className="bg-gray-200 text-gray-700 px-3 py-1 rounded text-sm">
                  Live Class
                </button>
                <button className="bg-gray-200 text-gray-700 px-3 py-1 rounded text-sm">
                  Documents
                </button>
                <button className="bg-blue-600 text-white px-3 py-1 rounded text-sm">
                  Videos
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyCourses;
