import { useEffect } from "react";
import Swal from "sweetalert2";
import { BiSearch } from "react-icons/bi"; // Import ikon pencarian

export default function HistoryUI({
  history,
  showNotification,
  searchQuery,
  setSearchQuery,
}) {
  useEffect(() => {
    if (showNotification) {
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "success",
        title: "Terima kasih sudah memesan produk di website kami!",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
      });
    }
  }, [showNotification]);

  const filteredHistory = history.filter(
    (item) =>
      item.coffee.nama_produk
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      item.order_id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col min-h-screen">
      <h1 className="text-3xl mt-20 font-bold text-center text-gray-800 dark:text-gray-200 mb-6">
        Riwayat Pembelian
      </h1>

      <div className="mx-4 text-center mb-6 relative">
        <div className="relative w-10/12 sm:w-8/12 lg:w-6/12 mx-auto">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari produk atau Order ID..."
            className="w-full px-5 py-3 pl-12 border rounded-full text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm transition-all duration-200"
          />
          <BiSearch className="absolute top-1/2 left-4 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 text-lg" />
        </div>
      </div>

      {filteredHistory.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-10">
          {/* Icon */}
          <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-full shadow-md">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-12 h-12 text-gray-400 dark:text-gray-500"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-9A2.25 2.25 0 002.25 5.25v13.5A2.25 2.25 0 005.25 21h9a2.25 2.25 0 002.25-2.25V15"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M18 14.25l3 3m0 0l-3 3m3-3H9"
              />
            </svg>
          </div>

          {/* Teks */}
          <p className="text-gray-600 dark:text-gray-300 mt-4 text-lg font-medium">
            Belum ada riwayat pembayaran
          </p>
          <p className="text-gray-500 dark:text-gray-400 text-sm text-center max-w-xs">
            Kamu belum melakukan transaksi pembayaran. Mulai belanja sekarang!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-7 gap-2 m-5">
          {filteredHistory.map((item) => {
            const hargaTerbaru = item.coffee.harga_produk;
            const hargaTransaksi = item.harga_saat_transaksi || hargaTerbaru;

            return (
              <div
                key={item.id}
                className="relative bg-white dark:bg-gray-900 p-5 rounded-2xl border border-gray-300 dark:border-gray-700 shadow-md"
              >
                <div className="relative">
                  <img
                    src={item.coffee.foto_barang}
                    alt={item.coffee.nama_produk}
                    className="w-full h-36 sm:h-40 object-cover rounded-xl"
                  />
                  {item.status === "Approved" && (
                    <span className="absolute top-2 right-2 bg-green-500 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-md">
                      Approved
                    </span>
                  )}

                  {item.status === "Pending" && (
                    <span className="absolute top-2 right-2 bg-yellow-500 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-md">
                      Pending
                    </span>
                  )}
                </div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mt-3">
                  {item.coffee.nama_produk}
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Harga Satuan:{" "}
                  <span className="font-medium">
                    Rp {hargaTransaksi.toLocaleString("id-ID")}
                  </span>
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Jumlah:{" "}
                  <span className="font-medium">{item.quantity} produk</span>
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  Total:{" "}
                  <span className="font-semibold text-gray-900 dark:text-gray-100">
                    Rp{" "}
                    {(item.quantity * hargaTransaksi).toLocaleString("id-ID")}
                  </span>
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Order ID: <span className="font-medium">{item.order_id}</span>
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-3">
                  Tanggal Pembelian:{" "}
                  {new Date(item.created_at).toLocaleString("id-ID")}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
