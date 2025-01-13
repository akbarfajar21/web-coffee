import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaTrashAlt, FaArrowLeft } from "react-icons/fa";
import Footer from "./Footer";
import { supabase } from "../utils/SupaClient";
import Swal from "sweetalert2";

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

  const handleDelete = async (productId) => {
    const { data: user } = await supabase.auth.getUser();
    const product = cart.find((item) => item.coffee_id === productId);
    if (!user) {
      Swal.fire("Silakan login terlebih dahulu", "", "info");
      return;
    }

    const { error } = await supabase
      .from("cart")
      .delete()
      .eq("profile_id", user.user.id)
      .eq("coffee_id", productId);

    if (error) {
      console.error(error);
      Swal.fire(
        "Terjadi kesalahan saat menghapus produk",
        error.message,
        "error"
      );
    } else {
      setCart((prevCart) =>
        prevCart.filter((item) => item.coffee_id !== productId)
      );
      Swal.fire(
        `${product.coffee.nama_produk} berhasil dihapus dari keranjang`,
        "",
        "success"
      );
    }
  };

  const handleQuantityChange = async (productId, quantityChange) => {
    const { data: user } = await supabase.auth.getUser();
    if (!user) {
      Swal.fire("Silakan login terlebih dahulu", "", "info");
      return;
    }

    const product = cart.find((item) => item.coffee_id === productId);

    if (!product) return;

    const newQuantity = product.quantity + quantityChange;

    if (newQuantity > product.coffee.stok) {
      Swal.fire(
        "Stok Tidak Cukup",
        `Stok untuk ${product.coffee.nama_produk} hanya ${product.coffee.stok}.`,
        "warning"
      );
      return;
    }

    if (newQuantity <= 0) {
      Swal.fire(
        "Jumlah Tidak Valid",
        "Jumlah produk harus minimal 1.",
        "error"
      );
      return;
    }

    const { error } = await supabase
      .from("cart")
      .update({ quantity: newQuantity })
      .eq("profile_id", user.user.id)
      .eq("coffee_id", productId);

    if (error) {
      console.error(error);
      Swal.fire(
        "Terjadi kesalahan saat memperbarui jumlah",
        error.message,
        "error"
      );
    } else {
      setCart((prevCart) =>
        prevCart.map((item) =>
          item.coffee_id === productId
            ? { ...item, quantity: newQuantity }
            : item
        )
      );
    }
  };

  const formatHarga = (harga) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(harga);
  };

  const totalHarga = cart.reduce(
    (total, item) => total + item.coffee.harga_produk * item.quantity,
    0
  );

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <div className="p-8 flex-grow max-w-7xl mx-auto">
        <div className="flex items-center space-x-4 mb-6">
          <button
            onClick={() => navigate("/product")}
            className="text-gray-600 dark:text-gray-200 text-xl hover:text-gray-800 dark:hover:text-gray-400"
          >
            <FaArrowLeft />
          </button>

          <h1 className="text-3xl font-bold text-center flex-grow text-gray-800 dark:text-gray-200">
            Keranjang Belanja
          </h1>
        </div>

        {cart.length === 0 ? (
          <div className="flex justify-center items-center flex-col">
            <img src="/Empty.gif" alt="Empty Cart" className="w-64 h-auto" />
            <p className="text-gray-500 dark:text-gray-300 text-center mt-4">
              Keranjang Anda kosong.
            </p>
            <button
              onClick={() => navigate("/product")}
              className="mt-6 bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-3 rounded-lg hover:from-orange-600 hover:to-orange-700 shadow-lg"
            >
              Belanja Sekarang
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {cart.map((item) => (
              <div
                key={item.coffee_id}
                className="flex flex-col bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 border border-gray-200 dark:border-gray-700"
              >
                <div className="relative">
                  <img
                    src={item.coffee.foto_barang}
                    alt={item.coffee.nama_produk}
                    className="w-full h-48 object-cover rounded-md"
                  />
                  {item.coffee.stok === 0 && (
                    <div className="absolute top-2 left-2 bg-red-600 text-white px-2 py-1 rounded">
                      Stok Habis
                    </div>
                  )}
                </div>
                <div className="mt-4 text-center">
                  <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                    {item.coffee.nama_produk}
                  </h2>
                  <p className="text-gray-500 dark:text-gray-300">
                    {formatHarga(item.coffee.harga_produk)}
                  </p>
                </div>
                <div className="flex justify-between items-center mt-4">
                  <div className="flex items-center">
                    <button
                      onClick={() => handleQuantityChange(item.coffee_id, -1)}
                      className="px-2 py-1 bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-white rounded-l-md"
                    >
                      -
                    </button>
                    <span className="px-4 py-1 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => handleQuantityChange(item.coffee_id, 1)}
                      className="px-2 py-1 bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-white rounded-r-md"
                    >
                      +
                    </button>
                  </div>
                  <button
                    onClick={() => handleDelete(item.coffee_id)}
                    className="text-red-600 dark:text-red-400 text-xl hover:text-red-800 dark:hover:text-red-500"
                  >
                    <FaTrashAlt />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="border-t mt-6 mb-4 dark:border-gray-700"></div>

        {cart.length > 0 && (
          <div className="flex justify-between items-center flex-col sm:flex-row mt-6">
            <p className="text-xl font-semibold mb-4 sm:mb-0 text-gray-800 dark:text-gray-200">
              Total: {formatHarga(totalHarga)}
            </p>
            <button
              onClick={() => navigate("/checkout")}
              className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-3 rounded-lg hover:from-orange-600 hover:to-orange-700 shadow-lg w-full sm:w-auto"
            >
              Lanjutkan Pembayaran
            </button>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
