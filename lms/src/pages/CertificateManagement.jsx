import React, { useEffect, useState } from "react";
import axios from "axios";
import jsPDF from "jspdf";

// You can import your favorite icon libraries for better visuals!
import { FaRegCheckCircle, FaSpinner, FaDownload, FaRegClock, FaRegFileAlt } from "react-icons/fa";

export default function CertificateManagement({ userId, userName, email }) {
  const API_URL = import.meta.env.VITE_API_URL;
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [courseMetas, setCourseMetas] = useState({});
  const [certificateRequests, setCertificateRequests] = useState([]);
  const [loadingMap, setLoadingMap] = useState({});

  useEffect(() => {
    axios.get(`${API_URL}/enrolledcourses?email=${email}`)
      .then(res => setEnrolledCourses(res.data || []));
    axios.get(`${API_URL}/courses`).then(res => {
      const dict = {};
      (res.data || []).forEach(course => { dict[course.title] = course; });
      setCourseMetas(dict);
    });
    axios.get(`${API_URL}/certificates?userId=${userId}`)
      .then(res => setCertificateRequests(res.data || []));
  }, [API_URL, userId, email]);

  const getCertificate = courseName =>
    certificateRequests.find(req => req.courseName === courseName && req.userId === userId);

  const requestCertificate = async (courseName) => {
    setLoadingMap(lm => ({ ...lm, [courseName]: true }));
    await axios.post(`${API_URL}/certificates`, {
      userId,
      userName,
      courseName,
      status: "requested",
      issuedDate: "",
      downloadUrl: "",
    });
    const resp = await axios.get(`${API_URL}/certificates?userId=${userId}`);
    setCertificateRequests(resp.data || []);
    setLoadingMap(lm => ({ ...lm, [courseName]: false }));
  };

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
      pageWidth / 2,
      370,
      { align: "center" }
    );
    doc.setFontSize(16);
    doc.text(course?.description || "", pageWidth / 2, 400, { align: "center" });
    doc.setFontSize(18);
    doc.text("Congratulations!", pageWidth / 2, 440, { align: "center" });
    doc.save(`${userName}-${courseName}-certificate.pdf`);
  };

  // Util for tags
  const CertificateStatusTag = ({ status }) => {
    if (status === "requested") return (
      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
        <FaRegClock className="mr-1" /> Awaiting Approval
      </span>
    );
    if (status === "completed" || status === "issued") return (
      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
        <FaRegCheckCircle className="mr-1" /> Issued
      </span>
    );
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-200 text-gray-800">
        <FaRegFileAlt className="mr-1" /> Not requested
      </span>
    );
  };

  // Main render:
  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6 text-blue-800 flex items-center gap-2">
        <FaRegFileAlt className="text-blue-400" /> My Certificates
      </h2>
      {enrolledCourses.length === 0 ? (
        <div className="bg-gray-50 text-gray-400 text-center py-16 rounded-xl shadow-inner">
          No enrolled courses found.
        </div>
      ) : (
        <div className="grid gap-6">
          {enrolledCourses.map((enrollment) => {
            const cert = getCertificate(enrollment.courseName);
            const status = cert?.status || "none";
            return (
              <div key={enrollment.courseName} className="flex flex-col md:flex-row md:items-center justify-between bg-white rounded-xl shadow p-5 transition hover:shadow-lg border border-slate-100">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <div className="flex-shrink-0 rounded bg-gradient-to-tr from-blue-100 to-blue-200 p-3">
                      <FaRegFileAlt className="text-blue-600 text-2xl" />
                    </div>
                    <div>
                      <div className="font-semibold text-lg text-gray-800">{enrollment.courseName}</div>
                      <div className="text-gray-500 text-sm">{courseMetas[enrollment.courseName]?.description}</div>
                    </div>
                  </div>
                </div>
                <div className="mt-3 md:mt-0 flex flex-col md:items-end gap-2">
                  <CertificateStatusTag status={status} />
                  <div>
                    {loadingMap[enrollment.courseName] ? (
                      <button className="flex items-center gap-2 bg-blue-300 text-white px-4 py-1 rounded cursor-not-allowed animate-pulse" disabled>
                        <FaSpinner className="animate-spin" />Processing...
                      </button>
                    ) : cert && (status === "completed" || status === "issued") ? (
                      <button
                        className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-1 rounded shadow transition"
                        onClick={() => downloadCertificatePDF(cert, enrollment.courseName)}
                      >
                        <FaDownload /> Download PDF
                      </button>
                    ) : cert && status === "requested" ? (
                      <button
                        className="flex items-center gap-2 bg-yellow-400 text-white px-4 py-1 rounded shadow"
                        disabled
                      >
                        <FaRegClock /> Requested
                      </button>
                    ) : (
                      <button
                        className="flex items-center gap-2 bg-blue-700 hover:bg-blue-900 text-white px-4 py-1 rounded shadow transition"
                        onClick={() => requestCertificate(enrollment.courseName)}
                        disabled={loadingMap[enrollment.courseName]}
                      >
                        <FaRegFileAlt /> Request
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
