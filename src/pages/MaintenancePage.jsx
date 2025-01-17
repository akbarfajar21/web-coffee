import React from "react";

const MaintenancePage = () => {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-900 bg-opacity-75 p-4">
      <div className="text-center space-y-6 text-white">
        <img
          src="/Maintenance.gif"
          alt="Maintenance"
          className="w-60 h-60 mx-auto mb-6 rounded-xl"
        />
        <h1 className="text-4xl font-extrabold">Website CoffeeShopMe sedang dalam Maintenance</h1>
        <p className="text-lg">
          Kami sedang melakukan pemeliharaan untuk memberikan pengalaman yang lebih baik. Harap coba lagi nanti.
        </p>
        <div>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-md shadow-lg hover:bg-indigo-700 focus:outline-none"
          >
            Coba Lagi
          </button>
        </div>
      </div>
    </div>
  );
};

export default MaintenancePage;
