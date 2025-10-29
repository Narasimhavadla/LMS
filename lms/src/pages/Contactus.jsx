import React, { useState } from "react";
import { sendNotification } from "../Components/notificationsApi";

const ContactUs = () => {
  const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" });
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess(""); setError("");
    try {
      // Send contact data to API (your real backend endpoint here)
      // await axios.post("/api/contactus", formData);
      await sendNotification({
        type: "contact_form_submitted",
        from: formData.name,
        to: ["admin"],
        message: `Contact form submitted by ${formData.name} (${formData.email}): ${formData.subject}`,
        createdAt: new Date().toISOString(),
        status: "unread",
        forRole: "admin"
      });
      setSuccess("Thank you! Your message has been sent.");
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch {
      setError("Send failed. Please try again later.");
    }
  };

  return (
    <div>
      <h3>Contact Us</h3>
      {success && <div style={{ color: "green" }}>{success}</div>}
      {error && <div style={{ color: "red" }}>{error}</div>}
      <form onSubmit={handleSubmit}>
        <input name="name" value={formData.name} onChange={handleChange} placeholder="Name" required />
        <input name="email" value={formData.email} onChange={handleChange} placeholder="Email" type="email" required />
        <input name="subject" value={formData.subject} onChange={handleChange} placeholder="Subject" required />
        <textarea name="message" value={formData.message} onChange={handleChange} placeholder="Message" required />
        <button type="submit">Send</button>
      </form>
    </div>
  );
};

export default ContactUs;
