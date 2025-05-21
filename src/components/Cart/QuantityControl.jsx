import React from "react";
import Swal from "sweetalert2";

const QuantityControl = ({ quantity, stok, onIncrease, onDecrease }) => {
  const handleIncrease = () => {
    if (quantity < stok) {
      onIncrease();
    } else {
      Swal.fire({
        title: "Stok Tidak Mencukupi",
        text: "Anda tidak dapat menambah jumlah lebih lanjut.",
        icon: "error",
        confirmButtonText: "Oke, Mengerti",
        background: "#FFFFFF",
        color: "#333333",
        confirmButtonColor: "#EF4444",
        customClass: {
          popup: "rounded-xl shadow-xl backdrop-blur-lg border border-gray-300",
          confirmButton:
            "px-6 py-3 rounded-lg text-lg font-semibold transition-all transform hover:scale-105",
        },
      });
    }
  };

  return (
    <div className="flex items-center space-x-2 mt-2">
      <button
        onClick={onDecrease}
        className="flex items-center justify-center w-6 h-6 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-md shadow-sm hover:bg-gray-300 dark:hover:bg-gray-600 transition-transform duration-200 active:scale-90"
      >
        −
      </button>
      <span className="text-sm font-semibold text-gray-900 dark:text-white min-w-[24px] text-center">
        {quantity || 0}
      </span>
      <button
        onClick={handleIncrease}
        className="flex items-center justify-center w-6 h-6 bg-orange-500 text-white rounded-md shadow-sm hover:bg-orange-600 transition-transform duration-200 active:scale-90"
      >
        +
      </button>
    </div>
  );
};

export default QuantityControl;
