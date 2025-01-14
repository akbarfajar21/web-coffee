import React, { useEffect, useState } from "react";
import { supabase } from "../utils/SupaClient";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function HistoryPage() {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const fetchHistory = async () => {
      const { data: user } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("history")
        .select(
          "id, quantity, status, coffee(nama_produk, foto_barang, harga_produk)"
        )
        .eq("profile_id", user.user.id);

      if (error) console.error(error);
      else setHistory(data);
    };

    fetchHistory();
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow bg-gray-50 dark:bg-gray-900 p-8">
        <h1 className="text-3xl mt-14 font-bold text-center text-gray-800 dark:text-gray-200 mb-6">
          Riwayat Pembelian
        </h1>
        {history.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-300 text-center">
            Belum ada riwayat pembayaran.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {history.map((item) => (
              <div
                key={item.id}
                className="relative bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg transform transition duration-300 hover:scale-105 hover:shadow-2xl"
              >
                <img
                  src={item.coffee.foto_barang}
                  alt={item.coffee.nama_produk}
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
                <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                  {item.coffee.nama_produk}
                </h2>
                <p className="text-gray-500 dark:text-gray-400 mt-2">
                  {item.quantity} x Rp
                  {item.coffee.harga_produk.toLocaleString("id-ID")}
                </p>
                <p
                  className={`mt-4 font-medium py-2 px-4 rounded-full inline-block text-center ${
                    item.status === "Approved"
                      ? "bg-green-100 text-green-600"
                      : "bg-yellow-100 text-yellow-600"
                  }`}
                >
                  Status: {item.status}
                </p>
              </div>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
