import React from "react";
import { FaTrashAlt } from "react-icons/fa";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
import QuantityControl from "./QuantityControl";

export default function CheckableCartItem({
  item,
  isChecked,
  toggleCheck,
  removeItem,
  updateQuantity,
}) {
  if (!item || !item.coffee) {
    return <div className="text-gray-500 dark:text-gray-400">Loading...</div>;
  }

  const handleRemove = (coffee_id) => {
    Swal.fire({
      title: "Hapus Item?",
      text: "Apakah kamu yakin ingin menghapus item ini dari keranjang?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#3b82f6",
      confirmButtonText: '<i class="fas fa-trash-alt"></i> Ya, Hapus',
      cancelButtonText: '<i class="fas fa-times"></i> Batal',
      customClass: {
        popup: "rounded-2xl shadow-xl bg-white dark:bg-gray-900",
        title: "text-gray-800 dark:text-gray-200 text-lg font-semibold",
        content: "text-gray-600 dark:text-gray-400",
        confirmButton: "px-4 py-2 rounded-lg",
        cancelButton: "px-4 py-2 rounded-lg",
      },
      backdrop: `rgba(0, 0, 0, 0.6)`,
      allowOutsideClick: false,
    }).then((result) => {
      if (result.isConfirmed) {
        removeItem(coffee_id);
        Swal.fire({
          icon: "success",
          title: "Item Terhapus!",
          text: "Item telah berhasil dihapus dari keranjang.",
          showConfirmButton: false,
          timer: 1800,
          customClass: {
            popup: "rounded-2xl shadow-xl bg-white dark:bg-gray-900",
            title: "text-green-500 text-lg font-semibold",
            content: "text-gray-600 dark:text-gray-400",
          },
        });
      }
    });
  };

  return (
    <div className="flex items-center gap-4 sm:gap-5 p-4 sm:p-5 bg-white/90 dark:bg-gray-900/70 backdrop-blur-md border border-gray-200 dark:border-gray-700 rounded-2xl shadow-md hover:shadow-lg transition-all w-full max-w-3xl mx-auto">
      <input
        type="checkbox"
        checked={isChecked}
        onChange={() => toggleCheck(item?.coffee_id)}
        className="w-5 h-5 sm:w-5.5 sm:h-5.5 accent-emerald-500 rounded border border-gray-300 bg-white dark:bg-gray-800 hover:scale-105 transition-transform"
      />

      <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden border border-gray-300 dark:border-gray-600 shadow-sm">
        <img
          src={item?.coffee?.foto_barang}
          alt={item?.coffee?.nama_produk}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />
      </div>

      <div className="flex-grow space-y-1 sm:space-y-2">
        <h3 className="text-base sm:text-lg font-medium text-gray-800 dark:text-gray-100 leading-snug truncate">
          {item?.coffee?.nama_produk}
        </h3>
        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
          {item?.quantity} ×{" "}
          {item?.coffee?.harga_produk?.toLocaleString("id-ID")}
        </p>

        <QuantityControl
          quantity={item?.quantity || 1}
          stok={item?.coffee?.stok}
          onIncrease={() => updateQuantity(item?.coffee_id, item?.quantity + 1)}
          onDecrease={() =>
            item?.quantity > 1
              ? updateQuantity(item?.coffee_id, item?.quantity - 1)
              : handleRemove(item?.coffee_id)
          }
        />
      </div>

      <button
        onClick={() => handleRemove(item?.coffee_id)}
        className="text-red-500 hover:text-red-600 dark:hover:text-red-400 transition-all transform hover:scale-105 p-1.5 rounded-full"
      >
        <FaTrashAlt className="text-base sm:text-lg" />
      </button>
    </div>
  );
}
