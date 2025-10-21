import React, { useState } from "react";

const FAQ = () => {
  const faqs = [
    {
      question: "How do I enroll in a course?",
      answer:
        "You can browse courses on the Courses page and click the 'Enroll' button on the course you wish to join.",
    },
    {
      question: "Can I access courses offline?",
      answer:
        "Currently, offline access is not available. You need an internet connection to view course content.",
    },
    {
      question: "How can I reset my password?",
      answer:
        "Go to the Login page and click on 'Forgot Password'. Follow the instructions to reset your password.",
    },
    {
      question: "Do you provide certificates for completed courses?",
      answer:
        "Yes! After successfully completing a course, you can download your certificate from the 'Certificate' section.",
    },
    {
      question: "How do I contact support?",
      answer:
        "You can contact us using the Contact Us page or send an email to support@lmsportal.com.",
    },
  ];

  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <header className="max-w-4xl mx-auto text-center mb-12">
        <h1 className="text-4xl font-bold text-blue-700 mb-4">Frequently Asked Questions</h1>
        <p className="text-gray-600 text-lg">
          Find answers to the most common questions about our LMS portal.
        </p>
      </header>

      <main className="max-w-4xl mx-auto space-y-4">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="bg-white rounded-xl shadow cursor-pointer"
            onClick={() => toggleFAQ(index)}
          >
            <div className="p-4 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-800">{faq.question}</h2>
              <span className="text-blue-600 text-xl">
                {openIndex === index ? "-" : "+"}
              </span>
            </div>
            {openIndex === index && (
              <div className="px-4 pb-4 text-gray-700 text-sm">
                {faq.answer}
              </div>
            )}
          </div>
        ))}
      </main>
    </div>
  );
};

export default FAQ;
