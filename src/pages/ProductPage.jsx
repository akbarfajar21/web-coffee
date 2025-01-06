import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { supabase } from "../utils/SupaClient";
import Swal from "sweetalert2";

export default function ProductPage() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [priceSortOrder, setPriceSortOrder] = useState("");
  const [stockSortOrder, setStockSortOrder] = useState("");
  const [nameSortOrder, setNameSortOrder] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("coffee")
          .select("nama_produk, harga_produk, deskripsi, stok, foto_barang");

        if (error) throw error;
        setProducts(data);
        setFilteredProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error.message);

        Swal.fire({
          title: "Koneksi Gagal!",
          text: "Gagal memuat produk. Silakan periksa koneksi Anda.",
          imageUrl: "/NoConnection.gif",
          imageWidth: 400,
          imageHeight: 400,
          imageAlt: "No connection",
          confirmButtonText: "Coba Lagi",
          confirmButtonColor: "#ff6632",
        }).then(() => {
          fetchProducts();
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleSearch = (query) => {
    setSearchQuery(query);
    const searchedProducts = products.filter((product) =>
      product.nama_produk.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredProducts(searchedProducts);
  };

  const handleSort = () => {
    let sortedProducts = [...filteredProducts];

    if (priceSortOrder) {
      sortedProducts.sort((a, b) =>
        priceSortOrder === "asc"
          ? a.harga_produk - b.harga_produk
          : b.harga_produk - a.harga_produk
      );
    }

    if (nameSortOrder) {
      sortedProducts.sort((a, b) =>
        nameSortOrder === "asc"
          ? a.nama_produk.localeCompare(b.nama_produk)
          : b.nama_produk.localeCompare(a.nama_produk)
      );
    }

    if (stockSortOrder) {
      sortedProducts.sort((a, b) =>
        stockSortOrder === "asc" ? a.stok - b.stok : b.stok - a.stok
      );
    }

    setFilteredProducts(sortedProducts);
  };

  useEffect(() => {
    handleSort();
  }, [priceSortOrder, stockSortOrder, nameSortOrder]);

  const resetFilters = () => {
    setPriceSortOrder("");
    setStockSortOrder("");
    setNameSortOrder("");
    setSearchQuery("");
    setFilteredProducts(products);
  };

  return (
    <>
      <Header />
      <div className="min-h-screen py-8 px-4 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <aside className="bg-gradient-to-b from-[#ffedd5] to-[#fff1e0] rounded-lg shadow-md p-6 mt-9">
            <h2 className="text-xl font-semibold mb-6 text-gray-800">
              Filter Produk
            </h2>
            <div>
              <h3 className="text-lg font-medium text-gray-700 mb-4">
                Urutkan Berdasarkan
              </h3>
              <div className="space-y-3">
                <h4 className="font-medium text-gray-700">Harga</h4>
                <label
                  className="flex items-center space-x-3 p-3 bg-white rounded-lg shadow-sm hover:shadow-md cursor-pointer"
                  htmlFor="desc-price"
                >
                  <input
                    id="desc-price"
                    type="radio"
                    name="priceSortOrder"
                    value="desc"
                    className="form-radio text-[#ff6632]"
                    checked={priceSortOrder === "desc"}
                    onChange={() => setPriceSortOrder("desc")}
                  />
                  <span className="text-gray-800 font-medium">
                    Harga Tertinggi
                  </span>
                </label>
                <label
                  className="flex items-center space-x-3 p-3 bg-white rounded-lg shadow-sm hover:shadow-md cursor-pointer"
                  htmlFor="asc-price"
                >
                  <input
                    id="asc-price"
                    type="radio"
                    name="priceSortOrder"
                    value="asc"
                    className="form-radio text-[#ff6632]"
                    checked={priceSortOrder === "asc"}
                    onChange={() => setPriceSortOrder("asc")}
                  />
                  <span className="text-gray-800 font-medium">
                    Harga Terendah
                  </span>
                </label>

                <h4 className="font-medium text-gray-700">Stok</h4>
                <label
                  className="flex items-center space-x-3 p-3 bg-white rounded-lg shadow-sm hover:shadow-md cursor-pointer"
                  htmlFor="desc-stock"
                >
                  <input
                    id="desc-stock"
                    type="radio"
                    name="stockSortOrder"
                    value="desc"
                    className="form-radio text-[#ff6632]"
                    checked={stockSortOrder === "desc"}
                    onChange={() => setStockSortOrder("desc")}
                  />
                  <span className="text-gray-800 font-medium">
                    Stok Terbanyak
                  </span>
                </label>
                <label
                  className="flex items-center space-x-3 p-3 bg-white rounded-lg shadow-sm hover:shadow-md cursor-pointer"
                  htmlFor="asc-stock"
                >
                  <input
                    id="asc-stock"
                    type="radio"
                    name="stockSortOrder"
                    value="asc"
                    className="form-radio text-[#ff6632]"
                    checked={stockSortOrder === "asc"}
                    onChange={() => setStockSortOrder("asc")}
                  />
                  <span className="text-gray-800 font-medium">
                    Stok Terdikit
                  </span>
                </label>

                <h4 className="font-medium text-gray-700">Nama</h4>
                <label
                  className="flex items-center space-x-3 p-3 bg-white rounded-lg shadow-sm hover:shadow-md cursor-pointer"
                  htmlFor="asc-name"
                >
                  <input
                    id="asc-name"
                    type="radio"
                    name="nameSortOrder"
                    value="asc"
                    className="form-radio text-[#ff6632]"
                    checked={nameSortOrder === "asc"}
                    onChange={() => setNameSortOrder("asc")}
                  />
                  <span className="text-gray-800 font-medium">Nama A-Z</span>
                </label>
                <label
                  className="flex items-center space-x-3 p-3 bg-white rounded-lg shadow-sm hover:shadow-md cursor-pointer"
                  htmlFor="desc-name"
                >
                  <input
                    id="desc-name"
                    type="radio"
                    name="nameSortOrder"
                    value="desc"
                    className="form-radio text-[#ff6632]"
                    checked={nameSortOrder === "desc"}
                    onChange={() => setNameSortOrder("desc")}
                  />
                  <span className="text-gray-800 font-medium">Nama Z-A</span>
                </label>

                <button
                  onClick={resetFilters}
                  className="w-full p-3 mt-4 bg-red-500 text-white rounded-lg hover:bg-red-600 focus:outline-none"
                >
                  Reset Filter
                </button>
              </div>
            </div>
          </aside>

          <div className="lg:col-span-3">
            <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">
              Produk Kami
            </h1>
            <div className="flex justify-center mb-8">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Cari produk..."
                className="w-full max-w-md px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#ff6632]"
              />
            </div>
            {loading ? (
              <p className="text-center text-gray-500">Memuat produk...</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
                  >
                    <div className="relative">
                      <img
                        src={product.foto_barang}
                        alt={product.nama_produk}
                        className="w-full h-56 object-cover"
                      />
                      {product.stok === 0 && (
                        <div className="absolute top-2 left-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">
                          Habis
                        </div>
                      )}
                    </div>
                    <div className="p-6 flex flex-col">
                      <h2 className="text-lg font-semibold text-gray-800 mb-2">
                        {product.nama_produk}
                      </h2>
                      <p className="text-sm text-gray-600 flex-grow mb-4 line-clamp-3">
                        {product.deskripsi}
                      </p>
                      <div className="flex justify-between items-center mt-auto">
                        <p className="text-base font-bold text-orange-600">
                          Rp {product.harga_produk}
                        </p>
                        <p
                          className={`text-sm font-medium ${
                            product.stok > 0 ? "text-green-600" : "text-red-600"
                          }`}
                        >
                          Stok: {product.stok > 0 ? product.stok : "Habis"}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
