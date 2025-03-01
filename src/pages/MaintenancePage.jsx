import React from "react";
import { Helmet } from "react-helmet";

const MaintenancePage = () => {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-500 via-purple-600 to-indigo-700 p-6">
      <Helmet>
        <title>CoffeeShopMe | Maintenance</title>
      </Helmet>
      <div className="relative text-center space-y-6 max-w-lg mx-auto bg-white/30 backdrop-blur-md rounded-2xl shadow-2xl p-8 border border-white/20 dark:bg-gray-900/50 dark:border-gray-700 dark:text-white">
        {/* Animasi Icon */}
        <div className="flex justify-center">
          <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center shadow-md animate-bounce">
            <img
              src="/Maintenance.gif"
              alt="Maintenance"
              className="w-16 h-16 object-cover rounded-full"
            />
          </div>
        </div>

        {/* Judul */}
        <h1 className="text-3xl font-extrabold text-white drop-shadow-lg">
          🚧 Website Sedang dalam Pemeliharaan
        </h1>

        {/* Deskripsi */}
        <p className="text-lg text-white/80">
          Kami sedang melakukan peningkatan untuk pengalaman yang lebih baik.
          Harap coba lagi nanti. Terima kasih atas kesabarannya! ☕
        </p>

        {/* Tombol Refresh */}
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-3 bg-white/20 text-white font-semibold rounded-lg shadow-lg hover:bg-white/30 transition-all duration-300 ease-in-out transform hover:scale-105"
        >
          🔄 Coba Lagi
        </button>

        {/* Dekorasi Efek Cahaya */}
        <div className="absolute top-0 left-0 w-32 h-32 bg-blue-300/40 rounded-full blur-3xl opacity-40"></div>
        <div className="absolute bottom-0 right-0 w-32 h-32 bg-purple-400/40 rounded-full blur-3xl opacity-40"></div>
      </div>
    </div>
  );
};

export default MaintenancePage;
