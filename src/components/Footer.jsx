import React from "react";
import "@fortawesome/fontawesome-free/css/all.min.css";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-t from-gray-100 to-white dark:from-gray-900 dark:to-gray-800 text-sm text-neutral-700 dark:text-neutral-300 py-12  border-t border-neutral-200 dark:border-neutral-700">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-bold mb-3 text-orange-600 dark:text-orange-400">
              About Us
            </h3>
            <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
              Premium coffee sourced globally. Join us and indulge in a journey
              of exquisite taste.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-3 text-orange-600 dark:text-orange-400">
              Quick Links
            </h3>
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
                    className="hover:text-orange-500 dark:hover:text-orange-400 transition-colors duration-200"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-3 text-orange-600 dark:text-orange-400">
              Contact
            </h3>
            <ul className="space-y-3 text-neutral-600 dark:text-neutral-400">
              <li className="flex items-center">
                <i className="fas fa-envelope mr-2 text-orange-500"></i>
                <a
                  href="mailto:akbarfajar2112@gmail.com"
                  className="hover:text-orange-500 dark:hover:text-orange-400"
                >
                  akbarfajar2112@gmail.com
                </a>
              </li>
              <li className="flex items-center">
                <i className="fas fa-phone mr-2 text-orange-500"></i>
                +62 895-3355-45919
              </li>
              <li className="flex items-center">
                <i className="fas fa-map-marker-alt mr-2 text-orange-500"></i>
                Tambun, Bekasi, Indonesia
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-3 text-orange-600 dark:text-orange-400">
              Follow Us
            </h3>
            <div className="flex space-x-4 text-xl">
              <a
                href="https://wa.me/62895335545919"
                className="hover:text-green-500 transition-colors"
              >
                <i className="fab fa-whatsapp"></i>
              </a>
              <a
                href="https://instagram.com/pjarrr.rr"
                className="hover:text-pink-500 transition-colors"
              >
                <i className="fab fa-instagram"></i>
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-6 text-center border-t border-neutral-200 dark:border-neutral-700">
          <p className="text-neutral-500 dark:text-neutral-400 text-sm">
            &copy; {new Date().getFullYear()}{" "}
            <span className="font-semibold text-orange-600 dark:text-orange-400">
              CoffeeShopMe
            </span>
            . All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
