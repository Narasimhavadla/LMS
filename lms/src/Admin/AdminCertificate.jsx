import { useState } from "react";

export default function AdminCertificateManagement() {
  const sampleCourses = [
    {
      id: "course_001",
      title: "React Fundamentals",
      students: [
        { id: 1, name: "Lakshmi Narasimha", joinDate: "2024-08-01", completeDate: "2024-09-15", certificateIssued: true },
        { id: 2, name: "K MD Lookmaan", joinDate: "2024-08-10", completeDate: "", certificateIssued: false },
      ],
    },
    {
      id: "course_002",
      title: "Core Java",
      students: [
        { id: 3, name: "Sai Kumar", joinDate: "2024-07-01", completeDate: "2024-09-01", certificateIssued: true },
        { id: 4, name: "Nandini", joinDate: "2024-08-05", completeDate: "", certificateIssued: false },
      ],
    },
    {
      id: "course_003",
      title: "Python Essentials",
      students: [
        { id: 5, name: "Rahul", joinDate: "2024-08-20", completeDate: "", certificateIssued: false },
        { id: 6, name: "Sneha", joinDate: "2024-09-10", completeDate: "2024-10-01", certificateIssued: true },
      ],
    },
  ];

  const [courses, setCourses] = useState(sampleCourses);
  const [selectedCourse, setSelectedCourse] = useState(sampleCourses[0]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showCertModal, setShowCertModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [certificateStudent, setCertificateStudent] = useState(null);
  const [editForm, setEditForm] = useState({ name: "", joinDate: "", completeDate: "" });

  function selectCourse(course) {
    setSelectedCourse(course);
  }

  function issueCertificate(courseId, studentId) {
    setCourses((prev) =>
      prev.map((c) =>
        c.id === courseId
          ? {
              ...c,
              students: c.students.map((s) =>
                s.id === studentId ? { ...s, certificateIssued: true } : s
              ),
            }
          : c
      )
    );
    alert("Certificate issued successfully!");
  }

  function openEdit(student) {
    setEditingStudent(student);
    setEditForm({
      name: student.name,
      joinDate: student.joinDate,
      completeDate: student.completeDate,
    });
    setShowEditModal(true);
  }

  function saveStudent() {
    setCourses((prev) =>
      prev.map((course) =>
        course.id === selectedCourse.id
          ? {
              ...course,
              students: course.students.map((s) =>
                s.id === editingStudent.id ? { ...s, ...editForm } : s
              ),
            }
          : course
      )
    );
    setShowEditModal(false);
  }

  function viewCertificate(student) {
    setCertificateStudent(student);
    setShowCertModal(true);
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-semibold text-gray-800 mb-4">Admin Certification Management</h1>
        <p className="text-gray-600 mb-6">Manage, edit, issue, and view certificates for each course.</p>

        {/* Course Tabs */}
        <div className="flex gap-3 overflow-x-auto pb-2 mb-6 border-b border-gray-200">
          {courses.map((course) => (
            <button
              key={course.id}
              onClick={() => selectCourse(course)}
              className={`px-4 py-2 rounded-t-md border-b-2 font-medium text-sm whitespace-nowrap ${
                selectedCourse.id === course.id
                  ? "border-indigo-600 text-indigo-700 bg-white shadow-sm"
                  : "border-transparent text-gray-600 hover:text-indigo-600 hover:border-indigo-300"
              }`}
            >
              {course.title}
            </button>
          ))}
        </div>

        {/* Students Table */}
        <div className="bg-white border rounded-lg shadow-sm p-5">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Enrolled Students - <span className="text-indigo-600">{selectedCourse.title}</span>
          </h2>

          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="border px-3 py-2">#</th>
                <th className="border px-3 py-2">Student Name</th>
                <th className="border px-3 py-2">Join Date</th>
                <th className="border px-3 py-2">Completion Date</th>
                <th className="border px-3 py-2 text-center">Certificate</th>
                <th className="border px-3 py-2 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {selectedCourse.students.map((s, index) => (
                <tr key={s.id} className="hover:bg-gray-50">
                  <td className="border px-3 py-2">{index + 1}</td>
                  <td className="border px-3 py-2">{s.name}</td>
                  <td className="border px-3 py-2">{s.joinDate || "—"}</td>
                  <td className="border px-3 py-2">{s.completeDate || "—"}</td>
                  <td className="border px-3 py-2 text-center">
                    {s.certificateIssued ? (
                      <span className="text-green-600 font-medium">Issued</span>
                    ) : (
                      <button
                        onClick={() => issueCertificate(selectedCourse.id, s.id)}
                        className="px-3 py-1 bg-green-500 text-white rounded text-xs hover:bg-green-600"
                      >
                        Issue
                      </button>
                    )}
                  </td>
                  <td className="border px-3 py-2 text-center flex justify-center gap-2">
                    <button
                      onClick={() => openEdit(s)}
                      className="px-3 py-1 border rounded text-xs hover:bg-gray-100"
                    >
                      Edit
                    </button>
                    {s.certificateIssued && (
                      <button
                        onClick={() => viewCertificate(s)}
                        className="px-3 py-1 bg-indigo-500 text-white rounded text-xs hover:bg-indigo-600"
                      >
                        View
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Edit Modal */}
        {showEditModal && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
              <h2 className="text-lg font-semibold mb-4 text-gray-800">Edit Student Details</h2>
              <div className="space-y-3">
                <label className="block text-sm">
                  Name
                  <input
                    value={editForm.name}
                    onChange={(e) => setEditForm((s) => ({ ...s, name: e.target.value }))}
                    className="border rounded w-full p-2 mt-1"
                  />
                </label>
                <label className="block text-sm">
                  Join Date
                  <input
                    type="date"
                    value={editForm.joinDate}
                    onChange={(e) => setEditForm((s) => ({ ...s, joinDate: e.target.value }))}
                    className="border rounded w-full p-2 mt-1"
                  />
                </label>
                <label className="block text-sm">
                  Completion Date
                  <input
                    type="date"
                    value={editForm.completeDate}
                    onChange={(e) => setEditForm((s) => ({ ...s, completeDate: e.target.value }))}
                    className="border rounded w-full p-2 mt-1"
                  />
                </label>
              </div>

              <div className="mt-5 flex justify-end gap-2">
                <button
                  onClick={() => setShowEditModal(false)}
                  className="px-3 py-2 border rounded text-gray-600 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  onClick={saveStudent}
                  className="px-3 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Certificate Modal */}
        {showCertModal && certificateStudent && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-2xl relative text-center border-4 border-indigo-500">
              <button
                onClick={() => setShowCertModal(false)}
                className="absolute right-3 top-3 text-gray-500 hover:text-gray-800"
              >
                ✕
              </button>
              <h2 className="text-2xl font-bold text-indigo-700 mb-2">Certificate of Completion</h2>
              <p className="text-gray-600 mb-6">This certifies that</p>
              <h3 className="text-3xl font-semibold text-gray-800">{certificateStudent.name}</h3>
              <p className="text-gray-600 mt-4">
                has successfully completed the course
              </p>
              <h3 className="text-xl font-medium text-indigo-600 mt-1">
                {selectedCourse.title}
              </h3>
              <div className="mt-6 text-sm text-gray-600">
                <p>Join Date: {certificateStudent.joinDate || "—"}</p>
                <p>Completion Date: {certificateStudent.completeDate || "—"}</p>
                <p>Issued On: {new Date().toLocaleDateString()}</p>
              </div>
              <div className="mt-8 text-right text-sm text-gray-500">
                <p>_________________________</p>
                <p>Authorized by OpenLMS</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
