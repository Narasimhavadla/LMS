import React, { useState } from "react";

// ---------------- Sample Certificate Data ----------------
const sampleCertificates = [
{
id: 1,
courseTitle: "React Fundamentals",
studentName: "Lakshmi Narasimha",
joinDate: "2024-08-01",
completionDate: "2024-09-15",
issued: true,
},
{
id: 2,
courseTitle: "Core Java",
studentName: "Lakshmi Narasimha",
joinDate: "2024-07-10",
completionDate: "2024-09-01",
issued: true,
},
{
id: 3,
courseTitle: "Python Essentials",
studentName: "Lakshmi Narasimha",
joinDate: "2024-09-01",
completionDate: "",
issued: false,
},
];

export default function StudentCertificates({ userName = "Lakshmi Narasimha" }) {
const [certificates] = useState(
sampleCertificates.filter((c) => c.studentName === userName)
);

// Download certificate as a text file (can later be replaced with a PDF)
function downloadCertificate(cert) {
if (!cert.issued) {
alert("Certificate not yet issued for this course.");
return;
}
const content = `
🎓 Certificate of Completion 🎓

This is to certify that ${cert.studentName} has successfully completed
the course titled "${cert.courseTitle}".

📅 Date of Joining: ${cert.joinDate}
✅ Date of Completion: ${cert.completionDate}

Congratulations on your achievement!
`;

const blob = new Blob([content], { type: "text/plain" });
const url = URL.createObjectURL(blob);
const a = document.createElement("a");
a.href = url;
a.download = `${cert.courseTitle.replace(/\s+/g, "_")}_Certificate.txt`;
document.body.appendChild(a);
a.click();
a.remove();
URL.revokeObjectURL(url);

alert(`✅ Certificate for "${cert.courseTitle}" downloaded successfully!`);
}

return (
<div className="p-6 bg-slate-50 min-h-screen">
<div className="max-w-6xl mx-auto">
<h1 className="text-3xl font-bold text-indigo-700 mb-6">
My Certificates
</h1>
    {certificates.length === 0 ? (
      <div className="text-center text-slate-600 py-10 bg-white shadow-sm rounded-lg">
        No courses enrolled yet.
      </div>
    ) : (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {certificates.map((cert) => (
          <div
            key={cert.id}
            className="border rounded-xl bg-white p-5 shadow hover:shadow-md transition"
          >
            <h3 className="text-lg font-semibold text-gray-800">
              {cert.courseTitle}
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              Date of Joining: {cert.joinDate}
            </p>
            <p className="text-sm text-gray-600">
              Completion Date:{" "}
              {cert.completionDate ? cert.completionDate : "Not Completed"}
            </p>

            {cert.issued ? (
              <button
                onClick={() => downloadCertificate(cert)}
                className="mt-4 w-full px-3 py-2 bg-green-600 text-white rounded-md text-sm hover:bg-green-700 transition"
              >
                Download Certificate
              </button>
            ) : (
              <button
                disabled
                className="mt-4 w-full px-3 py-2 bg-gray-400 text-white rounded-md text-sm cursor-not-allowed"
              >
                Certificate Pending
              </button>
            )}
          </div>
        ))}
      </div>
    )}
  </div>
</div>
);
}