import React, { useState } from "react";

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    alert("Thank you! Your message has been sent.");
    setFormData({ name: "", email: "", subject: "", message: "" });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <header className="max-w-4xl mx-auto text-center mb-12">
        <h1 className="text-4xl font-bold text-blue-700 mb-4">Contact Us</h1>
        <p className="text-gray-600 text-lg">
          Have questions, feedback, or suggestions? We’d love to hear from you!
        </p>
      </header>

      <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8">
        {/* Contact Info */}
        <div className="bg-white rounded-xl shadow p-6 flex flex-col justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-blue-700 mb-4">Reach Us</h2>
            <p className="text-gray-700 mb-2">
              <strong>Address:</strong> 123 LMS Street, Hyderabad, India
            </p>
            <p className="text-gray-700 mb-2">
              <strong>Email:</strong> support@lmsportal.com
            </p>
            <p className="text-gray-700 mb-2">
              <strong>Phone:</strong> +91 98765 43210
            </p>
          </div>

          <div className="mt-6">
            <h2 className="text-xl font-semibold text-blue-700 mb-2">Follow Us</h2>
            <div className="flex space-x-4">
              <a href="#" className="text-blue-600 hover:text-blue-800">Facebook</a>
              <a href="#" className="text-blue-600 hover:text-blue-800">Twitter</a>
              <a href="#" className="text-blue-600 hover:text-blue-800">LinkedIn</a>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="bg-white rounded-xl shadow p-6">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Your Name"
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Your Email"
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
            <input
              type="text"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              placeholder="Subject"
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Your Message"
              rows="5"
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
            >
              Send Message
            </button>
          </form>
        </div>
      </div>

      {/* Map placeholder */}
      <div className="max-w-5xl mx-auto mt-12">
        <iframe
          title="LMS Location"
          src="https://maps.google.com/maps?q=Hyderabad&t=&z=13&ie=UTF8&iwloc=&output=embed"
          className="w-full h-64 rounded-xl shadow"
        ></iframe>
      </div>
    </div>
  );
};

export default ContactUs;
