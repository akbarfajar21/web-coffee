import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import {
  FaArrowLeft,
  FaGlobe,
  FaUserShield,
  FaGavel,
  FaCopyright,
  FaExclamationTriangle,
  FaSyncAlt,
  FaEnvelope,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const TermsOfService = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  // Simulasikan loading selama 2 detik
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
        <div className="relative flex items-center justify-center">
          <div className="absolute -top-8 flex space-x-2">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-2 h-6 bg-gray-400 opacity-50 rounded-full animate-steam"
                style={{ animationDelay: `${i * 0.2}s` }}
              ></div>
            ))}
          </div>

          <div className="relative w-20 h-16 bg-gradient-to-b from-orange-500 to-orange-700 rounded-t-full flex items-end justify-center shadow-lg glow-effect">
            <div className="absolute bottom-0 w-16 h-12 bg-white dark:bg-gray-800 rounded-t-full"></div>
          </div>

          <div className="absolute right-[-10px] top-[6px] w-5 h-5 border-4 border-orange-500 rounded-full"></div>
        </div>

        <p className="text-gray-600 dark:text-gray-300 mt-4 text-lg font-semibold animate-fade-in">
          Memuat...
        </p>
      </div>
    );
  }

  const sections = [
    {
      icon: (
        <FaGlobe className="text-orange-500 dark:text-orange-400 text-2xl" />
      ),
      title: "Penggunaan Situs",
      content:
        "Situs dan layanan kami hanya diperuntukkan untuk penggunaan pribadi dan non-komersial. Anda setuju untuk menggunakan situs secara bertanggung jawab dan mematuhi hukum serta peraturan yang berlaku. Penyalahgunaan atau akses tanpa izin dapat berakibat tindakan hukum.",
    },
    {
      icon: (
        <FaUserShield className="text-orange-500 dark:text-orange-400 text-2xl" />
      ),
      title: "Tanggung Jawab Akun",
      content:
        "Anda bertanggung jawab menjaga kerahasiaan akun dan kata sandi Anda. Segera beri tahu kami jika terjadi akses tidak sah atau pelanggaran keamanan. Kami tidak bertanggung jawab atas kerugian akibat kelalaian Anda dalam menjaga akun.",
    },
    {
      icon: (
        <FaGavel className="text-orange-500 dark:text-orange-400 text-2xl" />
      ),
      title: "Penghentian",
      content:
        "Kami berhak menghentikan atau menangguhkan akses layanan tanpa pemberitahuan sebelumnya atas alasan apapun, termasuk pelanggaran ketentuan atau aktivitas ilegal.",
    },
    {
      icon: (
        <FaCopyright className="text-orange-500 dark:text-orange-400 text-2xl" />
      ),
      title: "Kekayaan Intelektual",
      content:
        "Semua konten di situs ini, termasuk teks, gambar, logo, dan perangkat lunak, merupakan kekayaan intelektual milik MyCoffee atau pemegang lisensinya. Penggunaan atau reproduksi tanpa izin dilarang keras.",
    },
    {
      icon: (
        <FaExclamationTriangle className="text-orange-500 dark:text-orange-400 text-2xl" />
      ),
      title: "Batasan Tanggung Jawab",
      content:
        "Sesuai dengan hukum yang berlaku, MyCoffee tidak bertanggung jawab atas kerugian yang timbul dari penggunaan layanan kami, baik langsung, tidak langsung, maupun insidental. Gunakan layanan kami dengan risiko Anda sendiri.",
    },
    {
      icon: (
        <FaSyncAlt className="text-orange-500 dark:text-orange-400 text-2xl" />
      ),
      title: "Perubahan Ketentuan",
      content:
        "Kami berhak memperbarui Ketentuan Layanan ini kapan saja. Penggunaan layanan secara terus-menerus setelah perubahan berarti Anda menerima ketentuan yang diperbarui.",
    },
    {
      icon: (
        <FaEnvelope className="text-orange-500 dark:text-orange-400 text-2xl" />
      ),
      title: "Hubungi Kami",
      content: (
        <>
          Jika Anda memiliki pertanyaan atau kekhawatiran terkait ketentuan ini,
          silakan hubungi kami di{" "}
          <a
            href="mailto:akbarfajar2112@gmail.com"
            className="text-blue-500 hover:underline"
          >
            akbarfajar2112@gmail.com
          </a>
          .
        </>
      ),
    },
  ];

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 bg-gray-900">
      <Helmet>
        <title>CoffeeShopMe | Ketentuan Layanan</title>
      </Helmet>

      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center blur-sm opacity-40"
        style={{
          backgroundImage:
            "url('https://cdn.pixabay.com/photo/2020/07/18/16/29/coffee-5417663_1280.png')",
        }}
      ></div>

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50"></div>

      {/* Content */}
      <div className="relative max-w-2xl w-full bg-white/80 dark:bg-gray-800/80 shadow-2xl backdrop-blur-lg rounded-2xl p-6">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center space-x-2 text-gray-700 dark:text-gray-300 hover:text-orange-500 dark:hover:text-orange-400 transition mb-4 text-sm"
        >
          <FaArrowLeft className="text-base" />
          <span>Kembali</span>
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Ketentuan Layanan
          </h1>
          <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">
            Harap baca ketentuan ini dengan seksama sebelum menggunakan layanan
            kami.
          </p>
        </div>

        {/* Content Sections */}
        <div className="space-y-4">
          {sections.map((section, index) => (
            <section
              key={index}
              className="flex gap-3 items-start p-4 bg-gray-100 dark:bg-gray-700 rounded-lg shadow transition hover:scale-[1.02] duration-200"
            >
              <div className="text-orange-500 text-lg">{section.icon}</div>
              <div>
                <h2 className="text-base font-semibold text-gray-800 dark:text-gray-200">
                  {section.title}
                </h2>
                <p className="text-sm text-gray-700 dark:text-gray-400 leading-relaxed">
                  {section.content}
                </p>
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;
