import React from "react";
import "animate.css";

const NotFoundPage = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-tr from-red-600 via-pink-600 to-pink-500 text-white">
      <div className="text-center">
        <h1 className="text-8xl font-extrabold text-white mb-4 animate__animated animate__fadeIn">
          404
        </h1>
        <h2 className="text-3xl font-semibold text-white mb-6 animate__animated animate__fadeIn animate__delay-1s">
          Halaman Tidak Ditemukan
        </h2>
        <p className="text-lg text-white mb-6 animate__animated animate__fadeIn animate__delay-2s">
          Maaf, halaman yang Anda cari tidak ada. Cobalah navigasi kembali ke
          halaman utama.
        </p>
        <a
          href="/"
          className="bg-blue-500 text-white font-semibold py-2 px-6 rounded-lg shadow-lg hover:bg-blue-600 transition-all duration-300"
        >
          Kembali
        </a>
      </div>
    </div>
  );
};

export default NotFoundPage;
