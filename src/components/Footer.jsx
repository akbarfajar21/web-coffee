import React from "react";
import "@fortawesome/fontawesome-free/css/all.min.css"; // Import Font Awesome

const Footer = () => {
  return (
    <footer className="bg-gradient-to-b from-[#2d3748] to-[#4a5568] text-white py-8 dark:text-gray-100">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          <div>
            <h3 className="text-xl font-semibold mb-4 text-[#fbbf24] dark:text-[#fbbf24]">
              About Us
            </h3>
            <p className="text-gray-300 text-sm dark:text-gray-400">
              We offer premium coffee from all over the world. Join us on an extraordinary taste journey.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-4 text-[#fbbf24] dark:text-[#fbbf24]">
              Quick Links
            </h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="/"
                  className="text-gray-300 hover:text-white text-sm dark:text-gray-400 dark:hover:text-white"
                >
                  <i className="fas fa-chevron-right mr-2"></i> Home
                </a>
              </li>
              <li>
                <a
                  href="/product"
                  className="text-gray-300 hover:text-white text-sm dark:text-gray-400 dark:hover:text-white"
                >
                  <i className="fas fa-chevron-right mr-2"></i> Product
                </a>
              </li>
              <li>
                <a
                  href="/about"
                  className="text-gray-300 hover:text-white text-sm dark:text-gray-400 dark:hover:text-white"
                >
                  <i className="fas fa-chevron-right mr-2"></i> About
                </a>
              </li>
              <li>
                <a
                  href="/privacy-policy"
                  className="text-gray-300 hover:text-white text-sm dark:text-gray-400 dark:hover:text-white"
                >
                  <i className="fas fa-chevron-right mr-2"></i> Privacy Policy
                </a>
              </li>
              <li>
                <a
                  href="/terms-of-service"
                  className="text-gray-300 hover:text-white text-sm dark:text-gray-400 dark:hover:text-white"
                >
                  <i className="fas fa-chevron-right mr-2"></i> Terms of Service
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-xl font-semibold mb-4 text-[#fbbf24] dark:text-[#fbbf24]">
              Contact
            </h3>
            <ul className="space-y-3 text-gray-300 text-sm dark:text-gray-400">
              <li>
                <i className="fas fa-envelope mr-3"></i>
                <a
                  href="mailto:akbarfajar2112@gmail.com"
                  className="hover:text-white dark:hover:text-white"
                >
                  akbarfajar2112@gmail.com
                </a>
              </li>
              <li>
                <i className="fas fa-phone mr-3"></i>
                +62 895-3355-45919
              </li>
              <li>
                <i className="fas fa-map-marker-alt mr-3"></i>
                Tambun, Bekasi, Indonesia
              </li>
            </ul>
          </div>

          {/* Follow Us */}
          <div>
            <h3 className="text-xl font-semibold mb-4 text-[#fbbf24] dark:text-[#fbbf24]">
              Follow Us
            </h3>
            <div className="flex space-x-5 text-gray-300 text-2xl dark:text-gray-400">
              <a
                href="https://wa.me/62895335545919"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-green-500 transition dark:hover:text-green-500"
              >
                <i className="fab fa-whatsapp"></i>
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-pink-500 transition dark:hover:text-pink-500"
              >
                <i className="fab fa-instagram"></i>
              </a>
              <a
                href="https://tiktok.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-black transition dark:hover:text-black"
              >
                <i className="fab fa-tiktok"></i>
              </a>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="mt-8 border-t border-[#fbbf24] pt-4 text-center dark:border-[#fbbf24]">
          <p className="text-gray-300 text-sm dark:text-gray-400">
            &copy; {new Date().getFullYear()} {" "}
            <span className="font-semibold">MyCoffee</span>. All Rights
            Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
