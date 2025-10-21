import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGlobe } from "@fortawesome/free-solid-svg-icons";
import { faTwitter, faFacebook, faInstagram } from "@fortawesome/free-brands-svg-icons";

function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-10">
      <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-3 gap-8">
        <div>
          <h3 className="text-xl font-bold mb-3 text-white">LMS Portal</h3>
          <p>
            Empowering learners and educators through technology. Transforming education, one click at a time.
          </p>
        </div>
        <div>
          <h4 className="font-semibold mb-3 text-white">Quick Links</h4>
          <ul className="space-y-2">
            <li><a href="/course" className="hover:text-white">Courses</a></li>
            <li><a href="/aboutus" className="hover:text-white">About Us</a></li>
            <li><a href="/contactus" className="hover:text-white">Contact</a></li>
            <li><a href="/faq" className="hover:text-white">FAQs</a></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-3 text-white">Follow Us</h4>
          <div className="flex space-x-4 text-xl">
            <a href="#" className="hover:text-yellow-400">
              <FontAwesomeIcon icon={faGlobe} />
            </a>
            <a href="#" className="hover:text-blue-400">
              <FontAwesomeIcon icon={faTwitter} />
            </a>
            <a href="#" className="hover:text-blue-600">
              <FontAwesomeIcon icon={faFacebook} />
            </a>
            <a href="#" className="hover:text-pink-500">
              <FontAwesomeIcon icon={faInstagram} />
            </a>
          </div>
        </div>
      </div>
      <div className="text-center text-sm text-gray-500 mt-8">
        © {new Date().getFullYear()} LMS Portal. All Rights Reserved.
      </div>
    </footer>
  );
}

export default Footer;
