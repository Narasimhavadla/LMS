import React from "react";

export default function Service() {
  const services = [
    {
      id: 1,
      title: "Classroom Training",
      icon: "🎓",
      description:
        "Engage in interactive sessions with expert instructors in a structured classroom environment for deeper learning and practical understanding.",
    },
    {
      id: 2,
      title: "Online Training",
      icon: "💻",
      description:
        "Learn from anywhere with live online sessions and access to recorded materials. Perfect for remote learners and flexible schedules.",
    },
    {
      id: 3,
      title: "Weekend Training",
      icon: "🗓️",
      description:
        "Specially designed weekend batches for working professionals and students balancing their weekday commitments.",
    },
    {
      id: 4,
      title: "Corporate Training",
      icon: "🏢",
      description:
        "Tailored training programs for organizations to upskill their teams in the latest technologies and business practices.",
    },
    {
      id: 5,
      title: "One-to-One Training",
      icon: "🤝",
      description:
        "Personalized learning experience with dedicated mentors guiding you at your own pace and focus areas.",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="text-center py-16 bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
        <h1 className="text-4xl font-bold mb-3">Our Training Services</h1>
        <p className="text-lg max-w-2xl mx-auto opacity-90">
          Explore our diverse range of training options designed to help you learn
          effectively, no matter your schedule or goals.
        </p>
      </section>

      {/* Services Section */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-semibold text-center mb-12 text-gray-800">
          Training Options We Offer
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((s) => (
            <div
              key={s.id}
              className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-200 p-6 flex flex-col items-center text-center border border-gray-100"
            >
              <div className="text-5xl mb-4">{s.icon}</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">{s.title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{s.description}</p>
              <button className="mt-4 px-5 py-2 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700">
                Learn More
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Interactive Section */}
      <section className="bg-white py-16 border-t border-gray-100">
        <div className="max-w-5xl mx-auto text-center px-6">
          <h2 className="text-3xl font-semibold text-gray-800 mb-4">Let's Find the Right Training for You</h2>
          <p className="text-gray-600 max-w-2xl mx-auto mb-8">
            Not sure which mode of training fits your needs best? Answer a few quick
            questions and we'll suggest the ideal program for your goals.
          </p>
          <button className="px-6 py-3 bg-purple-600 text-white rounded-xl text-sm font-medium shadow hover:bg-purple-700">
            Take the Interactive Quiz
          </button>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-semibold text-center mb-10 text-gray-800">
            Why Choose Our Services?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            <div className="bg-white rounded-xl shadow p-6 border border-gray-100">
              <h3 className="text-xl font-semibold text-indigo-600 mb-2">
                Experienced Instructors
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Learn from certified trainers with years of real-world industry
                experience and technical expertise.
              </p>
            </div>

            <div className="bg-white rounded-xl shadow p-6 border border-gray-100">
              <h3 className="text-xl font-semibold text-indigo-600 mb-2">Flexible Schedules</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                We offer weekday, weekend, and self-paced options to match your
                availability and lifestyle.
              </p>
            </div>

            <div className="bg-white rounded-xl shadow p-6 border border-gray-100">
              <h3 className="text-xl font-semibold text-indigo-600 mb-2">Hands-on Learning</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Every training program includes practical assignments, projects, and
                real-world case studies to strengthen understanding.
              </p>
            </div>

            <div className="bg-white rounded-xl shadow p-6 border border-gray-100">
              <h3 className="text-xl font-semibold text-indigo-600 mb-2">Career Support</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Get guidance for interviews, resume building, and placement support
                after course completion.
              </p>
            </div>

            <div className="bg-white rounded-xl shadow p-6 border border-gray-100">
              <h3 className="text-xl font-semibold text-indigo-600 mb-2">Affordable Pricing</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Quality education at competitive prices, ensuring high value for your
                investment.
              </p>
            </div>

            <div className="bg-white rounded-xl shadow p-6 border border-gray-100">
              <h3 className="text-xl font-semibold text-indigo-600 mb-2">Certification & Recognition</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Receive course completion certificates recognized by industry leaders
                and employers.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
