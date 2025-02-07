import React from "react";
import "animate.css";

const NotFoundPage = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-tr from-red-500 via-pink-500 to-purple-500 text-white px-6">
      <div className="text-center bg-white bg-opacity-10 backdrop-blur-md p-10 rounded-2xl shadow-xl border border-white/20 animate__animated animate__fadeIn">
        <h1 className="text-9xl font-extrabold text-white drop-shadow-lg animate__animated animate__fadeInDown">
          404
        </h1>
        <h2 className="text-3xl font-semibold text-white mt-4 animate__animated animate__fadeInUp animate__delay-1s">
          Oops! Halaman Tidak Ditemukan
        </h2>
        <p className="text-lg text-white mt-3 mb-6 opacity-90 animate__animated animate__fadeInUp animate__delay-2s">
          Sepertinya halaman yang Anda cari tidak tersedia. Mari kembali ke
          halaman utama.
        </p>
        <a
          href="/"
          className="inline-block bg-white text-pink-600 font-semibold py-3 px-8 rounded-full shadow-lg hover:bg-pink-600 hover:text-white transition-all duration-300 animate__animated animate__fadeInUp animate__delay-3s"
        >
          Kembali ke Beranda
        </a>
      </div>
    </div>
  );
};

export default NotFoundPage;
