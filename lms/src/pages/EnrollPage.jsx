import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";  // ⬅️ added useNavigate
import axios from "axios";
import { FaCheckCircle, FaRegCheckCircle, FaClock, FaStar } from "react-icons/fa";
import { motion } from "framer-motion";

export default function EnrollPage() {
  const { id } = useParams();
  const navigate = useNavigate(); // ⬅️ initialize navigate
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);

  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await axios.get(`${API_URL}/courses/${id}`);
        setCourse(res.data);
      } catch (err) {
        console.error("Error fetching course:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCourse();
  }, [id]);

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen text-gray-600 text-xl font-semibold">
        Loading course details...
      </div>
    );

  if (!course)
    return (
      <div className="flex items-center justify-center h-screen text-red-500 text-xl font-semibold">
        Course not found!
      </div>
    );

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col items-center py-12 px-4">
      <div className="max-w-6xl w-full bg-white shadow-xl rounded-2xl p-10 flex flex-col md:flex-row items-center justify-between gap-10">
        
        {/* Left Section */}
        <motion.div
          initial={{ opacity: 0, x: -60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="flex-1"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-6">
            {course.title || "Java Training & Certification"}
          </h1>

          {/* Modules */}
          <ul className="space-y-2 mb-6">
            {[
              "Fundamentals of IT & AI",
              "Core Java",
              "Advanced Java Development",
              "Spring Boot & Microservices",
              "Cloud & DevOps for Java",
              "Gen AI & AI Agents",
            ].map((item, idx) => (
              <li key={idx} className="flex items-center gap-2 text-gray-800">
                <span className="text-green-500 text-sm">
                  <FaCheckCircle />
                </span>
                {item}
              </li>
            ))}
          </ul>

          {/* Features */}
          <ul className="space-y-2 mb-8">
            {[
              "Realtime Classroom Training",
              "Project and Task Based",
              "6 to 8 Hrs Every Day",
              "Interviews, Jobs & Placement Support",
              "Communication & Personality Development",
              "Interview Preparations",
            ].map((item, idx) => (
              <li key={idx} className="flex items-center gap-2 text-gray-700">
                <FaRegCheckCircle className="text-blue-600" /> {item}
              </li>
            ))}
          </ul>

          {/* Stats */}
          <div className="flex flex-wrap gap-6 items-center mb-8 text-gray-800">
            <div>
              <p className="text-2xl font-bold text-blue-700">50,000+</p>
              <p className="text-sm">Students Enrolled</p>
            </div>
            <div className="flex items-center gap-2">
              <FaStar className="text-yellow-400" />
              <p className="text-2xl font-bold">4.7</p>
              <span className="text-sm text-gray-500">(500 Ratings)</span>
            </div>
            <div className="flex items-center gap-2">
              <FaClock className="text-blue-600" />
              <p className="text-lg font-semibold">60 Days Duration</p>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex flex-wrap gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              className="bg-blue-700 text-white px-6 py-3 rounded-lg shadow hover:bg-blue-800 transition-all"
              onClick={() => navigate(`/contactadvisor/${id}`)}
            >
              Schedule Online Demo
            </motion.button>

            {/* ✅ Updated Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              className="border-2 border-blue-700 text-blue-700 px-6 py-3 rounded-lg hover:bg-blue-50 transition-all"
              onClick={() => navigate(`/contactadvisor/${id}`)} // navigate to course-specific advisor page
            >
              Contact Course Adviser
            </motion.button>
          </div>
        </motion.div>

        {/* Right Section */}
        <motion.div
          initial={{ opacity: 0, x: 60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="flex-1 flex justify-center"
        >
          <img
            src={course.img || "/java-illustration.png"}
            alt="Course illustration"
            className="max-w-md w-full object-contain"
          />
        </motion.div>
      </div>
    </div>
  );
}
