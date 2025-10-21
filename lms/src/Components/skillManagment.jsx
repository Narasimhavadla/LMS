import React, { useMemo, useState } from "react";

export default function SkillManagement() {
  const sampleCourses = [
    {
      id: "c1",
      title: "Introduction to Java",
      instructor: "Dr. A. Rao",
      category: "Programming",
      duration: "8h 30m",
      level: "Beginner",
      students: 1240,
      rating: 4.5,
      img: "https://picsum.photos/seed/java/600/400",
      description:
        "Learn core Java concepts: OOP, collections, streams, and build small console apps.",
    },
    {
      id: "c2",
      title: "React for Beginners",
      instructor: "Lakshmi V.",
      category: "Web Development",
      duration: "6h 15m",
      level: "Beginner",
      students: 2100,
      rating: 4.7,
      img: "https://picsum.photos/seed/react/600/400",
      description: "Component-driven UI, hooks, routing, state management basics.",
    },
  ];

  const [courses, setCourses] = useState(sampleCourses);
  const [query, setQuery] = useState(""); // Search query
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
    img: null,
  });

  // Categories for filter dropdown
  const categories = useMemo(() => {
    const set = new Set(courses.map((c) => c.category));
    return ["All", ...Array.from(set)];
  }, [courses]);

  // Filter, search, and sort
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

  // Add / Edit / Delete handlers
  const handleAddCourse = () => {
    if (!editCourse.title.trim()) return;
    const newCourse = {
      ...editCourse,
      id: Date.now().toString(),
      img: editCourse.img ? URL.createObjectURL(editCourse.img) : "",
      students: 0,
      rating: 0,
    };
    setCourses([...courses, newCourse]);
    setEditCourse({
      id: "",
      title: "",
      instructor: "",
      category: "",
      duration: "",
      level: "",
      description: "",
      img: null,
    });
    setIsEditing(false);
  };

  const handleUpdateCourse = () => {
    setCourses(
      courses.map((c) =>
        c.id === editCourse.id
          ? {
              ...editCourse,
              img: editCourse.img ? URL.createObjectURL(editCourse.img) : c.img,
            }
          : c
      )
    );
    setEditCourse({
      id: "",
      title: "",
      instructor: "",
      category: "",
      duration: "",
      level: "",
      description: "",
      img: null,
    });
    setIsEditing(false);
  };

  const handleDeleteCourse = (id) => setCourses(courses.filter((c) => c.id !== id));

  const handleEditClick = (c) => {
    setIsEditing(true);
    setEditCourse({ ...c, img: null });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <header className="max-w-7xl mx-auto mb-6 flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h1 className="text-3xl font-semibold text-gray-800">Courses</h1>
          <p className="text-gray-500 text-sm">Browse and manage learning content</p>
        </div>

        

        {/* Search and filters */}
        <div className=" flex flex-col md:flex-row md:items-center gap-2 w-full md:w-auto ">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search courses or instructors..."
            className="border rounded-lg p-2 flex-1 w-[350px]"
          />
          <button onClick={clearFilters} className="px-3 py-2 bg-[#E7000B] text-white rounded-lg border shadow hover:bg-red-600">
            Reset
          </button>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="border rounded-lg p-2 w-[80px]"
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
            className="border rounded-lg p-2"
          >
            <option value="popular">Most Popular</option>
            <option value="rating">Top Rated</option>
          </select>
        </div>
        <div className=" items-center">
          <button
            onClick={() => {
              setIsEditing(true);
              setEditCourse({
                id: "",
                title: "",
                instructor: "",
                category: "",
                duration: "",
                level: "",
                description: "",
                img: null,
              });
            }}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg shadow hover:opacity-95"
          >
            + Add Course
          </button>
          
        </div>
      </header>

      {/* Add/Edit Form */}
      {isEditing && (
        <div className="max-w-3xl mx-auto bg-white p-6 rounded-2xl shadow mb-6">
          <h2 className="text-xl font-semibold mb-4">{editCourse.id ? "Edit Course" : "Add New Course"}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Course Title"
              value={editCourse.title}
              onChange={(e) => setEditCourse({ ...editCourse, title: e.target.value })}
              className="border p-2 rounded"
            />
            <input
              type="text"
              placeholder="Instructor"
              value={editCourse.instructor}
              onChange={(e) => setEditCourse({ ...editCourse, instructor: e.target.value })}
              className="border p-2 rounded"
            />
            <input
              type="text"
              placeholder="Category"
              value={editCourse.category}
              onChange={(e) => setEditCourse({ ...editCourse, category: e.target.value })}
              className="border p-2 rounded"
            />
            <input
              type="text"
              placeholder="Duration"
              value={editCourse.duration}
              onChange={(e) => setEditCourse({ ...editCourse, duration: e.target.value })}
              className="border p-2 rounded"
            />
            <input
              type="text"
              placeholder="Level"
              value={editCourse.level}
              onChange={(e) => setEditCourse({ ...editCourse, level: e.target.value })}
              className="border p-2 rounded"
            />
            <input type="file" onChange={(e) => setEditCourse({ ...editCourse, img: e.target.files[0] })} className="border p-2 rounded" />
            <textarea
              placeholder="Description"
              value={editCourse.description}
              onChange={(e) => setEditCourse({ ...editCourse, description: e.target.value })}
              className="border p-2 rounded md:col-span-2"
            />
          </div>
          <div className="mt-4 flex gap-2">
            <button
              onClick={editCourse.id ? handleUpdateCourse : handleAddCourse}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              {editCourse.id ? "Update Course" : "Add Course"}
            </button>
            <button onClick={() => setIsEditing(false)} className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Courses Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {paged.map((c) => (
          <article key={c.id} className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-150">
            <div className="relative">
              <img src={c.img} alt={c.title} className="w-full h-40 object-cover" />
              <div className="absolute left-3 top-3 bg-white/80 px-2 py-1 rounded-md text-xs font-medium">{c.level}</div>
            </div>
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-800">{c.title}</h3>
              <p className="text-sm text-gray-500 mt-1">{c.instructor} • {c.category}</p>
              <div className="mt-3 flex items-center justify-between text-sm text-gray-600">
                <div className="flex items-center gap-3">
                  <div className="px-2 py-1 rounded-md bg-gray-100 text-xs">{c.duration}</div>
                  <div className="text-xs">{c.students} students</div>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => setSelectedCourse(c)} className="px-3 py-1 rounded-lg border text-sm bg-white hover:bg-gray-50">
                    Details
                  </button>
                  <button onClick={() => handleEditClick(c)} className="px-3 py-1 rounded-lg bg-yellow-500 text-white text-sm">
                    Edit
                  </button>
                  <button onClick={() => handleDeleteCourse(c.id)} className="px-3 py-1 rounded-lg bg-red-600 text-white text-sm">
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* Pagination */}
      <div className="mt-8 flex items-center justify-between max-w-7xl mx-auto">
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
    </div>
  );
}
