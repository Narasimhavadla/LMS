import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export default function Courses() {
  const [courses, setCourses] = useState([]);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("popular");
  const [page, setPage] = useState(1);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const pageSize = 6;

  const API_URL = import.meta.env.VITE_API_URL;

  // ✅ Fetch data from API
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get(`${API_URL}/courses`);
        setCourses(response.data);
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };
    fetchCourses();
  }, []);

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

    if (sort === "popular") {
      out = out.sort((a, b) => b.students - a.students);
    } else if (sort === "rating") {
      out = out.sort((a, b) => b.rating - a.rating);
    }

    return out;
  }, [courses, query, category, sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paged = filtered.slice((page - 1) * pageSize, page * pageSize);

  function clearFilters() {
    setQuery("");
    setCategory("All");
    setSort("popular");
    setPage(1);
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <header className="max-w-7xl mx-auto mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-semibold text-gray-800">Courses</h1>
            <p className="text-sm text-gray-500">Browse and manage learning content</p>
          </div>

          <div className="hidden sm:flex gap-3 items-center">
            <button
              onClick={clearFilters}
              className="px-3 py-2 rounded-lg bg-white shadow-sm border text-sm hover:bg-gray-100"
            >
              Reset
            </button>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="col-span-1 md:col-span-2 flex items-center gap-2">
            <div className="relative flex-1">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search courses or instructors..."
                className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2 pr-10 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-200"
              />
              <svg
                className="w-5 h-5 absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1116.65 16.65z" />
              </svg>
            </div>

            <div className="flex items-center gap-2">
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="rounded-lg border border-gray-200 bg-white px-3 py-2 shadow-sm focus:outline-none"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>

              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="rounded-lg border border-gray-200 bg-white px-3 py-2 shadow-sm focus:outline-none"
              >
                <option value="popular">Most Popular</option>
                <option value="rating">Top Rated</option>
                <option value="new">Newest</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="text-sm text-gray-600">Showing</div>
            <div className="font-medium">{filtered.length}</div>
            <div className="text-sm text-gray-600">results</div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto">
        {courses.length === 0 ? (
          <div className="text-center py-10 text-gray-500">Loading courses...</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {paged.map((c) => (
              <article
                key={c.id}
                className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-150"
              >
                <div className="relative">
                  <img src={c.img} alt={c.title} className="w-full h-40 object-cover" />
                  <div className="absolute left-3 top-3 bg-white/80 px-2 py-1 rounded-md text-xs font-medium">
                    {c.level}
                  </div>
                  <div className="absolute right-3 top-3 bg-black/60 text-white px-2 py-1 rounded-md text-xs flex items-center gap-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.97a1 1 0 00.95.69h4.18c.969 0 1.371 1.24.588 1.81l-3.386 2.46a1 1 0 00-.364 1.118l1.287 3.97c.3.921-.755 1.688-1.54 1.118l-3.386-2.46a1 1 0 00-1.176 0l-3.386 2.46c-.784.57-1.838-.197-1.539-1.118l1.286-3.97a1 1 0 00-.364-1.118L2.045 9.397c-.783-.57-.38-1.81.588-1.81h4.18a1 1 0 00.95-.69l1.286-3.97z" />
                    </svg>
                    <span className="text-xs">{c.rating}</span>
                  </div>
                </div>

                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-800">{c.title}</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    {c.instructor} • {c.category}
                  </p>

                  <div className="mt-3 flex items-center justify-between text-sm text-gray-600">
                    <div className="flex items-center gap-3">
                      <div className="px-2 py-1 rounded-md bg-gray-100 text-xs">{c.duration}</div>
                      <div className="text-xs">{c.students} students</div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setSelectedCourse(c)}
                        className="px-3 py-1 rounded-lg border text-sm bg-white hover:bg-gray-50"
                      >
                        Details
                      </button>
                      {/* <button className="px-3 py-1 rounded-lg bg-indigo-600 text-white text-sm">
                        Enroll
                      </button> */}
                      <Link to={`/enroll/${c.id}` } className="px-3 py-1 rounded-lg bg-indigo-600 text-white text-sm">View / Enroll</Link>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* Pagination */}
        <div className="mt-8 flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Page {page} of {totalPages}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-3 py-2 rounded-lg border bg-white shadow-sm disabled:opacity-50"
            >
              Previous
            </button>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-3 py-2 rounded-lg border bg-white shadow-sm disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </main>

      {/* Course Detail Modal */}
      {selectedCourse && (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setSelectedCourse(null)}
          />
          <div className="relative w-full md:w-3/4 lg:w-1/2 bg-white rounded-2xl shadow-2xl overflow-hidden m-4">
            <div className="flex items-start gap-4 p-6">
              <img
                src={selectedCourse.img}
                alt="cover"
                className="w-28 h-20 object-cover rounded-md"
              />
              <div>
                <h2 className="text-xl font-semibold">{selectedCourse.title}</h2>
                <p className="text-sm text-gray-500">
                  {selectedCourse.instructor} • {selectedCourse.category}
                </p>
                <p className="mt-2 text-sm text-gray-700">
                  {selectedCourse.description}
                </p>
                <div className="mt-3 flex items-center gap-3 text-sm text-gray-600">
                  <div>{selectedCourse.duration}</div>
                  <div>{selectedCourse.students} students</div>
                  <div>Rating: {selectedCourse.rating}</div>
                </div>
              </div>

              <div className="ml-auto flex items-center gap-2">
                <button
                  onClick={() => setSelectedCourse(null)}
                  className="px-3 py-2 rounded-lg bg-gray-100"
                >
                  Close
                </button>
                <button className="px-4 py-2 rounded-lg bg-indigo-600 text-white">
                  Go to course
                </button>
              </div>
            </div>

            <div className="border-t px-6 py-4 bg-gray-50 text-sm text-gray-700">
              <strong>Course outline</strong>
              <ul className="mt-2 list-disc list-inside">
                <li>Introduction & setup</li>
                <li>Core concepts and fundamentals</li>
                <li>Hands-on exercises & mini-project</li>
                <li>Summary & next steps</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
