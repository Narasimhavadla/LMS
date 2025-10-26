import React, { useEffect, useState } from "react";
import axios from "axios";
import jsPDF from "jspdf";

export default function CertificateManagement({ userId, userName, email }) {
  const API_URL = import.meta.env.VITE_API_URL;
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [courseMetas, setCourseMetas] = useState({});
  const [certificateRequests, setCertificateRequests] = useState([]);
  const [loadingMap, setLoadingMap] = useState({});

  useEffect(() => {
    // Fetch enrolledcourses for user
    axios.get(`${API_URL}/enrolledcourses?email=${email}`).then(res => setEnrolledCourses(res.data || []));
    // Fetch all courses meta for mapping
    axios.get(`${API_URL}/courses`).then(res => {
      // Create a dictionary for quick lookup by title
      const dict = {};
      (res.data || []).forEach(course => {
        dict[course.title] = course;
      });
      setCourseMetas(dict);
    });
    // Certificates (request status per enrollment)
    axios.get(`${API_URL}/certificates?userId=${userId}`).then(res => setCertificateRequests(res.data || []));
  }, [API_URL, userId, email]);

  // Returns cert request for this course only
  const getCertificate = courseName =>
    certificateRequests.find(req => req.courseName === courseName && req.userId === userId);

  const requestCertificate = async (courseName /* string */) => {
    setLoadingMap(lm => ({ ...lm, [courseName]: true }));
    await axios.post(`${API_URL}/certificates`, {
      userId,
      userName,
      courseName,
      status: "requested",
      issuedDate: "",
      downloadUrl: ""
    });
    const resp = await axios.get(`${API_URL}/certificates?userId=${userId}`);
    setCertificateRequests(resp.data || []);
    setLoadingMap(lm => ({ ...lm, [courseName]: false }));
  };

  // PDF download generator
  const downloadCertificatePDF = (certificate, courseName) => {
    const course = courseMetas[courseName];
    const doc = new jsPDF("landscape", "pt", "a4");
    const pageWidth = doc.internal.pageSize.getWidth();
    doc.setFontSize(32);
    doc.text("Certificate of Completion", pageWidth / 2, 100, { align: "center" });
    doc.setFontSize(18);
    doc.text("This is to certify that", pageWidth / 2, 160, { align: "center" });
    doc.setFontSize(24);
    doc.text(userName, pageWidth / 2, 210, { align: "center" });
    doc.setFontSize(18);
    doc.text("has successfully completed the course", pageWidth / 2, 255, { align: "center" });
    doc.setFontSize(22);
    doc.text(courseName, pageWidth / 2, 300, { align: "center" });
    doc.setFontSize(16);
    doc.text(
      `Issued: ${(certificate.issuedDate || new Date().toLocaleDateString()).slice(0, 10)}`,
      pageWidth / 2, 370, { align: "center" }
    );
    doc.setFontSize(16);
    doc.text(course?.description || "", pageWidth / 2, 400, { align: "center" });
    doc.setFontSize(18);
    doc.text("Congratulations!", pageWidth / 2, 440, { align: "center" });
    doc.save(`${userName}-${courseName}-certificate.pdf`);
  };

  // RENDER: Only enrolled courses
  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded-xl shadow">
      <h2 className="font-bold text-2xl mb-5">Certificates for Your Courses</h2>
      <ul>
        {enrolledCourses.length === 0 && (
          <li className="p-5 text-gray-500">No enrolled courses found.</li>
        )}
        {enrolledCourses.map(enrollment => {
          // Get extra info from global courses meta
          const course = courseMetas[enrollment.courseName];
          const cert = getCertificate(enrollment.courseName);
          return (
            <li
              key={enrollment.id}
              className="flex items-center justify-between border-b py-4 gap-2"
            >
              <span className="font-semibold text-blue-900">{enrollment.courseName} <span className="text-gray-400 text-sm">({course?.instructor || ""})</span></span>
              <span>
                {loadingMap[enrollment.courseName] ? (
                  <span className="text-gray-400 px-4">Processing...</span>
                ) : cert && cert.status === "issued" ? (
                  <button
                    className="bg-blue-700 text-white px-4 py-1 rounded hover:bg-blue-900"
                    onClick={() => downloadCertificatePDF(cert, enrollment.courseName)}
                  >
                    Download PDF
                  </button>
                ) : cert && cert.status === "requested" ? (
                  <span className="text-yellow-700 font-semibold">Requested</span>
                ) : (
                  <button
                    className="bg-blue-700 text-white px-4 py-1 rounded hover:bg-blue-900"
                    disabled={loadingMap[enrollment.courseName]}
                    onClick={() => requestCertificate(enrollment.courseName)}
                  >
                    Request
                  </button>
                )}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
