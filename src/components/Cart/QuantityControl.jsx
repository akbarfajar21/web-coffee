import React from "react";
import Swal from "sweetalert2";

const QuantityControl = ({ item, setCart, cart, updateQuantityInDb }) => {
  const increaseQuantity = async () => {
    if (item.quantity && item.coffee.stok && item.quantity < item.coffee.stok) {
      const updatedCart = cart.map((cartItem) =>
        cartItem.coffee_id === item.coffee_id
          ? { ...cartItem, quantity: cartItem.quantity + 1 }
          : cartItem
      );
      setCart(updatedCart);
      await updateQuantityInDb(item, item.quantity + 1);
    } else {
      Swal.fire(
        "Stok tidak cukup",
        "Anda tidak dapat menambah quantity lebih banyak",
        "warning"
      );
    }
  };

  const decreaseQuantity = async () => {
    if (item.quantity > 1) {
      const updatedCart = cart.map((cartItem) =>
        cartItem.coffee_id === item.coffee_id
          ? { ...cartItem, quantity: cartItem.quantity - 1 }
          : cartItem
      );
      setCart(updatedCart);
      await updateQuantityInDb(item, item.quantity - 1);
    }
  };

  return (
    <div className="flex items-center space-x-3">
      {/* Tombol Kurang */}
      <button
        onClick={decreaseQuantity}
        className="flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 text-gray-900 dark:text-white rounded-full shadow-md hover:from-gray-300 hover:to-gray-400 dark:hover:from-gray-600 dark:hover:to-gray-500 transition-all duration-200 active:scale-90"
      >
        −
      </button>

      {/* Angka Kuantitas */}
      <span className="text-base sm:text-xl font-semibold text-gray-900 dark:text-white min-w-[40px] text-center">
        {item.quantity || 0}
      </span>

      {/* Tombol Tambah */}
      <button
        onClick={increaseQuantity}
        className="flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 bg-gradient-to-r from-orange-400 to-orange-500 text-white rounded-full shadow-md hover:from-orange-500 hover:to-orange-600 transition-all duration-200 active:scale-90"
      >
        +
      </button>
    </div>
  );
};

export default QuantityControl;
