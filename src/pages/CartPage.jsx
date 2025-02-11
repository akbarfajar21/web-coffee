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

    Swal.fire({
      title: "Apakah Anda yakin?",
      text: "Produk ini akan dihapus dari keranjang Anda.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Ya, hapus!",
      cancelButtonText: "Batal",
      background: "#ffffff",
      color: "#333333",
      customClass: {
        popup: "rounded-xl shadow-lg",
        title: "text-lg font-semibold",
        confirmButton: "px-6 py-2 rounded-lg bg-red-500 hover:bg-red-600",
        cancelButton: "px-6 py-2 rounded-lg bg-gray-400 hover:bg-gray-500",
      },
    }).then(async (result) => {
      if (result.isConfirmed) {
        const { error } = await supabase
          .from("cart")
          .delete()
          .eq("profile_id", user.user.id)
          .eq("coffee_id", coffee_id);

        if (error) {
          Swal.fire({
            title: "Terjadi Kesalahan",
            text: error.message,
            icon: "error",
            background: "#ffffff",
            color: "#333333",
          });
        } else {
          // Menghapus item dari state lokal setelah berhasil dihapus dari database
          setCart(cart.filter((item) => item.coffee_id !== coffee_id));
          Swal.fire({
            title: "Berhasil Dihapus!",
            text: "Produk telah dihapus dari keranjang.",
            iconHtml: `
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" 
                fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                class="lucide lucide-check-circle text-green-500 animate-scale-up">
                <path d="M9 12l2 2 4-4"></path>
                <circle cx="12" cy="12" r="10"></circle>
              </svg>
            `,
            timer: 2000,
            timerProgressBar: true,
            background: "#ffffff", // Selalu putih
            color: "#222222", // Teks selalu hitam
            showConfirmButton: false,
            toast: true,
            position: "top-end",
            customClass: {
              popup: "rounded-xl shadow-xl border border-gray-200",
              title: "text-lg font-semibold text-gray-900",
              htmlContainer: "text-gray-700 text-sm",
              timerProgressBar: "bg-green-500",
            },
            showClass: {
              popup: "animate__animated animate__fadeInDown animate__faster",
            },
            hideClass: {
              popup: "animate__animated animate__fadeOutUp animate__faster",
            },
            willOpen: () => {
              const icon = document.querySelector(".animate-scale-up");
              icon.style.transform = "scale(0.8)";
              setTimeout(() => {
                icon.style.transform = "scale(1)";
                icon.style.transition = "all 0.3s ease-out";
              }, 50);
            },
          });
        }
      }
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <Header />

      <div className="p-6 flex-grow max-w-7xl mx-auto mt-12">
        {/* Header Navigasi */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate("/product")}
            className="p-3 rounded-full bg-gray-100 dark:bg-gray-800 shadow-lg text-gray-600 dark:text-gray-200 
      hover:bg-gray-200 dark:hover:bg-gray-700 transition-all"
          >
            <FaArrowLeft className="text-2xl" />
          </button>
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white drop-shadow-md">
            Shopping Cart
          </h1>
          <div className="w-10"></div> {/* Placeholder untuk menjaga layout */}
        </div>

        {/* Keranjang Kosong */}
        {cart.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center py-10">
            <img
              src="/Empty.gif"
              alt="Empty Cart"
              className="w-64 sm:w-80 h-auto rounded-lg shadow-lg transition-transform duration-300 hover:scale-105"
            />
            <p className="text-lg text-gray-600 dark:text-gray-300 mt-6 max-w-md">
              Oops! Looks like your cart is empty. Start adding your favorite
              coffee!
            </p>
            <button
              onClick={() => navigate("/product")}
              className="mt-6 bg-gradient-to-r from-orange-500 to-orange-600 text-white px-8 py-3 rounded-lg shadow-lg text-lg font-semibold 
        hover:from-orange-600 hover:to-orange-700 transform hover:scale-105 transition-all duration-300"
            >
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Daftar Produk */}
            <div className="lg:col-span-2 space-y-6">
              {cart.map((item) => (
                <div
                  key={item.coffee_id}
                  className="flex items-center p-5 bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200 dark:border-gray-700"
                >
                  {/* Gambar Produk */}
                  <img
                    src={item.coffee.foto_barang}
                    alt={item.coffee.nama_produk}
                    className="w-24 sm:w-32 h-24 sm:h-32 object-cover rounded-lg shadow-sm transition-transform duration-300 ease-in-out transform hover:scale-105"
                  />

                  {/* Detail Produk */}
                  <div className="flex-grow ml-4 sm:ml-6">
                    <h2 className="text-sm sm:text-lg font-semibold text-gray-800 dark:text-gray-200">
                      {item.coffee.nama_produk}
                    </h2>
                    <p className="text-sm text-gray-500 dark:text-gray-300">
                      {formatHarga(item.coffee.harga_produk)}
                    </p>
                  </div>

                  {/* Kontrol Jumlah & Hapus */}
                  <div className="flex items-center space-x-4">
                    <QuantityControl
                      item={item}
                      setCart={setCart}
                      cart={cart}
                      updateQuantityInDb={updateQuantityInDb}
                    />
                    <button
                      onClick={() => handleDelete(item.coffee_id)}
                      className="text-red-600 dark:text-red-400 text-lg sm:text-xl hover:text-red-800 dark:hover:text-red-500 transition-all"
                    >
                      <FaTrashAlt />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Ringkasan Belanja */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 sticky top-20 border border-gray-200 dark:border-gray-700">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-5 text-center">
                Order Summary
              </h2>

              {/* Detail Harga */}
              <div className="space-y-4 text-gray-700 dark:text-gray-300">
                <div className="flex justify-between items-center text-base">
                  <p>Subtotal</p>
                  <p className="font-medium">{formatHarga(totalHarga)}</p>
                </div>

                <div className="flex justify-between items-center text-base">
                  <p>Shipping</p>
                  <p className="text-green-500 font-medium">FREE</p>
                </div>
              </div>

              {/* Garis Pembatas */}
              <hr className="my-5 border-gray-300 dark:border-gray-600" />

              {/* Total Harga */}
              <div className="flex justify-between dark:text-white items-center text-xl font-semibold">
                <p>Total</p>
                <p>{formatHarga(totalHarga)}</p>
              </div>

              {/* Tombol Checkout */}
              <div className="mt-6">
                <CheckoutButton
                  cart={cart}
                  totalHarga={totalHarga}
                  navigate={navigate}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
