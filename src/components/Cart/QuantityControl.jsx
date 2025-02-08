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
    <div className="flex items-center space-x-2 sm:space-x-3">
      {/* Tombol Kurang */}
      <button
        onClick={decreaseQuantity}
        className="flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-md shadow-sm hover:bg-gray-300 dark:hover:bg-gray-600 transition-all duration-200 active:scale-90"
      >
        −
      </button>

      {/* Angka Kuantitas */}
      <span className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white min-w-[30px] text-center">
        {item.quantity || 0}
      </span>

      {/* Tombol Tambah */}
      <button
        onClick={increaseQuantity}
        className="flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 bg-orange-500 text-white rounded-md shadow-sm hover:bg-orange-600 transition-all duration-200 active:scale-90"
      >
        +
      </button>
    </div>
  );
};

export default QuantityControl;
