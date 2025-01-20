// CartPage.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaTrashAlt, FaArrowLeft } from "react-icons/fa";
import { supabase } from "../utils/SupaClient";
import Header from "../components/Header";
import Swal from "sweetalert2";
import QuantityControl from "../components/Cart/QuantityControl";
import CheckoutButton from "../components/Cart/CheckoutButton";

export default function CartPage() {
  const [cart, setCart] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCart = async () => {
      const { data: user } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("cart")
        .select(
          "id, coffee_id, quantity, coffee(nama_produk, foto_barang, harga_produk, stok)"
        )
        .eq("profile_id", user.user.id);

      if (error) {
        console.error(error);
      } else {
        setCart(data);
      }
    };

    fetchCart();
  }, []);

  const formatHarga = (harga) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(harga);
  };

  const totalHarga = cart.reduce(
    (total, item) => total + item.coffee.harga_produk * item.quantity,
    0
  );

  const updateQuantityInDb = async (item, newQuantity) => {
    const { error } = await supabase
      .from("cart")
      .update({ quantity: newQuantity })
      .eq("id", item.id);
    if (error) {
      console.error(error);
      Swal.fire("Terjadi kesalahan", error.message, "error");
    }
  };

  // Fungsi untuk menghapus produk dari keranjang
  const handleDelete = async (coffee_id) => {
    const { data: user } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase
      .from("cart")
      .delete()
      .eq("profile_id", user.user.id)
      .eq("coffee_id", coffee_id);

    if (error) {
      Swal.fire("Terjadi kesalahan", error.message, "error");
    } else {
      // Menghapus item dari state lokal setelah berhasil dihapus dari database
      setCart(cart.filter((item) => item.coffee_id !== coffee_id));
      Swal.fire("Produk berhasil dihapus", "", "success");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <Header />
      <div className="p-4 sm:p-6 flex-grow max-w-7xl mx-auto">
        <div className="flex items-center space-x-4 mb-6">
          <button
            onClick={() => navigate("/product")}
            className="text-gray-600 dark:text-gray-200 text-xl hover:text-gray-800 dark:hover:text-gray-400 transition-colors"
          >
            <FaArrowLeft />
          </button>

          <h1 className="mt-32 text-2xl sm:text-3xl font-bold text-center flex-grow text-gray-800 dark:text-gray-200">
            Shopping Cart
          </h1>
        </div>

        {cart.length === 0 ? (
          <div className="flex justify-center items-center flex-col">
            <img
              src="/Empty.gif"
              alt="Empty Cart"
              className="w-48 sm:w-64 h-auto"
            />
            <p className="text-gray-500 dark:text-gray-300 text-center mt-4">
              Your cart is empty.
            </p>
            <button
              onClick={() => navigate("/product")}
              className="mt-6 bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-3 rounded-full shadow-lg hover:from-orange-600 hover:to-orange-700 transition-all"
            >
              Shop Now
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {cart.map((item) => (
              <div
                key={item.coffee_id}
                className="flex items-center p-4 sm:p-6 bg-white dark:bg-gray-800 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 border-b border-gray-200 dark:border-gray-700 w-full max-w-sm sm:max-w-md lg:max-w-lg mx-auto"
              >
                <img
                  src={item.coffee.foto_barang}
                  alt={item.coffee.nama_produk}
                  className="w-24 sm:w-32 h-24 sm:h-32 object-cover rounded-lg shadow-sm transition-transform duration-300 ease-in-out transform hover:scale-105"
                />
                <div className="flex-grow ml-4 sm:ml-6">
                  <h2 className="text-sm sm:text-lg font-semibold text-gray-800 dark:text-gray-200">
                    {item.coffee.nama_produk}
                  </h2>
                  <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-300">
                    {formatHarga(item.coffee.harga_produk)}
                  </p>
                </div>
                <div className="flex items-center space-x-4">
                  <QuantityControl
                    item={item}
                    setCart={setCart}
                    cart={cart}
                    updateQuantityInDb={updateQuantityInDb}
                  />
                  <button
                    onClick={() => handleDelete(item.coffee_id)}
                    className="text-red-600 dark:text-red-400 text-xl sm:text-2xl hover:text-red-800 dark:hover:text-red-500 transition-all"
                  >
                    <FaTrashAlt />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="border-t mt-8 mb-6 dark:border-gray-700"></div>
        {cart.length > 0 && (
          <div className="flex justify-between items-center flex-col sm:flex-row mt-6">
            <p className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-0 text-gray-800 dark:text-gray-200">
              Total: {formatHarga(totalHarga)}
            </p>
            <CheckoutButton
              cart={cart}
              totalHarga={totalHarga}
              navigate={navigate}
            />
          </div>
        )}
      </div>
    </div>
  );
}
