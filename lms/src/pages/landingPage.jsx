import React from "react";

const LandingPage = () => {
  return (
    <div className="bg-gray-50 text-gray-800">
      {/* Hero Section */}
      <section className="bg-blue-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between">
          {/* Text Content */}
          <div className="md:w-1/2 space-y-6">
            <h1 className="text-4xl md:text-5xl font-bold leading-tight">
              Learn Smarter, Not Harder — Welcome to <span className="text-yellow-300">LMS Portal</span>
            </h1>
            <p className="text-lg text-blue-100">
              Empower your learning journey with interactive courses, real-time progress tracking, and expert guidance — all in one place.
            </p>
            <div className="space-x-4">
              <button className="bg-yellow-400 text-blue-900 px-6 py-3 rounded-lg font-semibold hover:bg-yellow-300 transition">
                Get Started
              </button>
              <button className="border border-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-700 transition">
                Explore Courses
              </button>
            </div>
          </div>

          {/* Hero Image */}
          <div className="md:w-1/2 mt-10 md:mt-0">
            <img
              src="https://cdn.pixabay.com/photo/2017/01/10/19/05/student-1968078_1280.png"
              alt="Learning Illustration"
              className="w-full max-w-md mx-auto"
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-8 text-blue-700">Why Choose LMS Portal?</h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl shadow-md p-6 hover:shadow-lg transition">
              <div className="text-blue-600 text-4xl mb-4">🎓</div>
              <h3 className="font-semibold text-lg mb-2">Expert Instructors</h3>
              <p>Learn from top educators and industry professionals who guide you every step of the way.</p>
            </div>

            <div className="bg-white rounded-2xl shadow-md p-6 hover:shadow-lg transition">
              <div className="text-blue-600 text-4xl mb-4">📊</div>
              <h3 className="font-semibold text-lg mb-2">Track Your Progress</h3>
              <p>Visualize your growth with real-time analytics, scores, and performance insights.</p>
            </div>

            <div className="bg-white rounded-2xl shadow-md p-6 hover:shadow-lg transition">
              <div className="text-blue-600 text-4xl mb-4">💻</div>
              <h3 className="font-semibold text-lg mb-2">Interactive Learning</h3>
              <p>Access quizzes, assignments, and projects that make learning engaging and fun.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-700 text-white py-16">
        <div className="max-w-4xl mx-auto text-center px-6">
          <h2 className="text-3xl font-bold mb-4">Start Your Learning Journey Today!</h2>
          <p className="text-blue-100 mb-6">
            Join thousands of learners upgrading their skills with our platform. Flexible, affordable, and effective.
          </p>
          <button className="bg-yellow-400 text-blue-900 px-8 py-3 rounded-lg font-semibold hover:bg-yellow-300 transition">
            Sign Up for Free
          </button>
        </div>
      </section>

      
      
    </div>
  );
};

export default LandingPage;
