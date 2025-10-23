import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { useParams } from "react-router-dom";
import { FaUser, FaPhone, FaEnvelope } from "react-icons/fa";

export default function ContactAdvisor() {
  const { id } = useParams(); // course id from URL
  const [course, setCourse] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
  });
  const [loading, setLoading] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await axios.get(`${API_URL}/courses/${id}`);
        setCourse(res.data);
      } catch (error) {
        console.error("Error fetching course:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCourse();
  }, [id]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const filledDate = new Date().toLocaleDateString("en-GB"); // ✅ still included
    const payload = { ...formData, courseName: course?.title, filledDate };

    try {
      await axios.post(`${API_URL}/enrollments`, payload);
      setSubmitted(true);
      setFormData({ name: "", phone: "", email: "" });
    } catch (error) {
      console.error("Error submitting contact form:", error);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen text-lg text-gray-500">
        Loading course info...
      </div>
    );

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-blue-50 p-6">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white shadow-2xl rounded-2xl p-10 max-w-lg w-full border-t-4 border-blue-600"
      >
        <h2 className="text-3xl font-bold text-center mb-6 text-blue-700">
          Contact Course Advisor
        </h2>
        <p className="text-center text-gray-600 mb-8">
          Get personalized guidance for{" "}
          <span className="font-semibold text-blue-700">{course?.title}</span>
        </p>

        {submitted ? (
          <div className="text-center text-green-600 font-medium">
            ✅ Thank you! Our advisor will contact you soon.
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-5 text-gray-700"
          >
            <div className="relative">
              <FaUser className="absolute left-3 top-3 text-blue-500" />
              <input
                type="text"
                name="name"
                placeholder="Your Name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
              />
            </div>

            <div className="relative">
              <FaPhone className="absolute left-3 top-3 text-blue-500" />
              <input
                type="tel"
                name="phone"
                placeholder="Phone Number"
                value={formData.phone}
                onChange={handleChange}
                required
                pattern="[0-9]{10}"
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
              />
            </div>

            <div className="relative">
              <FaEnvelope className="absolute left-3 top-3 text-blue-500" />
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              type="submit"
              className="bg-blue-700 text-white py-3 rounded-lg font-semibold hover:bg-blue-800 transition-all"
            >
              Submit Request
            </motion.button>
          </form>
        )}
      </motion.div>
    </div>
  );
}
