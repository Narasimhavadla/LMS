import React from "react";
import { Link } from "react-router-dom";

const AboutUs = () => {
  const teamMembers = [
    {
      name: "Sai prasad",
      role: "Frontend Developer",
      img: "https://picsum.photos/seed/lakshmi/200/200",
    },
    {
      name: "john doe",
      role: "Backend Developer",
      img: "https://picsum.photos/seed/naini/200/200",
    },
    {
      name: "Virata kohli",
      role: "Machine Learning Engineer",
      img: "https://picsum.photos/seed/kumar/200/200",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <header className="max-w-7xl mx-auto text-center mb-12">
        <h1 className="text-4xl font-bold text-blue-700 mb-4">About Us</h1>
        <p className="text-gray-600 text-lg">
          Welcome to our LMS Portal! We empower learners to gain skills, track progress, and achieve their goals.
        </p>
      </header>

      <section className="max-w-5xl mx-auto mb-12">
        <div className="grid md:grid-cols-2 gap-6 items-center">
          <img
            src="https://picsum.photos/seed/learning/600/400"
            alt="Learning"
            className="rounded-xl shadow-lg"
          />
          <div>
            <h2 className="text-3xl font-semibold text-blue-700 mb-4">Our Mission</h2>
            <p className="text-gray-700 mb-4">
              Our mission is to provide quality online education to learners worldwide. We aim to create a platform where knowledge meets opportunity.
            </p>
            <h2 className="text-3xl font-semibold text-blue-700 mb-4">Our Vision</h2>
            <p className="text-gray-700">
              To be the most accessible and interactive learning platform, enabling students to reach their full potential through technology-driven education.
            </p>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto mb-12 text-center">
        <h2 className="text-3xl font-semibold text-blue-700 mb-8">Meet the Team</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {teamMembers.map((member) => (
            <div
              key={member.name}
              className="bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-200"
            >
              <img
                src={member.img}
                alt={member.name}
                className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
              />
              <h3 className="text-xl font-semibold text-gray-800">{member.name}</h3>
              <p className="text-gray-600">{member.role}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-3xl mx-auto text-center">
        <h2 className="text-3xl font-semibold text-blue-700 mb-4">Get in Touch</h2>
        <p className="text-gray-700 mb-6">
          Have questions or feedback? Contact us and we’ll be happy to help.
        </p>
        <Link to={'/contactus'} className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition">
          Contact Us
        </Link>
      </section>
    </div>
  );
};

export default AboutUs;
