import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaTrashAlt, FaArrowLeft } from "react-icons/fa";
import { supabase } from "../utils/SupaClient";
import Header from "../components/Header";
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

  const handleCheckout = async () => {
    const { data: user } = await supabase.auth.getUser();
    if (!user) {
      Swal.fire("Silakan login terlebih dahulu", "", "info");
      return;
    }

    try {
      const itemDetails = cart.map((item) => ({
        id: item.coffee_id,
        price: item.coffee.harga_produk,
        quantity: item.quantity,
        name: item.coffee.nama_produk,
      }));

      const transactionDetails = {
        order_id: `ORDER-${new Date().getTime()}`,
        gross_amount: totalHarga,
      };

      const customerDetails = {
        email: user.user.email,
      };

      const response = await fetch(
        "http://localhost:5000/api/midtrans/create-payment",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            transactionDetails,
            customerDetails,
            itemDetails,
          }),
        }
      );

      const { token } = await response.json();

      window.snap.pay(token, {
        onSuccess: async () => {
          // Tambahkan data ke tabel history
          const { error: historyError } = await supabase.from("history").insert(
            cart.map((item) => ({
              profile_id: user.user.id,
              coffee_id: item.coffee_id,
              quantity: item.quantity,
              status: "Pending",
              harga_saat_transaksi: item.coffee.harga_produk,
            }))
          );

          if (historyError) {
            console.error(historyError);
            Swal.fire(
              "Terjadi kesalahan saat menyimpan riwayat",
              historyError.message,
              "error"
            );
            return;
          }

          // Kurangi stok pada tabel produk
          for (const item of cart) {
            const { error: stockError } = await supabase
              .from("coffee")
              .update({
                stok: item.coffee.stok - item.quantity, // Kurangi stok sesuai jumlah pembelian
              })
              .eq("id", item.coffee_id);

            if (stockError) {
              console.error(stockError);
              Swal.fire(
                `Gagal mengurangi stok untuk ${item.coffee.nama_produk}`,
                stockError.message,
                "error"
              );
              return;
            }
          }

          // Hapus data dari tabel cart
          const { error: cartError } = await supabase
            .from("cart")
            .delete()
            .eq("profile_id", user.user.id);

          if (cartError) {
            console.error(cartError);
            Swal.fire(
              "Terjadi kesalahan saat menghapus keranjang",
              cartError.message,
              "error"
            );
            return;
          }

          // Notifikasi sukses dan navigasi ke halaman HistoryPage
          Swal.fire(
            "Pembayaran Berhasil",
            "Pesanan Anda sedang diproses.",
            "success"
          ).then(() => navigate("/history"));
        },

        onPending: () => {
          Swal.fire(
            "Pembayaran Tertunda",
            "Silakan selesaikan pembayaran Anda.",
            "info"
          );
        },
        onError: () => {
          Swal.fire(
            "Pembayaran Gagal",
            "Terjadi kesalahan saat memproses pembayaran.",
            "error"
          );
        },
      });
    } catch (error) {
      console.error(error);
      Swal.fire("Terjadi kesalahan saat memproses pembayaran", "", "error");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <Header />
      <div className="p-2 flex-grow max-w-7xl mx-auto">
        <div className="flex items-center space-x-4 mb-6">
          <button
            onClick={() => navigate("/product")}
            className="text-gray-600 dark:text-gray-200 text-xl hover:text-gray-800 dark:hover:text-gray-400"
          >
            <FaArrowLeft />
          </button>

          <h1 className="mt-32 text-3xl font-bold text-center flex-grow text-gray-800 dark:text-gray-200">
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
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2">
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
              onClick={handleCheckout}
              className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-3 rounded-lg hover:from-orange-600 hover:to-orange-700 shadow-lg w-full sm:w-auto"
            >
              Lanjutkan Pembayaran
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
