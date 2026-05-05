import React from "react";
import { Link } from "react-router-dom";
import {
  FaInstagram,
  FaFacebook,
  FaTwitter,
  FaLinkedin,
} from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-black text-white mt-20">
      <div className="max-w-6xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-2 gap-8">

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Quick Links</h3>

          <ul className="space-y-2 text-gray-400">
            <li>
              <Link to="/" className="hover:text-white">
                Home
              </Link>
            </li>

            <li>
              <Link to="/shop" className="hover:text-white">
                Shop
              </Link>
            </li>

            <li>
              <Link to="/about" className="hover:text-white">
                About
              </Link>
            </li>

            <li>
              <Link to="/profile" className="hover:text-white">
                Profile
              </Link>
            </li>
          </ul>
        </div>

        {/* Social Media */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Follow Us</h3>

          <div className="flex gap-4 text-gray-400">
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              className="hover:text-white"
            >
              <FaInstagram size={22} />
            </a>

            <a
              href="https://facebook.com"
              target="_blank"
              rel="noreferrer"
              className="hover:text-white"
            >
              <FaFacebook size={22} />
            </a>

            <a
              href="https://twitter.com"
              target="_blank"
              rel="noreferrer"
              className="hover:text-white"
            >
              <FaTwitter size={22} />
            </a>

            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noreferrer"
              className="hover:text-white"
            >
              <FaLinkedin size={22} />
            </a>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-800 text-center text-sm text-gray-500 py-4">
        © {new Date().getFullYear()} SONIQ. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
