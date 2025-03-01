import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { BiSearch } from "react-icons/bi";
import { useSearchParams } from "react-router-dom";

export default function HistoryUI({
  history,
  showNotification,
  searchQuery, // Diterima dari props
  setSearchQuery, // Diterima dari props
}) {
  const [selectedOrder, setSelectedOrder] = useState(null);
  useEffect(() => {
    const queryFromUrl = searchParams.get("q") || "";
    setSearchQuery(queryFromUrl);
  }, []);

  const [searchParams, setSearchParams] = useSearchParams();

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

    // Ambil query dari URL saat pertama kali halaman dimuat
    const queryFromUrl = searchParams.get("q") || "";
    setSearchQuery(queryFromUrl);
  }, []);

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
      item.coffee.nama_produk
        .toLowerCase()
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
            placeholder="Cari produk atau Order ID..."
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
            Riwayat pembelian masih kosong
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            Yuk, mulai belanja dan temukan kopi favoritmu!
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
                  <th className="px-3 sm:px-4 py-2 sm:py-3">Order ID</th>
                  <th className="px-3 sm:px-4 py-2 sm:py-3 hidden sm:table-cell">
                    Total
                  </th>
                  <th className="px-3 sm:px-4 py-2 sm:py-3">Status</th>
                  <th className="px-3 sm:px-4 py-2 sm:py-3">Action</th>
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
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white dark:bg-gray-900 p-5 sm:p-7 rounded-lg shadow-xl max-w-xs sm:max-w-sm md:max-w-md w-full text-gray-900 dark:text-gray-200 border dark:border-gray-700">
            <h2 className="text-lg sm:text-xl font-semibold border-b pb-3 mb-4">
              Detail Pesanan
            </h2>

            <p className="mb-2">
              <strong>Order ID:</strong> {selectedOrder.order_id}
            </p>

            <p className="mb-2">
              <strong>Status:</strong>{" "}
              <span
                className={`px-3 py-1 rounded-md text-white text-sm ${
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

            <p className="mb-2">
              <strong>Total:</strong> Rp{" "}
              {selectedOrder.items
                .reduce(
                  (total, item) =>
                    total + item.quantity * item.harga_saat_transaksi,
                  0
                )
                .toLocaleString("id-ID")}
            </p>

            <p className="mb-3">
              <strong>Tanggal:</strong>{" "}
              {new Date(selectedOrder.created_at).toLocaleString("id-ID")}
            </p>

            <h3 className="font-semibold border-b pb-2 mb-3">Item Pesanan:</h3>
            <ul className="list-none space-y-2">
              {selectedOrder.items.map((item, i) => (
                <li
                  key={i}
                  className="bg-gray-100 dark:bg-gray-800 px-3 py-2 rounded-md"
                >
                  {item.coffee.nama_produk} - {item.quantity}x Rp{" "}
                  {item.harga_saat_transaksi.toLocaleString("id-ID")}
                </li>
              ))}
            </ul>

            <button
              onClick={() => setSelectedOrder(null)}
              className="mt-5 w-full bg-red-500 dark:bg-red-700 text-white py-2 rounded-lg font-medium hover:bg-red-600 dark:hover:bg-red-800"
            >
              Tutup
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
