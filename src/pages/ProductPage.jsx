import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { supabase } from "../utils/SupaClient";
import { useNavigate } from "react-router-dom";
import { FaShoppingCart } from "react-icons/fa";
import { Checkbox } from "@nextui-org/react";
import { Card, Skeleton } from "@nextui-org/react";
import Swal from "sweetalert2";
import LoadingBar from "react-top-loading-bar"; // Import LoadingBar

export default function ProductPage() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [priceSortOrder, setPriceSortOrder] = useState("");
  const [stockSortOrder, setStockSortOrder] = useState("");
  const [nameSortOrder, setNameSortOrder] = useState("");
  const [cart, setCart] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [cartAnimation, setCartAnimation] = useState(false);
  const [progress, setProgress] = useState(0); // State for loading bar

  const navigate = useNavigate();

  // Fetch products from Supabase
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setProgress(30); // Set progress on fetch start
      try {
        const { data, error } = await supabase
          .from("coffee")
          .select(
            "id, nama_produk, harga_produk, deskripsi, stok, foto_barang, rating_produk"
          );

        if (error) throw error;
        setProducts(data);
        setFilteredProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error.message);
      } finally {
        setLoading(false);
        setProgress(100); // Set progress to 100% when fetch is done
      }
    };

    fetchProducts();
  }, []);

  // Fetch cart from Supabase
  useEffect(() => {
    const fetchCart = async () => {
      const { data: user } = await supabase.auth.getUser();
      if (!user) return;

      const { data: cartData, error: cartError } = await supabase
        .from("cart")
        .select("coffee_id, quantity")
        .eq("profile_id", user.user.id);

      if (cartError) {
        console.error("Error fetching cart:", cartError.message);
      } else {
        setCart(cartData);
        const totalItems = cartData.reduce(
          (acc, item) => acc + item.quantity,
          0
        );
        setCartCount(totalItems);
      }
    };

    fetchCart();
  }, [cart]);

  useEffect(() => {
    const handleSort = () => {
      let sortedProducts = [...products];
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

      setFilteredProducts(sortedProducts);
    };

    handleSort();
  }, [priceSortOrder, stockSortOrder, nameSortOrder, products]);

  // Handle search
  const handleSearch = (query) => {
    setSearchQuery(query);
    const searchedProducts = products.filter((product) =>
      product.nama_produk.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredProducts(searchedProducts);
  };

  // Reset filters
  const resetFilters = () => {
    setPriceSortOrder("");
    setStockSortOrder("");
    setNameSortOrder("");
    setSearchQuery("");
    setFilteredProducts(products);
  };

  // Format currency
  const formatRupiah = (amount) => {
    return "Rp " + amount.toLocaleString("id-ID");
  };

  // Handle Add to Cart functionality
  const handleAddToCart = async (product) => {
    const { data: user, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      Swal.fire({
        title: "Oops!",
        text: "Silakan login terlebih dahulu untuk menambahkan produk ke keranjang.",
        icon: "warning",
        confirmButtonText: "Login Sekarang",
        confirmButtonColor: "#ff6632",
      }).then((result) => {
        if (result.isConfirmed) {
          navigate("/login"); // Arahkan ke halaman login
        }
      });
      return;
    }

    // Menampilkan SweetAlert loading
    const swalLoading = Swal.fire({
      title: "Menambahkan ke Keranjang...",
      text: "Tunggu sebentar.",
      didOpen: () => {
        Swal.showLoading(); // Menampilkan loading spinner
      },
      allowOutsideClick: false,
      showConfirmButton: false, // Tidak menampilkan tombol konfirmasi
    });

    // Cek apakah produk sudah ada di keranjang
    const { data: cartData, error: cartError } = await supabase
      .from("cart")
      .select("*")
      .eq("profile_id", user.user.id)
      .eq("coffee_id", product)
      .single();

    if (cartData) {
      // Jika produk sudah ada, update quantity
      const updatedQuantity = cartData.quantity + 1;
      const { error: updateError } = await supabase
        .from("cart")
        .update({ quantity: updatedQuantity })
        .eq("profile_id", user.user.id)
        .eq("coffee_id", product);

      if (updateError) {
        console.error("Error updating cart:", updateError.message);
        swalLoading.close();
      } else {
        setCartAnimation(true);
        setTimeout(() => setCartAnimation(false), 1000);

        // Tampilkan SweetAlert loading lebih lama sebelum menutup
        setTimeout(() => {
          swalLoading.close(); // Menutup loading setelah 2 detik
        }, 2000); // Atur delay 2 detik (atau 3000 untuk 3 detik)
      }
    } else {
      const { error: insertError } = await supabase.from("cart").insert([
        {
          profile_id: user.user.id,
          coffee_id: product,
          quantity: 1,
        },
      ]);

      if (insertError) {
        console.error("Error inserting to cart:", insertError.message);
        swalLoading.close(); // Menutup loading jika ada error
      } else {
        setCartAnimation(true);
        setTimeout(() => setCartAnimation(false), 1000);

        setTimeout(() => {
          swalLoading.close();
        }, 2000);
      }
    }
  };

  // Navigate to product detail
  const handleProductClick = (productId) => {
    navigate(`/product-detail/${productId}`);
  };

  return (
    <>
      <LoadingBar
        color="#ff6632"
        progress={progress}
        onLoaderFinished={() => setProgress(0)}
      />
      <Header />
      <div className="min-h-screen py-6 px-4 lg:px-12 dark:bg-gray-800">
        <div className="mb-8">
          <h1 className="mt-14 text-4xl font-bold text-center mb-4 text-gray-800 dark:text-white">
            Produk Kami
          </h1>
        </div>

        <div className="flex justify-end mb-8 space-x-4">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Cari produk..."
            className="w-full max-w-md px-4 py-3 border justify-center border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#ff6632] dark:bg-gray-700 dark:text-white"
          />
          <button
            onClick={() => navigate("/cart")}
            className={`relative text-2xl text-[#ff6632] ${
              cartAnimation ? "animate-bounce" : ""
            }`}
          >
            <FaShoppingCart />
            {cartCount > 0 && (
              <span className="absolute top-0 right-0 text-xs font-bold text-white bg-red-600 rounded-full px-2">
                {cartCount}
              </span>
            )}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
          <aside className="bg-white rounded-lg shadow-lg p-3 space-y-4 divide-y divide-gray-200 dark:bg-gray-700 dark:text-white text-sm">
            <h2 className="text-lg font-bold mb-3 text-gray-800 dark:text-white">
              Filter Produk
            </h2>

            {/* Filter Harga */}
            <div className="pt-3">
              <h3 className="text-sm font-semibold text-gray-700 dark:text-white mb-2">
                Harga
              </h3>
              <select
                value={priceSortOrder}
                onChange={(e) => setPriceSortOrder(e.target.value)}
                className="w-full border-gray-300 bg-white dark:bg-gray-700 dark:text-white rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#ff6632] p-1 text-sm"
              >
                <option value="">Pilih Harga</option>
                <option value="asc">Harga Termurah</option>
                <option value="desc">Harga Termahal</option>
              </select>
            </div>

            {/* Filter Stok */}
            <div className="pt-3">
              <h3 className="text-sm font-semibold text-gray-700 dark:text-white mb-2">
                Stok
              </h3>
              <select
                value={stockSortOrder}
                onChange={(e) => setStockSortOrder(e.target.value)}
                className="w-full border-gray-300 bg-white dark:bg-gray-700 dark:text-white rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#ff6632] p-1 text-sm"
              >
                <option value="">Pilih Stok</option>
                <option value="asc">Stok Terdikit</option>
                <option value="desc">Stok Terbanyak</option>
              </select>
            </div>

            {/* Filter Nama */}
            <div className="pt-3">
              <h3 className="text-sm font-semibold text-gray-700 dark:text-white mb-2">
                Nama
              </h3>
              <select
                value={nameSortOrder}
                onChange={(e) => setNameSortOrder(e.target.value)}
                className="w-full border-gray-300 bg-white dark:bg-gray-700 dark:text-white rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#ff6632] p-1 text-sm"
              >
                <option value="">Pilih Nama</option>
                <option value="asc">A - Z</option>
                <option value="desc">Z - A</option>
              </select>
            </div>

            <button
              onClick={resetFilters}
              className="w-full bg-orange-500 text-white font-semibold px-3 py-1 rounded-lg shadow-md hover:bg-orange-600 transition-all mt-3 text-sm"
            >
              Reset Filter
            </button>
          </aside>

          <div className="lg:col-span-3">
            {filteredProducts.length === 0 ? (
              <div className="flex justify-center items-center h-full text-center text-gray-600 dark:text-white">
                <p>Produk tidak tersedia</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
                {filteredProducts.map((product) => (
                  <div
                    key={product.id}
                    className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden dark:bg-gray-800"
                    onClick={() => handleProductClick(product.id)}
                  >
                    <div className="relative group">
                      {/* Gambar produk */}
                      <img
                        src={product.foto_barang}
                        alt={product.nama_produk}
                        className="w-full h-64 object-cover rounded-t-2xl"
                      />
                      {product.stok === 0 && (
                        <div className="absolute inset-0 bg-black bg-opacity-50 flex justify-center items-center rounded-t-2xl">
                          <span className="text-white font-semibold text-lg">
                            Stok Habis
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="p-6 flex flex-col space-y-4">
                      {/* Nama produk */}
                      <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
                        {product.nama_produk}
                      </h2>
                      {/* Deskripsi produk */}
                      <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                        {product.deskripsi}
                      </p>
                      {/* Stok dan Rating */}
                      <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                        <span>
                          <strong>Stok:</strong> {product.stok}
                        </span>
                        <span>
                          {product.rating_produk
                            ? `${product.rating_produk} ⭐`
                            : "No Rating"}
                        </span>
                      </div>
                      {/* Harga produk */}
                      <p className="text-lg font-bold text-orange-600 dark:text-orange-500">
                        {formatRupiah(product.harga_produk)}
                      </p>
                      {/* Tombol Tambah ke Keranjang */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAddToCart(product.id);
                        }}
                        disabled={product.stok === 0}
                        className={`mt-3 w-full py-3 rounded-lg text-sm font-medium text-white transition-colors ${
                          product.stok === 0
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700"
                        }`}
                      >
                        {product.stok === 0
                          ? "Stok Habis"
                          : "Tambah ke Keranjang"}
                      </button>
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
