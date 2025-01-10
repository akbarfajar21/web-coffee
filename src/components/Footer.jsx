import React from "react";
import "@fortawesome/fontawesome-free/css/all.min.css"; // Import Font Awesome

const Footer = () => {
  return (
    <footer className="bg-gradient-to-b from-[#3e2723] to-[#4e342e] text-white py-6">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Tentang Kami */}
          <div>
            <h3 className="text-xl font-semibold mb-4 text-[#ff6632]">Tentang Kami</h3>
            <p className="text-gray-300 text-sm">
              Kami menyediakan kopi premium dari seluruh dunia. Bergabunglah dengan kami dalam perjalanan rasa yang luar biasa.
            </p>
          </div>

          {/* Tautan Cepat */}
          <div>
            <h3 className="text-xl font-semibold mb-4 text-[#ff6632]">Tautan Cepat</h3>
            <ul className="space-y-3">
              <li>
                <a href="/" className="text-gray-300 hover:text-white text-sm">
                  <i className="fas fa-chevron-right mr-2"></i> Home
                </a>
              </li>
              <li>
                <a href="/product" className="text-gray-300 hover:text-white text-sm">
                  <i className="fas fa-chevron-right mr-2"></i> Product
                </a>
              </li>
              <li>
                <a href="/about" className="text-gray-300 hover:text-white text-sm">
                  <i className="fas fa-chevron-right mr-2"></i> About
                </a>
              </li>
            </ul>
          </div>

          {/* Kontak */}
          <div>
            <h3 className="text-xl font-semibold mb-4 text-[#ff6632]">Kontak</h3>
            <ul className="space-y-3 text-gray-300 text-sm">
              <li>
                <i className="fas fa-envelope mr-3"></i>
                <a href="mailto:akbarfajar2112@gmail.com" className="hover:text-white">
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

          {/* Ikuti Kami */}
          <div>
            <h3 className="text-xl font-semibold mb-4 text-[#ff6632]">Ikuti Kami</h3>
            <div className="flex space-x-5 text-gray-300 text-xl">
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
        <div className="mt-8 border-t border-[#ff6632] pt-4 text-center">
          <p className="text-gray-300 text-sm">
            &copy; {new Date().getFullYear()} <span className="font-semibold">MyCoffee</span>. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
