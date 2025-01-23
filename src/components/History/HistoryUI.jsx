import { BiSearch } from "react-icons/bi"; // Import ikon pencarian

export default function HistoryUI({
  history,
  showNotification,
  searchQuery,
  setSearchQuery,
}) {
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
        <div className="relative w-7/12 mx-auto">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari produk atau Order ID..."
            className="w-full px-4 py-2 pl-12 border rounded-lg text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-700"
          />
          <BiSearch className="absolute top-1/2 left-4 transform -translate-y-1/2 text-gray-500 dark:text-gray-400" />
        </div>
      </div>

      {showNotification && (
        <div className="notification-slide-in">
          Terima kasih sudah memesan produk di website kami!
        </div>
      )}

      {filteredHistory.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-300 text-center">
          Belum ada riwayat pembayaran.
        </p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-7 gap-1 m-5">
          {filteredHistory.map((item) => {
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
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                  Order ID: {item.order_id}
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
