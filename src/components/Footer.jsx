import React from "react";
import "@fortawesome/fontawesome-free/css/all.min.css";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-6 text-sm">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div>
            <h3 className="font-semibold mb-2 text-yellow-400">About Us</h3>
            <p className="text-gray-400 leading-snug">
              Premium coffee from around the world. Join us for an extraordinary
              taste journey.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-2 text-yellow-400">Quick Links</h3>
            <ul className="space-y-2">
              {[
                "Home",
                "Product",
                "About",
                "Privacy Policy",
                "Terms of Service",
              ].map((item, index) => (
                <li key={index}>
                  <a
                    href={`/${item.toLowerCase().replace(/ /g, "-")}`}
                    className="text-gray-400 hover:text-white"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-2 text-yellow-400">Contact</h3>
            <ul className="space-y-2 text-gray-400">
              <li>
                <i className="fas fa-envelope mr-2"></i>
                <a
                  href="mailto:akbarfajar2112@gmail.com"
                  className="hover:text-white"
                >
                  akbarfajar2112@gmail.com
                </a>
              </li>
              <li>
                <i className="fas fa-phone mr-2"></i>
                +62 895-3355-45919
              </li>
              <li>
                <i className="fas fa-map-marker-alt mr-2"></i>
                Tambun, Bekasi, Indonesia
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-2 text-yellow-400">Follow Us</h3>
            <div className="flex space-x-4 text-lg">
              <a
                href="https://wa.me/62895335545919"
                className="hover:text-green-500"
              >
                <i className="fab fa-whatsapp"></i>
              </a>
              <a href="https://instagram.com" className="hover:text-pink-500">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="https://tiktok.com" className="hover:text-black">
                <i className="fab fa-tiktok"></i>
              </a>
            </div>
          </div>
        </div>

        <div className="mt-6 border-t border-gray-700 pt-4 text-center">
          <p className="text-gray-400">
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
