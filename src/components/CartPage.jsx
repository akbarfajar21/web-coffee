import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaTrashAlt, FaArrowLeft } from "react-icons/fa"; // Import ikon sampah dan panah kiri
import Footer from "./Footer";

export default function CartPage({ updateCart }) {
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem("cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });

  const navigate = useNavigate();

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart)); // Simpan ke local storage saat cart berubah
  }, [cart]);

  const handleQuantityChange = (productId, quantity) => {
    if (updateCart && typeof updateCart === "function") {
      updateCart(productId, Math.max(1, quantity)); // Minimum quantity = 1
    }
  };

  const handleIncrement = (productId) => {
    setCart((prevCart) => {
      return prevCart.map((item) =>
        item.id === productId
          ? { ...item, quantity: Math.min(item.quantity + 1, item.stok) } // Jangan melebihi stok
          : item
      );
    });
  };

  const handleDecrement = (productId) => {
    setCart((prevCart) => {
      return prevCart.map((item) =>
        item.id === productId
          ? { ...item, quantity: Math.max(item.quantity - 1, 1) } // Jangan kurang dari 1
          : item
      );
    });
  };

  const handleDelete = (productId) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
  };

  // Fungsi untuk memformat harga
  const formatHarga = (harga) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(harga);
  };

  // Menghitung total harga semua produk
  const totalHarga = cart.reduce(
    (total, item) => total + item.harga_produk * item.quantity,
    0
  );

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <div className="p-8 flex-grow max-w-7xl mx-auto">
        <div className="flex items-center space-x-4 mb-6">
          <button
            onClick={() => navigate("/product")}
            className="text-gray-600 text-xl hover:text-gray-800"
          >
            <FaArrowLeft />
          </button>

          <h1 className="text-3xl font-bold text-center flex-grow">
            Keranjang Belanja
          </h1>
        </div>

        {cart.length === 0 ? (
          <div className="flex justify-center items-center flex-col">
            <img
              src="/Empty.gif" // Pastikan gambar berada di folder public
              alt="Empty Cart"
              className="w-64 h-auto" // Sesuaikan ukuran gambar jika perlu
            />
            <p className="text-gray-500 text-center mt-4">
              Keranjang Anda kosong.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {cart.map((item) => (
              <div
                key={item.id}
                className="flex flex-col bg-white p-4 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300"
              >
                <div className="flex flex-col items-center">
                  <img
                    src={item.foto_barang}
                    alt={item.nama_produk}
                    className="w-full h-48 object-cover rounded-md"
                  />
                  <div className="mt-4 text-center">
                    <h2 className="text-lg font-semibold">
                      {item.nama_produk}
                    </h2>
                    <p className="text-gray-500">
                      {formatHarga(item.harga_produk)}
                    </p>
                  </div>
                </div>
                <div className="flex justify-between items-center mt-4">
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => handleDecrement(item.id)}
                      className="text-xl text-gray-600 hover:text-gray-800"
                    >
                      -
                    </button>
                    <input
                      type="number"
                      value={item.quantity}
                      min={1}
                      max={item.stok}
                      onChange={(e) =>
                        handleQuantityChange(
                          item.id,
                          parseInt(e.target.value, 10)
                        )
                      }
                      className="w-16 text-center border border-gray-300 rounded-md"
                    />
                    <button
                      onClick={() => handleIncrement(item.id)}
                      className="text-xl text-gray-600 hover:text-gray-800"
                    >
                      +
                    </button>
                  </div>
                  <p className="text-orange-600 font-bold">
                    {formatHarga(item.harga_produk * item.quantity)}
                  </p>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="text-red-600 text-xl hover:text-red-800"
                  >
                    <FaTrashAlt />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Garis Pemisah */}
        <div className="border-t mt-6 mb-4"></div>

        {cart.length > 0 && (
          <div className="flex justify-between items-center flex-col sm:flex-row mt-6">
            <p className="text-xl font-semibold mb-4 sm:mb-0">
              Total: {formatHarga(totalHarga)}
            </p>
            <button
              onClick={() => navigate("/checkout")}
              className="bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 w-full sm:w-auto"
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
