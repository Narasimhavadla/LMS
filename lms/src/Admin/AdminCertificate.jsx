import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaCheckCircle, FaClock, FaUserGraduate, FaTrash } from "react-icons/fa";
import { sendNotification } from "../Components/notificationsApi";

export default function AdminCertificate() {
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
  const [certRequests, setCertRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState("");

  useEffect(() => {
    async function fetchRequests() {
      setLoading(true);
      const res = await axios.get(`${API_URL}/certificates?status=requested`);
      setCertRequests(res.data || []);
      setLoading(false);
    }
    fetchRequests();
  }, [API_URL]);

  const approveCertificate = async req => {
    setLoading(true);
    await axios.put(`${API_URL}/certificates/${req.id}`, {
      ...req,
      status: "completed",
      issuedDate: new Date().toISOString(),
      downloadUrl: `/certificates/${req.id}.pdf`
    });
    await sendNotification({
      type: "certificate_approved",
      to: [req.userName],
      message: `Your certificate for ${req.courseName} is ready. Please download it.`,
      relatedId: req.id,
      courseName: req.courseName,
      createdAt: new Date().toISOString(),
      status: "unread",
      forRole: "user"
    });
    setAlert(`Certificate issued to ${req.userName} - ${req.courseName}`);
    setCertRequests(prev => prev.filter(c => c.id !== req.id));
    setLoading(false);
    setTimeout(() => setAlert(""), 2000);
  };

  const deleteRequest = async req => {
    setLoading(true);
    await axios.delete(`${API_URL}/certificates/${req.id}`);
    setCertRequests(prev => prev.filter(c => c.id !== req.id));
    setAlert(`Deleted certificate request for ${req.userName} - ${req.courseName}`);
    setLoading(false);
    setTimeout(() => setAlert(""), 2000);
  };

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: 18 }}>
      <h2 style={{ fontWeight: 700, fontSize: 28, color: "#2563eb", marginBottom: 32 }}>🗂️ Pending Certificate Requests</h2>
      {alert && (
        <div style={{ background: "#a7f3d0", color: "#065f46", padding: 10, borderRadius: 7, marginBottom: 16 }}>
          <FaCheckCircle /> {alert}
        </div>
      )}
      {loading ? <div style={{ textAlign: "center", color: "#6b7280", fontSize: 18 }}><FaClock /> Loading requests...</div> : (
        certRequests.length === 0 ? (
          <div style={{ fontSize: 18, color: "#64748b", textAlign: "center" }}>No pending certificate requests.</div>
        ) : (
          <div style={{ display: "flex", flexWrap: "wrap", gap: "28px" }}>
            {certRequests.map(req => (
              <div key={req.id} style={{
                background: "#f1f5f9",
                borderRadius: 16,
                boxShadow: "0 1px 6px #cbd5e1",
                padding: 22,
                minWidth: 325,
                marginBottom: 16,
                display: "flex",
                flexDirection: "column",
                gap: 8,
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <FaUserGraduate style={{ fontSize: 26, color: "#2563eb" }} />
                  <span style={{ fontWeight: 600, fontSize: 18 }}>{req.userName}</span>
                </div>
                <div style={{ fontWeight: 500, color: "#10b981", fontSize: 16 }}>
                  {req.courseName || <span style={{ color: "#ef4444" }}>Unknown Course</span>}
                </div>
                <div style={{ color: "#78716c", fontSize: 14 }}>
                  Requested: {req.requestedDate?.slice(0, 10) || req.issuedDate?.slice(0, 10)}
                </div>
                <div style={{ display: "flex", gap: 12, marginTop: 12 }}>
                  <button style={{
                    background: "#2563eb",
                    color: "white",
                    fontWeight: 600,
                    padding: "7px 20px",
                    borderRadius: 8,
                    border: "none",
                    fontSize: 17,
                    cursor: "pointer"
                  }} onClick={() => approveCertificate(req)}>
                    <FaCheckCircle style={{ marginRight: 7 }} /> Approve & Issue
                  </button>
                  <button style={{
                    background: "#ef4444",
                    color: "white",
                    fontWeight: 600,
                    padding: "7px 20px",
                    borderRadius: 8,
                    border: "none",
                    fontSize: 17,
                    cursor: "pointer"
                  }} onClick={() => deleteRequest(req)}>
                    <FaTrash style={{ marginRight: 7 }} /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )
      )}
    </div>
  );
}
