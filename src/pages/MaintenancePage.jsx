import React from "react";
import { Helmet } from "react-helmet";

const MaintenancePage = () => {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-indigo-600 via-purple-700 to-blue-700 p-6">
      <Helmet>
        <title>CoffeeShopMe | Maintenance</title>
      </Helmet>
      <div className="relative text-center max-w-md w-full mx-auto bg-white/10 backdrop-blur-lg rounded-3xl shadow-lg p-10 border border-white/25 dark:bg-gray-900/60 dark:border-gray-600 dark:text-gray-200">
        {/* Animasi Icon */}
        <div className="flex justify-center mb-8">
          <div className="w-24 h-24 bg-white/15 rounded-full flex items-center justify-center shadow-lg animate-pulse">
            <img
              src="/Maintenance.gif"
              alt="Maintenance"
              className="w-20 h-20 object-cover rounded-full"
            />
          </div>
        </div>

        {/* Judul */}
        <h1 className="text-4xl font-bold mb-4 text-white drop-shadow-md">
          Website Sedang Dalam Pemeliharaan
        </h1>

        {/* Deskripsi */}
        <p className="text-md text-white/80 mb-8 leading-relaxed">
          Kami sedang melakukan peningkatan untuk pengalaman yang lebih baik.
          Harap coba lagi nanti. Terima kasih atas kesabarannya.
        </p>

        {/* Tombol Refresh */}
        <button
          onClick={() => window.location.reload()}
          className="px-8 py-3 bg-white/20 text-white font-semibold rounded-xl shadow-md hover:bg-white/30 transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-white/40"
          aria-label="Reload page"
        >
          Coba Lagi
        </button>

        {/* Dekorasi Efek Cahaya */}
        <div className="pointer-events-none absolute top-0 left-0 w-36 h-36 bg-indigo-400/30 rounded-full blur-3xl opacity-30"></div>
        <div className="pointer-events-none absolute bottom-0 right-0 w-36 h-36 bg-purple-500/30 rounded-full blur-3xl opacity-30"></div>
      </div>
    </div>
  );
};

export default MaintenancePage;
