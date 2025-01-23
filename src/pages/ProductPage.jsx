import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { supabase } from "../utils/SupaClient";
import { useNavigate } from "react-router-dom";
import { FaShoppingCart } from "react-icons/fa";
import Swal from "sweetalert2";
import LoadingBar from "react-top-loading-bar";
import Pagination from "../components/Pagination";

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
  const [progress, setProgress] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [ratingSortOrder, setRatingSortOrder] = useState("");
  const productsPerPage = 30;

  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setProgress(30);
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
        setProgress(100);
      }
    };

    fetchProducts();
  }, []);

  // Handle search
  const handleSearch = (query) => {
    setSearchQuery(query);
    const searchedProducts = products.filter((product) =>
      product.nama_produk.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredProducts(searchedProducts);
    setCurrentPage(1);
  };

  useEffect(() => {
    let sortedProducts = [...products];

    // Urutkan berdasarkan harga
    if (priceSortOrder) {
      sortedProducts.sort((a, b) =>
        priceSortOrder === "asc"
          ? a.harga_produk - b.harga_produk
          : b.harga_produk - a.harga_produk
      );
    }

    // Urutkan berdasarkan stok
    if (stockSortOrder) {
      sortedProducts.sort((a, b) =>
        stockSortOrder === "asc" ? a.stok - b.stok : b.stok - a.stok
      );
    }

    // Urutkan berdasarkan nama produk
    if (nameSortOrder) {
      sortedProducts.sort((a, b) =>
        nameSortOrder === "asc"
          ? a.nama_produk.localeCompare(b.nama_produk)
          : b.nama_produk.localeCompare(a.nama_produk)
      );
    }

    // Urutkan berdasarkan rating
    if (ratingSortOrder) {
      sortedProducts.sort((a, b) =>
        ratingSortOrder === "asc"
          ? (a.rating_produk || 0) - (b.rating_produk || 0)
          : (b.rating_produk || 0) - (a.rating_produk || 0)
      );
    }

    // Pindahkan produk dengan stok habis ke bawah
    sortedProducts = sortedProducts.sort((a, b) => {
      if (a.stok === 0 && b.stok !== 0) return 1; // Produk A habis, B ada stok
      if (b.stok === 0 && a.stok !== 0) return -1; // Produk B habis, A ada stok
      return 0; // Jika keduanya stoknya sama, urutkan berdasarkan kriteria lain
    });

    setFilteredProducts(sortedProducts);
    setCurrentPage(1); // Reset ke halaman pertama setelah sorting
  }, [
    priceSortOrder,
    stockSortOrder,
    nameSortOrder,
    ratingSortOrder,
    products,
  ]);

  // Pagination calculation
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

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

  // Reset filters
  const resetFilters = () => {
    setPriceSortOrder("");
    setStockSortOrder("");
    setNameSortOrder("");
    setRatingSortOrder(""); // Tambahkan reset untuk rating filter
    setSearchQuery("");
    setFilteredProducts(products);
    setCurrentPage(1); // Reset ke halaman pertama setelah reset filter
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
      <div className="min-h-screen py-6 dark:bg-gray-800">
        <div className="mb-8">
          <h1 className="mt-14 text-4xl font-bold text-center mb-4 text-gray-800 dark:text-white">
            Our Products
          </h1>
        </div>

        <div className="bg-white dark:bg-gray-900 py-6 px-4 lg:px-16">
          {/* Product Filter */}
          <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-8 mb-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                Product Filter
              </h2>

              <button
                onClick={() => navigate("/cart")}
                className="relative text-3xl text-[#ff6632] hover:text-[#ff5500] transition-all transform hover:scale-105 focus:outline-none"
              >
                <FaShoppingCart />
                {cartCount > 0 && (
                  <span className="absolute top-0 right-0 text-xs font-bold text-white bg-red-600 rounded-full px-2 py-0.5">
                    {cartCount}
                  </span>
                )}
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {/* Search Bar (Moved to the top) */}
              <div className="flex flex-col col-span-full">
                <label
                  htmlFor="search-bar"
                  className="text-sm font-semibold text-gray-700 dark:text-white mb-2"
                >
                  Search Product
                </label>
                <input
                  id="search-bar"
                  type="text"
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  placeholder="Search products..."
                  className="px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#ff6632] dark:bg-gray-700 dark:text-white text-sm"
                />
              </div>

              {/* Price Filter */}
              <div className="flex flex-col">
                <label
                  htmlFor="filter-harga"
                  className="text-sm font-semibold text-gray-700 dark:text-white mb-2"
                >
                  Price
                </label>
                <select
                  id="filter-harga"
                  value={priceSortOrder}
                  onChange={(e) => setPriceSortOrder(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-[#ff6632] dark:bg-gray-700 dark:text-white text-sm"
                >
                  <option value="">Select Price</option>
                  <option value="asc">Lowest Price</option>
                  <option value="desc">Highest Price</option>
                </select>
              </div>

              {/* Stock Filter */}
              <div className="flex flex-col">
                <label
                  htmlFor="filter-stok"
                  className="text-sm font-semibold text-gray-700 dark:text-white mb-2"
                >
                  Stock
                </label>
                <select
                  id="filter-stok"
                  value={stockSortOrder}
                  onChange={(e) => setStockSortOrder(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-[#ff6632] dark:bg-gray-700 dark:text-white text-sm"
                >
                  <option value="">Select Stock</option>
                  <option value="asc">Most Stock</option>
                  <option value="desc">Least Stock</option>
                </select>
              </div>

              {/* Name Filter */}
              <div className="flex flex-col">
                <label
                  htmlFor="filter-nama"
                  className="text-sm font-semibold text-gray-700 dark:text-white mb-2"
                >
                  Product Name
                </label>
                <select
                  id="filter-nama"
                  value={nameSortOrder}
                  onChange={(e) => setNameSortOrder(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-[#ff6632] dark:bg-gray-700 dark:text-white text-sm"
                >
                  <option value="">Select Name</option>
                  <option value="asc">A-Z</option>
                  <option value="desc">Z-A</option>
                </select>
              </div>

              {/* Rating Filter (Sejajar dengan filter lain) */}
              <div className="flex flex-col">
                <label
                  htmlFor="filter-rating"
                  className="text-sm font-semibold text-gray-700 dark:text-white mb-2"
                >
                  Rating
                </label>
                <select
                  id="filter-rating"
                  value={ratingSortOrder}
                  onChange={(e) => setRatingSortOrder(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-[#ff6632] dark:bg-gray-700 dark:text-white text-sm"
                >
                  <option value="">Select Rating</option>
                  <option value="asc">Lowest Rating</option>
                  <option value="desc">Highest Rating</option>
                </select>
              </div>
            </div>

            {/* Reset Button */}
            <div className="mt-6 flex justify-end">
              <button
                onClick={resetFilters}
                className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 focus:outline-none transition-all"
              >
                Reset Filters
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            {currentProducts.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-3xl shadow-lg overflow-hidden dark:bg-gray-900 dark:shadow-xl relative flex flex-col h-full"
                onClick={() => handleProductClick(product.id)}
              >
                <div className="relative group">
                  <img
                    src={product.foto_barang}
                    alt={product.nama_produk}
                    className="w-full h-72 object-cover rounded-t-3xl"
                  />
                  {product.stok === 0 && (
                    <div className="absolute inset-0 bg-black bg-opacity-70 flex justify-center items-center rounded-t-3xl">
                      <span className="text-white font-bold text-xl">
                        Out of Stock
                      </span>
                    </div>
                  )}
                </div>
                <div className="p-6 flex flex-col space-y-5 flex-grow">
                  <h2 className="text-2xl font-bold text-gray-800 dark:text-white truncate">
                    {product.nama_produk}
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-3">
                    {product.deskripsi}
                  </p>
                  <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                    <span>
                      <strong>Stock:</strong> {product.stok}
                    </span>
                    <span>
                      {product.rating_produk &&
                      !isNaN(Number(product.rating_produk))
                        ? `${parseFloat(
                            Number(product.rating_produk).toFixed(1)
                          )} ⭐`
                        : "No Rating"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-lg font-semibold text-orange-600 dark:text-orange-500">
                      {formatRupiah(product.harga_produk)}
                    </p>
                  </div>
                </div>

                {/* Kontainer untuk tombol yang selalu berada di bawah */}
                <div className="p-6 pt-0">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAddToCart(product.id);
                    }}
                    disabled={product.stok === 0}
                    className={`w-full py-2 px-5 rounded-full text-sm font-medium text-white transition-all duration-300 ease-in-out ${
                      product.stok === 0
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700"
                    }`}
                  >
                    {product.stok === 0 ? "Out of Stock" : "Add To Cart"}
                  </button>
                </div>
              </div>
            ))}
          </div>
          <Pagination
            totalPages={totalPages}
            currentPage={currentPage}
            onPageChange={handlePageChange}
          />
        </div>
      </div>
      <Footer />
    </>
  );
}
