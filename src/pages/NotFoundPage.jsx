import React from "react";
import { Helmet } from "react-helmet";

const NotFoundPage = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-tr from-red-600 via-pink-600 to-purple-700 text-white px-4">
      <Helmet>
        <title>CoffeeShopMe | NotFound</title>
      </Helmet>
      <div className="text-center bg-white/10 backdrop-blur-lg p-8 rounded-2xl shadow-xl border border-white/20 max-w-sm w-full">
        <h1 className="text-6xl font-extrabold text-white drop-shadow-md mb-4">
          404
        </h1>
        <h2 className="text-2xl font-semibold mb-3">
          Oops! Halaman Tidak Ditemukan
        </h2>
        <p className="text-sm text-white/90 mb-6 leading-relaxed">
          Sepertinya halaman yang Anda cari tidak tersedia. Mari kembali ke
          halaman utama.
        </p>
        <a
          href="/home"
          className="inline-block bg-white text-pink-600 font-semibold py-2.5 px-6 rounded-full shadow-md hover:bg-pink-600 hover:text-white transition duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-pink-400"
          aria-label="Kembali ke Beranda"
        >
          Kembali ke Home
        </a>
      </div>
    </div>
  );
};

export default NotFoundPage;
