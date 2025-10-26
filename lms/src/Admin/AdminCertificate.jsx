import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaCheckCircle } from "react-icons/fa";
export default function CertificateRequestsAdmin() {
  const API_URL = import.meta.env.VITE_API_URL;
  const [certRequests, setCertRequests] = useState([]);
  useEffect(() => {
    axios.get(`${API_URL}/certificates?status=requested`).then(res => setCertRequests(res.data || []));
  }, [API_URL]);
  const approveCertificate = async req => {
    // Normally you would generate a real certificate file/url
    await axios.put(`${API_URL}/certificates/${req.id}`, {
      ...req,
      status: "completed",
      issuedDate: new Date().toISOString(),
      downloadUrl: "/certificates/" + req.id + ".pdf"
    });
    setCertRequests(prev => prev.filter(c => c.id !== req.id));
    alert("Certificate approved and issued!");
  };
  return (
    <div className="max-w-3xl mx-auto bg-white rounded-xl shadow p-8">
      <h2 className="text-xl font-bold mb-6">Certificate Requests</h2>
      {certRequests.length === 0 ? (
        <div className="text-gray-600">No pending requests.</div>
      ) : (
        <table className="w-full text-sm">
          <thead>
            <tr>
              <th className="p-2">Student</th>
              <th className="p-2">Course</th>
              <th className="p-2">Request Date</th>
              <th className="p-2"></th>
            </tr>
          </thead>
          <tbody>
            {certRequests.map(req => (
              <tr key={req.id} className="hover:bg-blue-50">
                <td className="p-2 font-semibold">{req.userName}</td>
                <td className="p-2">{req.courseName}</td>
                <td className="p-2">{req.requestedDate || req.issuedDate?.slice(0, 10)}</td>
                <td className="p-2">
                  <button
                    className="bg-green-600 text-white rounded px-4 py-1 flex items-center gap-1 hover:bg-green-900"
                    onClick={() => approveCertificate(req)}
                  >
                    <FaCheckCircle /> Approve & Issue
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
