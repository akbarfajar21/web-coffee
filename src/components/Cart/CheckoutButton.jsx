import React, { useState } from "react";
import Swal from "sweetalert2";
import { supabase } from "../../utils/SupaClient";

const formatHarga = (harga) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(harga);
};

const CheckoutButton = ({ cart, totalHarga, navigate }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [showCoffeeLoading, setShowCoffeeLoading] = useState(false);

  const confirmCheckout = () => {
    const isDarkMode = document.documentElement.classList.contains("dark");

    if (cart.length === 0) {
      Swal.fire({
        icon: "warning",
        title: "Keranjang Kosong!",
        text: "Silakan pilih produk sebelum melanjutkan ke pembayaran.",
        confirmButtonColor: "#f97316",
        background: isDarkMode ? "#1f2937" : "#ffffff",
        color: isDarkMode ? "#f9fafb" : "#1f2937",
        customClass: {
          popup: isDarkMode ? "dark-swal-popup" : "",
          title: isDarkMode ? "dark-swal-title" : "",
        },
      });
      return;
    }

    const productList = cart
      .map(
        (item) =>
          `<div class="swal-product">
          <span>${item.quantity}×</span> 
          <span>${item.coffee.nama_produk}</span> 
          <span>${formatHarga(item.coffee.harga_produk * item.quantity)}</span>
        </div>`
      )
      .join("");

    Swal.fire({
      title: "Konfirmasi Pembelian",
      html: `
      <div class="swal-container" style="color: ${
        isDarkMode ? "#f9fafb" : "#1f2937"
      }">
        <div class="swal-products">${productList}</div>
        <div class="swal-total dark:text-white">
          <b>Total Harga: ${formatHarga(totalHarga)}</b>
        </div>
      </div>
    `,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Ya, Beli Sekarang",
      cancelButtonText: "Batal",
      confirmButtonColor: "#f97316",
      cancelButtonColor: "#d33",
      background: isDarkMode ? "#1f2937" : "#ffffff",
      color: isDarkMode ? "#f9fafb" : "#1f2937",
      customClass: {
        popup: "swal-popup",
        title: "swal-title",
        confirmButton: "swal-confirm",
        cancelButton: "swal-cancel",
      },
    }).then((result) => {
      if (result.isConfirmed) {
        handleCheckout();
      }
    });
  };

  const handleCheckout = async () => {
    if (isProcessing) return;
    setIsProcessing(true);

    const { data: user } = await supabase.auth.getUser();
    if (!user) {
      Swal.fire("Silakan login terlebih dahulu", "", "info");
      setIsProcessing(false);
      return;
    }

    try {
      const itemDetails = cart.map((item) => ({
        id: item.coffee_id,
        price: item.coffee.harga_produk,
        quantity: item.quantity,
        name: item.coffee.nama_produk,
      }));

      const orderId = `ORDER-${new Date().getTime()}`;
      const transactionDetails = {
        order_id: orderId,
        gross_amount: totalHarga,
      };

      const customerDetails = {
        email: user.user.email,
      };

      const response = await fetch(
        "https://serverpayment.vercel.app/api/midtrans/create-payment",
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
          setShowCoffeeLoading(true); // Tampilkan loading segera

          const { error: historyError } = await supabase.from("history").insert(
            cart.map((item) => ({
              profile_id: user.user.id,
              coffee_id: item.coffee_id,
              quantity: item.quantity,
              status: "Pending",
              harga_saat_transaksi: item.coffee.harga_produk,
              order_id: orderId,
            }))
          );

          if (historyError) {
            console.error(historyError);
            setShowCoffeeLoading(false);
            Swal.fire(
              "Terjadi kesalahan saat menyimpan riwayat",
              historyError.message,
              "error"
            );
            setIsProcessing(false);
            return;
          }

          for (const item of cart) {
            const { error: stockError } = await supabase
              .from("coffee")
              .update({
                stok: item.coffee.stok - item.quantity,
              })
              .eq("id", item.coffee_id);

            if (stockError) {
              console.error(stockError);
              setShowCoffeeLoading(false);
              Swal.fire(
                `Gagal mengurangi stok untuk ${item.coffee.nama_produk}`,
                stockError.message,
                "error"
              );
              setIsProcessing(false);
              return;
            }
          }

          const { error: cartError } = await supabase
            .from("cart")
            .delete()
            .eq("profile_id", user.user.id)
            .in(
              "coffee_id",
              cart.map((item) => item.coffee_id)
            );

          if (cartError) {
            console.error(cartError);
            setShowCoffeeLoading(false);
            Swal.fire(
              "Terjadi kesalahan saat menghapus keranjang",
              cartError.message,
              "error"
            );
            setIsProcessing(false);
            return;
          }

          setShowCoffeeLoading(false); // Sembunyikan loading
          Swal.fire({
            title: "Pembayaran Berhasil!",
            html: `<p>Pesanan Anda sedang diproses.</p>
                   <p><strong>ID Pesanan:</strong> ${orderId}</p>`,
            icon: "success",
            showCancelButton: true,
            cancelButtonText: "Tutup",
            confirmButtonText: "Salin ID Pesanan",
            confirmButtonColor: "#3085d6",
          }).then((result) => {
            if (result.isConfirmed) {
              navigator.clipboard.writeText(orderId);
              Swal.fire(
                "Disalin!",
                "ID Pesanan telah disalin ke clipboard.",
                "success"
              ).then(() => navigate("/history"));
            } else {
              navigate("/history");
            }
          });
        },

        onPending: () => {
          Swal.fire({
            title: "Pembayaran Tertunda",
            html: `
              <p class="text-gray-700 dark:text-gray-200 text-lg">
                Silakan selesaikan pembayaran Anda untuk melanjutkan transaksi.
              </p>
            `,
            icon: "warning",
            background: "linear-gradient(135deg, #E0F2FE, #BAE6FD)",
            color: "#333",
            confirmButtonText: "Bayar Sekarang",
            confirmButtonColor: "#0284C7",
            customClass: {
              popup: "rounded-xl shadow-2xl px-8 py-6",
              title: "text-2xl font-bold text-gray-800 dark:text-white",
              confirmButton:
                "px-6 py-3 rounded-lg text-lg font-semibold bg-blue-500 hover:bg-blue-600 transition-all duration-300 shadow-md",
            },
          });
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
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="mt-6">
      {showCoffeeLoading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm z-[9999]">
          <div className="flex flex-col items-center space-y-4">
            <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
            <p className="text-white text-lg font-semibold">
              Memproses Pembayaran...
            </p>
          </div>
        </div>
      )}

      <button
        onClick={confirmCheckout}
        className={`relative flex items-center justify-center bg-gradient-to-r from-orange-500 to-orange-600 text-white px-8 py-3 rounded-full shadow-xl transition-all duration-300 ease-in-out transform active:scale-95 w-full text-lg font-semibold tracking-wide h-12 min-w-[180px] ${
          isProcessing
            ? "opacity-60 cursor-not-allowed"
            : "hover:from-orange-600 hover:to-orange-700 hover:shadow-2xl"
        }`}
        disabled={isProcessing}
      >
        {isProcessing ? (
          <div className="flex items-center space-x-3">
            <div className="w-5 h-5 border-[3px] border-white border-t-transparent rounded-full animate-spin"></div>
            <span>Proses Pembayaran</span>
          </div>
        ) : (
          <span>Lanjutkan Pembayaran</span>
        )}
      </button>
    </div>
  );
};

export default CheckoutButton;
