import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { supabase } from "../utils/SupaClient";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { FaShoppingCart } from "react-icons/fa";
import { ClipLoader } from "react-spinners";

export default function ProductPage() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [priceSortOrder, setPriceSortOrder] = useState("");
  const [stockSortOrder, setStockSortOrder] = useState("");
  const [nameSortOrder, setNameSortOrder] = useState("");
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem("cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });

  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("coffee")
          .select(
            "id, nama_produk, harga_produk, deskripsi, stok, foto_barang"
          );

        if (error) throw error;
        setProducts(data);
        setFilteredProducts(data);
      } catch (error) {
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

  useEffect(() => {
    const handleSort = () => {
      let sortedProducts = [...products]; // Use the original products, not filteredProducts

      // Sorting logic...
      if (priceSortOrder) {
        sortedProducts.sort((a, b) =>
          priceSortOrder === "asc"
            ? a.harga_produk - b.harga_produk
            : b.harga_produk - a.harga_produk
        );
      }

      if (stockSortOrder) {
        sortedProducts.sort((a, b) =>
          stockSortOrder === "asc" ? a.stok - b.stok : b.stok - a.stok
        );
      }

      if (nameSortOrder) {
        sortedProducts.sort((a, b) =>
          nameSortOrder === "asc"
            ? a.nama_produk.localeCompare(b.nama_produk)
            : b.nama_produk.localeCompare(a.nama_produk)
        );
      }

      setFilteredProducts(sortedProducts); // Update filteredProducts here
    };

    handleSort();
  }, [priceSortOrder, stockSortOrder, nameSortOrder, products]); // Remove filteredProducts from the dependency array
  const handleAddToCart = (product) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id);
      if (existingItem) {
        return prevCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      const updatedCart = [...prevCart, { ...product, quantity: 1 }];
      localStorage.setItem("cart", JSON.stringify(updatedCart));
      return updatedCart;
    });
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    const searchedProducts = products.filter((product) =>
      product.nama_produk.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredProducts(searchedProducts);
  };

  const resetFilters = () => {
    setPriceSortOrder("");
    setStockSortOrder("");
    setNameSortOrder("");
    setSearchQuery("");
    setFilteredProducts(products);
  };

  const formatRupiah = (amount) => {
    return "Rp " + amount.toLocaleString("id-ID");
  };

  const handleProductClick = (productId) => {
    navigate(`/product-detail/${productId}`); // Navigate to the product detail page
  };

  return (
    <>
      <Header />
      <div className="min-h-screen py-8 px-4 lg:px-12">
        <div className="mb-8">
          <h1 className="mt-10 text-4xl font-bold text-center mb-4 text-gray-800">
            Produk Kami
          </h1>
        </div>

        <div className="flex justify-end mb-8 space-x-4">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Cari produk..."
            className="w-full max-w-md px-4 py-3 border justify-center border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#ff6632]"
          />

          <button
            onClick={() => navigate("/cart")}
            className="relative text-2xl text-[#ff6632]"
          >
            <FaShoppingCart />
            {cart.length > 0 && (
              <span className="absolute top-0 right-0 text-xs font-bold text-white bg-red-600 rounded-full px-2">
                {cart.reduce((total, item) => total + item.quantity, 0)}
              </span>
            )}
          </button>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
          <aside className="bg-white rounded-lg shadow-lg p-6 space-y-6 divide-y divide-gray-200">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">
              <span className="flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 mr-2 text-orange-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                </svg>
                Filter Produk
              </span>
            </h2>

            <div className="pt-4">
              <h3 className="text-lg font-semibold text-gray-700 mb-3">
                Harga
              </h3>
              <div className="space-y-3">
                <label className="flex items-center space-x-3 text-base text-gray-600">
                  <input
                    type="radio"
                    name="priceSort"
                    value="asc"
                    checked={priceSortOrder === "asc"}
                    onChange={() => setPriceSortOrder("asc")}
                    className="h-5 w-5 border-gray-300 text-orange-500 focus:ring-orange-500 rounded-full"
                  />
                  <span>Harga Termurah</span>
                </label>
                <label className="flex items-center space-x-3 text-base text-gray-600">
                  <input
                    type="radio"
                    name="priceSort"
                    value="desc"
                    checked={priceSortOrder === "desc"}
                    onChange={() => setPriceSortOrder("desc")}
                    className="h-5 w-5 border-gray-300 text-orange-500 focus:ring-orange-500 rounded-full"
                  />
                  <span>Harga Termahal</span>
                </label>
              </div>
            </div>

            <div className="pt-4">
              <h3 className="text-lg font-semibold text-gray-700 mb-3">Stok</h3>
              <div className="space-y-3">
                <label className="flex items-center space-x-3 text-base text-gray-600">
                  <input
                    type="radio"
                    name="stockSort"
                    value="asc"
                    checked={stockSortOrder === "asc"}
                    onChange={() => setStockSortOrder("asc")}
                    className="h-5 w-5 border-gray-300 text-orange-500 focus:ring-orange-500 rounded-full"
                  />
                  <span>Stok Terdikit</span>
                </label>
                <label className="flex items-center space-x-3 text-base text-gray-600">
                  <input
                    type="radio"
                    name="stockSort"
                    value="desc"
                    checked={stockSortOrder === "desc"}
                    onChange={() => setStockSortOrder("desc")}
                    className="h-5 w-5 border-gray-300 text-orange-500 focus:ring-orange-500 rounded-full"
                  />
                  <span>Stok Terbanyak</span>
                </label>
              </div>
            </div>

            <div className="pt-4">
              <h3 className="text-lg font-semibold text-gray-700 mb-3">
                Nama Produk
              </h3>
              <div className="space-y-3">
                <label className="flex items-center space-x-3 text-base text-gray-600">
                  <input
                    type="radio"
                    name="nameSort"
                    value="asc"
                    checked={nameSortOrder === "asc"}
                    onChange={() => setNameSortOrder("asc")}
                    className="h-5 w-5 border-gray-300 text-orange-500 focus:ring-orange-500 rounded-full"
                  />
                  <span>A-Z</span>
                </label>
                <label className="flex items-center space-x-3 text-base text-gray-600">
                  <input
                    type="radio"
                    name="nameSort"
                    value="desc"
                    checked={nameSortOrder === "desc"}
                    onChange={() => setNameSortOrder("desc")}
                    className="h-5 w-5 border-gray-300 text-orange-500 focus:ring-orange-500 rounded-full"
                  />
                  <span>Z-A</span>
                </label>
              </div>
            </div>

            <button
              onClick={resetFilters}
              className="w-full bg-orange-500 text-white font-semibold px-4 py-3 rounded-lg shadow-md hover:bg-orange-600 transition-all mt-6"
            >
              Reset Filter
            </button>
          </aside>

          <div className="lg:col-span-3">
            {loading ? (
              <div className="flex justify-center items-center h-full">
                <ClipLoader color="#ff6632" size={60} />
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                {filteredProducts.map((product, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
                    onClick={() => handleProductClick(product.id)} // Klik pada card
                  >
                    <div className="relative group">
                      <img
                        src={product.foto_barang}
                        alt={product.nama_produk}
                        className="w-full h-56 object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      {product.stok === 0 && (
                        <div className="absolute inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                          <span className="text-white font-semibold text-xl">
                            Stok Habis
                          </span>
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
                      <div className="text-sm text-gray-600 mb-4">
                        <strong>Stok: </strong>
                        {product.stok}
                      </div>
                      <div className="flex justify-between items-center mt-auto">
                        <p className="text-base font-bold text-orange-600">
                          {formatRupiah(product.harga_produk)}
                        </p>
                        <button
                          onClick={(e) => {
                            e.stopPropagation(); // Mencegah event bubbling
                            handleAddToCart(product);
                          }}
                          className={`bg-[#ff6632] text-white px-4 py-2 rounded-lg hover:bg-[#ff5511] transition-colors 
                          ${
                            product.stok === 0
                              ? "bg-gray-400 cursor-not-allowed"
                              : ""
                          }
                        `}
                          disabled={product.stok === 0}
                        >
                          {product.stok === 0 ? (
                            "Stok Habis"
                          ) : (
                            <div className="flex items-center space-x-2">
                              <FaShoppingCart />
                              <span className="hidden sm:inline">
                                Add to Cart
                              </span>
                            </div>
                          )}
                        </button>
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
