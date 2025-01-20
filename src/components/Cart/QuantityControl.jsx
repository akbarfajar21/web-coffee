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
      <button
        onClick={decreaseQuantity}
        className="px-4 sm:px-5 py-2 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-all"
      >
        -
      </button>
      <span className="text-sm sm:text-lg font-medium text-gray-800 dark:text-white">
        {item.quantity || 0}{" "}
        {/* Menambahkan fallback jika item.quantity undefined */}
      </span>
      <button
        onClick={increaseQuantity}
        className="px-4 sm:px-5 py-2 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-all"
      >
        +
      </button>
    </div>
  );
};

export default QuantityControl;
