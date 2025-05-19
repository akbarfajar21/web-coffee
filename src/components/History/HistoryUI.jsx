import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { BiSearch } from "react-icons/bi";
import { useSearchParams } from "react-router-dom";

export default function HistoryUI({
  history,
  showNotification, // Diterima dari props
  searchQuery, // Diterima dari props
  setSearchQuery, // Diterima dari props
}) {
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showNotificationState, setShowNotificationState] = useState(true); // State baru untuk notifikasi
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    // Handle URL query param and update search query
    const queryFromUrl = searchParams.get("q") || "";
    setSearchQuery(queryFromUrl);
  }, [searchParams, setSearchQuery]);

  useEffect(() => {
    const hasApprovedStatus = history.some(
      (item) => item.status?.trim().toLowerCase() === "approved"
    );

    // Cek jika ada status "approved" dan notifikasi belum pernah ditampilkan
    if (hasApprovedStatus && showNotificationState) {
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "success",
        title: "Thank you for your purchase!",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
      });

      // Setelah menampilkan notifikasi, set showNotificationState menjadi false
      setShowNotificationState(false);
    }
  }, [history, showNotificationState]); // Menyebabkan efek saat history berubah

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query); // Menggunakan setSearchQuery dari props
    if (query) {
      setSearchParams({ q: query });
    } else {
      setSearchParams({});
    }
  };

  const filteredHistory = history.filter(
    (item) =>
      item.coffee?.nama_produk
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      item.order_id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const groupedHistory = filteredHistory.reduce((acc, item) => {
    if (!acc[item.order_id]) {
      acc[item.order_id] = {
        ...item,
        items: [item],
        total: item.quantity * item.harga_saat_transaksi,
      };
    } else {
      acc[item.order_id].items.push(item);
      acc[item.order_id].total += item.quantity * item.harga_saat_transaksi;
    }
    return acc;
  }, {});

  const historyArray = Object.values(groupedHistory).sort(
    (a, b) => new Date(b.created_at) - new Date(a.created_at)
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
            onChange={handleSearchChange}
            placeholder="Cari produk atau ID Pesanan..."
            className="w-full px-5 py-3 pl-12 border rounded-full text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
          />
          <BiSearch className="absolute top-1/2 left-4 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 text-lg" />
        </div>
      </div>

      {historyArray.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64">
          <svg
            className="w-14 h-14 text-gray-400 dark:text-gray-500 mb-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 8v4l3 3m9 0a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>

          <p className="text-lg font-medium text-gray-700 dark:text-gray-300">
            Belum ada riwayat pembelian
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            Mulailah berbelanja dan temukan kopi favoritmu!
          </p>
          <a
            href="/product"
            className="mt-4 px-5 py-2 bg-blue-600 text-white rounded-full text-sm font-medium shadow-md hover:bg-blue-700 transition-all"
          >
            Belanja Sekarang
          </a>
        </div>
      ) : (
        <div className="overflow-x-auto mx-4 mb-5">
          <div className="w-full bg-white dark:bg-gray-900 shadow-xl rounded-xl overflow-hidden">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gradient-to-r from-indigo-200 to-indigo-400 dark:from-indigo-700 dark:to-indigo-900 text-white text-xs sm:text-sm">
                  <th className="px-3 sm:px-4 py-2 sm:py-3">No</th>
                  <th className="px-3 sm:px-4 py-2 sm:py-3">ID Pesanan</th>
                  <th className="px-3 sm:px-4 py-2 sm:py-3 hidden sm:table-cell">
                    Total
                  </th>
                  <th className="px-3 sm:px-4 py-2 sm:py-3">Status</th>
                  <th className="px-3 sm:px-4 py-2 sm:py-3">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {historyArray.map((item, index) => (
                  <tr
                    key={item.order_id}
                    className="border-b bg-gray-50 dark:bg-gray-800 text-xs sm:text-sm hover:bg-indigo-100 dark:hover:bg-indigo-700 transition-all"
                  >
                    <td className="px-3 sm:px-4 py-2 sm:py-3 text-center">
                      {index + 1}
                    </td>
                    <td className="px-3 sm:px-4 py-2 sm:py-3 text-center font-semibold text-gray-800 dark:text-gray-300">
                      {item.order_id}
                    </td>
                    <td className="px-3 sm:px-4 py-2 sm:py-3 text-center font-medium text-gray-700 dark:text-gray-300 hidden sm:table-cell">
                      Rp {item.total.toLocaleString("id-ID")}
                    </td>
                    <td className="px-3 sm:px-4 py-2 sm:py-3 text-center">
                      <span
                        className={`px-3 py-1 rounded-full text-white text-[10px] sm:text-xs font-medium ${
                          item.status?.trim().toLowerCase() === "approved"
                            ? "bg-green-500"
                            : item.status?.trim().toLowerCase() === "pending"
                            ? "bg-yellow-500"
                            : "bg-red-500"
                        }`}
                      >
                        {item.status || "Pending"}
                      </span>
                    </td>
                    <td className="px-3 sm:px-4 py-2 sm:py-3 text-center">
                      <button
                        onClick={() => setSelectedOrder(item)}
                        className="text-white text-[10px] sm:text-xs px-3 sm:px-4 py-1 sm:py-2 rounded-lg bg-blue-600 hover:bg-blue-700 transition-all shadow-md"
                      >
                        Detail
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm transition-all duration-300">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-md w-[90%] p-6 sm:p-8 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100 animate-fadeIn">
            <h2 className="text-xl sm:text-2xl font-bold border-b border-gray-300 dark:border-gray-700 pb-4 mb-4 text-center">
              🧾 Detail Pesanan
            </h2>

            <div className="space-y-3 text-sm sm:text-base">
              <p>
                <span className="font-medium">ID Pesanan:</span>{" "}
                {selectedOrder.order_id}
              </p>
              <p className="flex items-center gap-2">
                <span className="font-medium">Status:</span>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold text-white ${
                    selectedOrder.status?.trim().toLowerCase() === "approved"
                      ? "bg-green-500"
                      : selectedOrder.status?.trim().toLowerCase() === "pending"
                      ? "bg-yellow-500"
                      : "bg-red-500"
                  }`}
                >
                  {selectedOrder.status || "Pending"}
                </span>
              </p>
              <p>
                <span className="font-medium">Total:</span> Rp{" "}
                {selectedOrder.items
                  .reduce(
                    (total, item) =>
                      total + item.quantity * item.harga_saat_transaksi,
                    0
                  )
                  .toLocaleString("id-ID")}
              </p>
              <p>
                <span className="font-medium">Tanggal:</span>{" "}
                {new Date(selectedOrder.created_at).toLocaleDateString("id-ID")}
              </p>
              <p>
                <span className="font-medium">Waktu:</span>{" "}
                {new Date(selectedOrder.created_at).toLocaleTimeString(
                  "id-ID",
                  {
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                  }
                )}
              </p>
            </div>

            <div className="mt-6">
              <h3 className="text-base font-semibold border-b border-gray-300 dark:border-gray-700 pb-2 mb-3">
                🛍️ Produk Dipesan
              </h3>
              <ul className="space-y-2 max-h-48 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 dark:scrollbar-thumb-gray-600">
                {selectedOrder.items.map((item, i) => (
                  <li
                    key={i}
                    className="flex justify-between items-center bg-gray-100 dark:bg-gray-800 px-4 py-2 rounded-md"
                  >
                    <span className="truncate">
                      {item.coffee.nama_produk} × {item.quantity}
                    </span>
                    <span className="font-medium">
                      Rp {item.harga_saat_transaksi.toLocaleString("id-ID")}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <button
              onClick={() => setSelectedOrder(null)}
              className="mt-6 w-full bg-red-500 hover:bg-red-600 dark:bg-red-700 dark:hover:bg-red-800 text-white py-2.5 rounded-xl font-semibold transition-all duration-200"
            >
              Tutup
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
