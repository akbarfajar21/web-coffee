import React, { useEffect, useState } from "react";
import { supabase } from "../utils/SupaClient";
import Header from "../components/Header";

export default function HistoryPage() {
  const [history, setHistory] = useState([]);
  const [showNotification, setShowNotification] = useState(false);

  useEffect(() => {
    const fetchHistory = async () => {
      const { data: user } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("history")
        .select(
          "id, quantity, status, created_at, harga_saat_transaksi, coffee(nama_produk, foto_barang, harga_produk)"
        )
        .eq("profile_id", user.user.id);

      if (error) console.error(error);
      else setHistory(data);
    };

    fetchHistory();
  }, []);

  useEffect(() => {
    const notifiedItems =
      JSON.parse(localStorage.getItem("notifiedItems")) || [];

    history.forEach((item) => {
      if (item.status === "Approved" && !notifiedItems.includes(item.id)) {
        setShowNotification(true);

        const updatedNotifiedItems = [...notifiedItems, item.id];
        localStorage.setItem(
          "notifiedItems",
          JSON.stringify(updatedNotifiedItems)
        );

        setTimeout(() => setShowNotification(false), 4000);
      }
    });
  }, [history]);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow bg-gray-50 dark:bg-gray-900">
        <h1 className="text-3xl mt-20 font-bold text-center text-gray-800 dark:text-gray-200 mb-6">
          Riwayat Pembelian
        </h1>
        {showNotification && (
          <div className="notification-slide-in">
            Terima kasih sudah memesan produk di website kami!
          </div>
        )}
        {history.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-300 text-center">
            Belum ada riwayat pembayaran.
          </p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-8 gap-1 m-2">
            {history.map((item) => {
              const hargaTerbaru = item.coffee.harga_produk;
              const hargaTransaksi = item.harga_saat_transaksi || hargaTerbaru;

              return (
                <div
                  key={item.id}
                  className="relative bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-md"
                >
                  <img
                    src={item.coffee.foto_barang}
                    alt={item.coffee.nama_produk}
                    className="w-full h-36 sm:h-40 object-cover rounded-lg mb-4"
                  />
                  <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-2">
                    {item.coffee.nama_produk}
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                    Jumlah: {item.quantity} produk
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                    Harga Transaksi: Rp {hargaTransaksi.toLocaleString("id-ID")}
                  </p>

                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                    Total: Rp{" "}
                    {(item.quantity * hargaTransaksi).toLocaleString("id-ID")}
                  </p>
                  <p
                    className={`mt-2 text-sm font-medium py-1 px-3 rounded-full inline-block text-center ${
                      item.status === "Approved"
                        ? "bg-green-100 text-green-600"
                        : "bg-yellow-100 text-yellow-600"
                    }`}
                  >
                    {item.status}
                  </p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-3">
                    Terakhir dibeli:{" "}
                    {new Date(item.created_at).toLocaleString("id-ID")}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
