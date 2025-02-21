import React from "react";
import { FaTrashAlt } from "react-icons/fa";
import QuantityControl from "./QuantityControl"; // Pastikan path benar

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

  return (
    <div className="flex items-center gap-5 p-5 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 transition-all hover:shadow-xl">
      <input
        type="checkbox"
        checked={isChecked}
        onChange={() => toggleCheck(item?.coffee_id)}
        className="w-5 h-5 rounded-md border-2 border-gray-300 bg-white  hover:scale-105"
      />

      <div className="relative">
        <img
          src={item?.coffee?.foto_barang}
          alt={item?.coffee?.nama_produk}
          className="w-24 h-24 object-cover rounded-lg border border-gray-300 dark:border-gray-600 shadow-sm"
        />
      </div>

      <div className="flex-grow space-y-1">
        <h3 className="text-base font-semibold text-gray-800 dark:text-gray-200">
          {item?.coffee?.nama_produk}
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {item?.quantity} x{" "}
          {item?.coffee?.harga_produk?.toLocaleString("id-ID")}
        </p>
        <QuantityControl
          quantity={item?.quantity || 1}
          stok={item?.coffee?.stok}
          onIncrease={() => updateQuantity(item?.coffee_id, item?.quantity + 1)}
          onDecrease={() =>
            item?.quantity > 1
              ? updateQuantity(item?.coffee_id, item?.quantity - 1)
              : removeItem(item?.coffee_id)
          }
        />
      </div>

      <button
        onClick={() => removeItem(item?.coffee_id)}
        className="text-red-500 hover:text-red-600 dark:hover:text-red-400 transition-all transform hover:scale-110 p-2 rounded-lg"
      >
        <FaTrashAlt className="text-xl" />
      </button>
    </div>
  );
}
