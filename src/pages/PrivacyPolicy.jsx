import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import {
  FaUserSecret,
  FaShieldAlt,
  FaLock,
  FaCookieBite,
  FaShareAlt,
  FaUserCheck,
  FaArrowLeft,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const PrivacyPolicy = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  // Simulasi loading selama 2 detik
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
        <Helmet>
          <title>CoffeeShopMe | Kebijakan Privasi</title>
        </Helmet>
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
        <FaUserSecret className="text-orange-500 dark:text-orange-400 text-2xl" />
      ),
      title: "Pengumpulan Informasi",
      content:
        "Kami mengumpulkan informasi pribadi yang Anda berikan, seperti nama, alamat email, dan detail pembayaran. Informasi ini membantu kami melayani Anda lebih baik dan mempersonalisasi pengalaman Anda.",
    },
    {
      icon: (
        <FaShieldAlt className="text-orange-500 dark:text-orange-400 text-2xl" />
      ),
      title: "Penggunaan Informasi",
      content:
        "Informasi Anda digunakan untuk memproses pesanan, meningkatkan layanan kami, dan mengirim materi promosi. Kami memastikan data Anda ditangani secara bertanggung jawab dan aman.",
    },
    {
      icon: (
        <FaLock className="text-orange-500 dark:text-orange-400 text-2xl" />
      ),
      title: "Keamanan Data",
      content:
        "Kami menerapkan langkah-langkah keamanan standar industri, termasuk enkripsi dan server yang aman, untuk melindungi informasi pribadi Anda. Kepercayaan dan keamanan Anda adalah prioritas utama kami.",
    },
    {
      icon: (
        <FaCookieBite className="text-orange-500 dark:text-orange-400 text-2xl" />
      ),
      title: "Cookie dan Pelacakan",
      content:
        "Website kami menggunakan cookie untuk meningkatkan pengalaman browsing Anda. Cookie membantu kami mengingat preferensi Anda, memahami perilaku pengguna, dan menyediakan konten yang relevan. Anda dapat mengatur cookie melalui pengaturan browser Anda.",
    },
    {
      icon: (
        <FaShareAlt className="text-orange-500 dark:text-orange-400 text-2xl" />
      ),
      title: "Berbagi dengan Pihak Ketiga",
      content:
        "Kami tidak menjual informasi pribadi Anda. Namun, kami mungkin berbagi data dengan mitra terpercaya yang membantu menyediakan layanan kami, dengan perjanjian kerahasiaan yang ketat untuk melindungi privasi Anda.",
    },
    {
      icon: (
        <FaUserCheck className="text-orange-500 dark:text-orange-400 text-2xl" />
      ),
      title: "Hak Anda",
      content: (
        <>
          Anda berhak mengakses, mengoreksi, atau menghapus data pribadi Anda
          kapan saja. Untuk bantuan, silakan hubungi kami di{" "}
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
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center blur-sm opacity-50"
        style={{
          backgroundImage:
            "url('https://cdn.pixabay.com/photo/2020/07/18/16/29/coffee-5417663_1280.png')",
        }}
      ></div>

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40"></div>

      {/* Content */}
      <div className="relative max-w-2xl w-full bg-white/80 dark:bg-gray-800/80 shadow-2xl backdrop-blur-lg rounded-2xl p-6">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center space-x-2 text-gray-700 dark:text-gray-300 hover:text-orange-500 dark:hover:text-orange-400 transition mb-4"
        >
          <FaArrowLeft className="text-base" />
          <span className="text-sm font-medium">Kembali</span>
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Kebijakan Privasi
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-300 mt-2 leading-relaxed">
            Privasi Anda penting bagi kami. Pelajari bagaimana kami melindungi
            data Anda dengan transparansi dan perhatian.
          </p>
        </div>

        {/* Content */}
        <div className="space-y-4">
          {sections.map((section, index) => (
            <section
              key={index}
              className="flex gap-3 items-start p-4 bg-gray-100 dark:bg-gray-700 rounded-xl shadow-md transition hover:scale-[1.02] duration-300 ease-in-out"
            >
              <div className="text-orange-500 dark:text-orange-400 text-xl">
                {section.icon}
              </div>
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

export default PrivacyPolicy;
