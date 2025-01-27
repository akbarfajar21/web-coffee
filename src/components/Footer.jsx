import React from "react";
import "@fortawesome/fontawesome-free/css/all.min.css"; // Import Font Awesome

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About Us */}
          <div>
            <h3 className="text-lg font-bold mb-4 text-yellow-400">About Us</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              We offer premium coffee from all over the world. Join us on an
              extraordinary taste journey.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-4 text-yellow-400">
              Quick Links
            </h3>
            <ul className="space-y-3 text-sm">
              {[
                { href: "/", label: "Home" },
                { href: "/product", label: "Product" },
                { href: "/about", label: "About" },
                { href: "/privacy-policy", label: "Privacy Policy" },
                { href: "/terms-of-service", label: "Terms of Service" },
              ].map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-gray-400 hover:text-white flex items-center transition"
                  >
                    <i className="fas fa-chevron-right mr-2"></i>
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-bold mb-4 text-yellow-400">Contact</h3>
            <ul className="space-y-3 text-sm text-gray-400">
              <li className="flex items-center">
                <i className="fas fa-envelope mr-3"></i>
                <a
                  href="mailto:akbarfajar2112@gmail.com"
                  className="hover:text-white transition"
                >
                  akbarfajar2112@gmail.com
                </a>
              </li>
              <li className="flex items-center">
                <i className="fas fa-phone mr-3"></i>
                +62 895-3355-45919
              </li>
              <li className="flex items-center">
                <i className="fas fa-map-marker-alt mr-3"></i>
                Tambun, Bekasi, Indonesia
              </li>
            </ul>
          </div>

          {/* Follow Us */}
          <div>
            <h3 className="text-lg font-bold mb-4 text-yellow-400">
              Follow Us
            </h3>
            <div className="flex space-x-6 text-gray-400 text-2xl">
              <a
                href="https://wa.me/62895335545919"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-green-500 transition"
              >
                <i className="fab fa-whatsapp"></i>
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-pink-500 transition"
              >
                <i className="fab fa-instagram"></i>
              </a>
              <a
                href="https://tiktok.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-black transition"
              >
                <i className="fab fa-tiktok"></i>
              </a>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="mt-12 border-t border-gray-700 pt-6 text-center">
          <p className="text-gray-400 text-sm">
            &copy; {new Date().getFullYear()}{" "}
            <span className="font-semibold text-white">MyCoffee</span>. All
            Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
