import React from "react";

const MaintenancePage = () => {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-indigo-600 to-indigo-800 p-6">
      <div className="text-center space-y-8 max-w-lg mx-auto bg-white rounded-lg shadow-xl p-8 dark:bg-gray-800 dark:text-white">
        <img
          src="/Maintenance.gif"
          alt="Maintenance"
          className="w-48 h-48 mx-auto mb-6 rounded-xl shadow-lg"
        />
        <h1 className="text-3xl font-extrabold text-indigo-800 dark:text-indigo-400">
          Website CoffeeShopMe Sedang dalam Pemeliharaan
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          Kami sedang melakukan pemeliharaan untuk memberikan pengalaman yang
          lebih baik. Harap coba lagi nanti.
        </p>
        <div>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-md shadow-lg hover:bg-indigo-700 focus:outline-none transition-all duration-300 ease-in-out transform hover:scale-105"
          >
            Coba Lagi
          </button>
        </div>
      </div>
    </div>
  );
};

export default MaintenancePage;
