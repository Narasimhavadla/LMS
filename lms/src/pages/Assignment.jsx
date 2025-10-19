import React, { useState } from "react";

export default function Assignment() {
  const [assignments, setAssignments] = useState([
    {
      id: 1,
      title: "Java Basics - OOP Concepts",
      course: "Java Programming",
      dueDate: "2025-10-25",
      status: "Pending",
      marks: 0,
      description: "Write a Java program demonstrating inheritance, polymorphism, and encapsulation.",
    },
    {
      id: 2,
      title: "React Components Project",
      course: "Frontend Development",
      dueDate: "2025-10-22",
      status: "Submitted",
      marks: 90,
      description: "Build a React app showcasing the use of props, state, and hooks.",
    },
    {
      id: 3,
      title: "SQL Joins and Queries",
      course: "Database Systems",
      dueDate: "2025-10-28",
      status: "Overdue",
      marks: 0,
      description: "Solve 10 SQL problems involving joins, aggregations, and subqueries.",
    },
  ]);

  const [selected, setSelected] = useState(null);

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-6">
      <header className="max-w-7xl mx-auto mb-6">
        <h1 className="text-3xl font-semibold text-gray-800 mb-2">Assignments</h1>
        <p className="text-gray-500 text-sm">
          View, manage, and submit your ongoing course assignments.
        </p>
      </header>

      <main className="max-w-7xl mx-auto">
        <div className="overflow-x-auto bg-white rounded-2xl shadow-md border border-gray-100">
          <table className="w-full text-left border-collapse">
            <thead className="bg-indigo-600 text-white text-sm">
              <tr>
                <th className="py-3 px-4">Title</th>
                <th className="py-3 px-4">Course</th>
                <th className="py-3 px-4">Due Date</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Marks</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {assignments.map((a) => (
                <tr
                  key={a.id}
                  className="border-t hover:bg-gray-50 cursor-pointer text-sm"
                  onClick={() => setSelected(a)}
                >
                  <td className="py-3 px-4 font-medium text-gray-800">{a.title}</td>
                  <td className="py-3 px-4 text-gray-600">{a.course}</td>
                  <td className="py-3 px-4 text-gray-600">{a.dueDate}</td>
                  <td className={`py-3 px-4 font-medium ${
                    a.status === "Pending"
                      ? "text-yellow-600"
                      : a.status === "Submitted"
                      ? "text-green-600"
                      : "text-red-600"
                  }`}>{a.status}</td>
                  <td className="py-3 px-4 text-gray-600">{a.marks > 0 ? a.marks : "-"}</td>
                  <td className="py-3 px-4 text-right">
                    <button className="px-3 py-1 rounded-md bg-indigo-600 text-white text-xs hover:bg-indigo-700">
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Assignment Details Modal */}
        {selected && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl p-6 relative">
              <button
                onClick={() => setSelected(null)}
                className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>

              <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                {selected.title}
              </h2>
              <p className="text-sm text-gray-500 mb-4">{selected.course}</p>

              <p className="text-gray-700 text-sm leading-relaxed mb-4">
                {selected.description}
              </p>

              <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                <div>
                  <span className="font-medium text-gray-800">Due Date:</span>
                  <p className="text-gray-600">{selected.dueDate}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-800">Status:</span>
                  <p className={`text-sm ${
                    selected.status === "Pending"
                      ? "text-yellow-600"
                      : selected.status === "Submitted"
                      ? "text-green-600"
                      : "text-red-600"
                  }`}>{selected.status}</p>
                </div>
              </div>

              {selected.status === "Pending" && (
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Upload Your File
                  </label>
                  <input
                    type="file"
                    className="w-full border border-gray-200 rounded-lg p-2 text-sm"
                  />
                  <button className="mt-4 px-5 py-2 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700">
                    Submit Assignment
                  </button>
                </div>
              )}

              {selected.status === "Submitted" && (
                <p className="text-green-600 text-sm font-medium mt-4">
                  ✅ Assignment already submitted. Marks: {selected.marks}
                </p>
              )}

              {selected.status === "Overdue" && (
                <p className="text-red-600 text-sm font-medium mt-4">
                  ⚠️ Submission closed for this assignment.
                </p>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
