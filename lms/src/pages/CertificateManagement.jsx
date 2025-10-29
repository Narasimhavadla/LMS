import React, { useEffect, useState } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import { FaCheckCircle, FaDownload, FaRegClock, FaRegCheckCircle, FaUserGraduate, FaTimesCircle } from "react-icons/fa";
import { sendNotification } from "../Components/notificationsApi";

export default function CertificateManagement({ userId, userName, email }) {
  const APIURL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [certificateRequests, setCertificateRequests] = useState([]);
  const [coursesMeta, setCoursesMeta] = useState([]); // For course.description
  const [loading, setLoading] = useState(false);
  const [successAlert, setSuccessAlert] = useState("");
  const [errorAlert, setErrorAlert] = useState("");

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const [coursesRes, certsRes, allCoursesRes] = await Promise.all([
        axios.get(`${APIURL}/enrolledcourses?email=${email}`),
        axios.get(`${APIURL}/certificates?userId=${userId}`),
        axios.get(`${APIURL}/courses`)
      ]);
      setEnrolledCourses(coursesRes.data || []);
      setCertificateRequests(certsRes.data || []);
      setCoursesMeta(allCoursesRes.data || []);
      setLoading(false);
    }
    loadData();
  }, [APIURL, userId, email]);

  const getCertificate = (courseName) => certificateRequests.find((req) => req.courseName === courseName && req.userId === userId);
  const getCourseMeta = (title) => coursesMeta.find(c => c.title === title);

  const requestCertificate = async (courseName) => {
    setLoading(true);
    setSuccessAlert("");
    setErrorAlert("");
    try {
      const res = await axios.post(`${APIURL}/certificates`, { userId, userName, email, courseName, status: "requested" });
      await sendNotification({
        type: "certificate_requested",
        from: userName,
        to: ["admin"],
        message: `${userName} has requested a certificate for "${courseName}"`,
        courseName,
        relatedId: res.data.id,
        createdAt: new Date().toISOString(),
        status: "unread",
        forRole: "admin"
      });
      setSuccessAlert(`Request for "${courseName}" sent! You'll receive a notification when approved.`);
      const certsRes = await axios.get(`${APIURL}/certificates?userId=${userId}`);
      setCertificateRequests(certsRes.data || []);
    } catch {
      setErrorAlert("Request failed. Please try again later.");
    }
    setLoading(false);
    setTimeout(() => {
      setSuccessAlert("");
      setErrorAlert("");
    }, 3000);
  };

  // PDF Design: always use a safe courseName
  const downloadCertificate = (cert, courseTitle) => {
    const courseName = courseTitle || cert.courseName || cert.title || "";
    if (!courseName) {
      alert("Course name is missing for this certificate!");
      return;
    }
    const course = getCourseMeta(courseName);
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
      `Issued: ${(cert.issuedDate || new Date().toLocaleDateString()).slice(0, 10)}`,
      pageWidth / 2,
      370,
      { align: "center" }
    );
    doc.setFontSize(16);
    doc.text((course?.description || ""), pageWidth / 2, 400, { align: "center" });
    doc.setFontSize(18);
    doc.text("Congratulations!", pageWidth / 2, 440, { align: "center" });
    doc.save(`${userName}-${courseName}-certificate.pdf`);
    setSuccessAlert(`Certificate downloaded for "${courseName}"`);
    setTimeout(() => setSuccessAlert(""), 2000);
  };

  return (
    <div style={{ maxWidth: 700, margin: "30px auto", padding: "20px 10px" }}>
      <h2 style={{ fontSize: 28, fontWeight: 700, color: "#2563eb", marginBottom: 15 }}>
        <FaUserGraduate style={{ marginRight: 7 }} />
        Your Certificates
      </h2>
      {successAlert &&
        <div style={{ background: "#d1fae5", color: "#065f46", padding: 10, borderRadius: 6, margin: "12px 0" }}>
          <FaCheckCircle style={{ marginRight: 5 }} />
          {successAlert}
        </div>
      }
      {errorAlert &&
        <div style={{ background: "#fee2e2", color: "#991b1b", padding: 10, borderRadius: 6, margin: "12px 0" }}>
          <FaTimesCircle style={{ marginRight: 5 }} />
          {errorAlert}
        </div>
      }
      {loading ? (
        <div style={{ textAlign: "center", color: "#555" }}>
          <FaRegClock style={{ marginRight: 5 }} />
          Loading courses...
        </div>
      ) : (
        <div style={{ marginTop: 24 }}>
          {enrolledCourses.length === 0 ? (
            <div style={{ fontSize: 17, color: "#64748b" }}>
              You haven't enrolled for any courses yet.
            </div>
          ) : (
            <div style={{ display: "flex", flexWrap: "wrap", gap: "22px", marginTop: 12 }}>
              {enrolledCourses.map((course) => {
                const cert = getCertificate(course.courseName);
                return (
                  <div
                    key={course.courseName}
                    style={{
                      width: 320,
                      minHeight: 120,
                      background: "#f1f5f9",
                      borderRadius: 16,
                      boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                      padding: 22,
                      display: "flex",
                      flexDirection: "column",
                      gap: 10,
                      justifyContent: "center"
                    }}
                  >
                    <div style={{ fontWeight: 600, fontSize: 18, color: "#2563eb" }}>
                      {course.courseName}
                    </div>
                    <div>
                      {!cert && (
                        <button
                          style={{
                            background: "#2563eb",
                            color: "white",
                            borderRadius: 8,
                            padding: "6px 20px",
                            fontWeight: 500,
                            fontSize: 16,
                            border: "none"
                          }}
                          disabled={loading}
                          onClick={() => requestCertificate(course.courseName)}
                        >
                          Request Certificate
                        </button>
                      )}
                      {cert && cert.status === "requested" && (
                        <span
                          style={{
                            background: "#bfdbfe",
                            color: "#2563eb",
                            padding: "5px 15px",
                            borderRadius: 7,
                            fontWeight: 500,
                            marginRight: 10,
                            display: "inline-block"
                          }}
                        >
                          <FaRegCheckCircle style={{ marginRight: 5 }} />
                          Requested - Awaiting Approval
                        </span>
                      )}
                      {cert && cert.status === "completed" && (
                        <button
                          style={{
                            background: "#10b981",
                            color: "white",
                            borderRadius: 8,
                            padding: "6px 18px",
                            fontWeight: 500,
                            fontSize: 16,
                            border: "none"
                          }}
                          onClick={() => downloadCertificate(cert, course.courseName)}
                        >
                          <FaDownload style={{ marginRight: 7 }} />
                          Download Certificate
                        </button>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
