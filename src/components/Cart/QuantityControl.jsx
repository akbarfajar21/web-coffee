import React from "react";
import Swal from "sweetalert2";

const QuantityControl = ({ quantity, stok, onIncrease, onDecrease }) => {
  const handleIncrease = () => {
    if (quantity < stok) {
      onIncrease(); // Hanya tambah jika belum mencapai stok maksimal
    } else {
      Swal.fire({
        title: "⚠️ Stok Tidak Cukup!",
        text: "Anda tidak dapat menambah quantity lebih banyak.",
        iconHtml: "🚫",
        confirmButtonText: "OK, Mengerti",
        background: "#FFFFFF",
        color: "#000000",
        confirmButtonColor: "#EF4444",
        showClass: { popup: "animate__animated animate__bounceIn" },
        hideClass: { popup: "animate__animated animate__fadeOut" },
        customClass: {
          popup:
            "rounded-xl shadow-2xl backdrop-blur-lg border border-gray-600",
          confirmButton: "px-5 py-2 rounded-lg text-lg font-semibold",
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
