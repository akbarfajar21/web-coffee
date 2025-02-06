import React, { useState } from "react";
import Swal from "sweetalert2";
import { supabase } from "../../utils/SupaClient";

const CheckoutButton = ({ cart, totalHarga, navigate }) => {
  const [isProcessing, setIsProcessing] = useState(false);

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
            .eq("profile_id", user.user.id);

          if (cartError) {
            console.error(cartError);
            Swal.fire(
              "Terjadi kesalahan saat menghapus keranjang",
              cartError.message,
              "error"
            );
            setIsProcessing(false);
            return;
          }

          Swal.fire({
            title: "Pembayaran Berhasil!",
            html: `<p>Pesanan Anda sedang diproses.</p>
                   <p><strong>Order ID:</strong> ${orderId}</p>`,
            icon: "success",
            showCancelButton: true,
            cancelButtonText: "Tutup",
            confirmButtonText: "Salin Order ID",
            confirmButtonColor: "#3085d6",
          }).then((result) => {
            if (result.isConfirmed) {
              navigator.clipboard.writeText(orderId);
              Swal.fire(
                "Tersalin!",
                "Order ID telah disalin ke clipboard.",
                "success"
              ).then(() => navigate("/history"));
            } else {
              navigate("/history");
            }
          });
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
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <button
      onClick={handleCheckout}
      className={`bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-3 rounded-full shadow-lg hover:from-orange-600 hover:to-orange-700 transition-all w-full sm:w-auto text-base ${
        isProcessing ? "opacity-50 cursor-not-allowed" : ""
      }`}
      disabled={isProcessing}
    >
      {isProcessing ? "Memproses..." : "Lanjutkan Pembayaran"}
    </button>
  );
};

export default CheckoutButton;
