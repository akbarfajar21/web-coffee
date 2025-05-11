import React from "react";
import Swal from "sweetalert2";

const QuantityControl = ({ quantity, stok, onIncrease, onDecrease }) => {
  const handleIncrease = () => {
    if (quantity < stok) {
      onIncrease(); // Hanya tambah jika belum mencapai stok maksimal
    } else {
      Swal.fire({
        title: "Insufficient Stock",
        text: "You cannot increase the quantity further.",
        icon: "error", // Using the error icon from SweetAlert2
        confirmButtonText: "OK, Got it",
        background: "#FFFFFF",
        color: "#333333", // Darker text for better readability
        confirmButtonColor: "#EF4444", // Red confirm button color
        customClass: {
          popup: "rounded-xl shadow-xl backdrop-blur-lg border border-gray-300", // Modern popup design
          confirmButton:
            "px-6 py-3 rounded-lg text-lg font-semibold transition-all transform hover:scale-105", // Smooth transition and hover effect for the button
        },
      });
    }
  };

  return (
    <div className="flex items-center space-x-2 sm:space-x-3 mt-3">
      <button
        onClick={onDecrease}
        className="flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-md shadow-sm hover:bg-gray-300 dark:hover:bg-gray-600 transition-all duration-200 active:scale-90"
      >
        −
      </button>
      <span className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white min-w-[30px] text-center">
        {quantity || 0}
      </span>
      <button
        onClick={handleIncrease}
        className="flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 bg-orange-500 text-white rounded-md shadow-sm hover:bg-orange-600 transition-all duration-200 active:scale-90"
      >
        +
      </button>
    </div>
  );
};

export default QuantityControl;
