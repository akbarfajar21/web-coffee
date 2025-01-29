import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { supabase } from "../utils/SupaClient";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import LoadingBar from "react-top-loading-bar";
import Pagination from "../components/Pagination";
import { BsCart4 } from "react-icons/bs";

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
  }, []); // Kosongkan array dependensi

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
          navigate("/login");
        }
      });
      return;
    }

    // Menampilkan loading SweetAlert
    const swalLoading = Swal.fire({
      title: "Menambahkan ke Keranjang...",
      text: "Tunggu sebentar.",
      didOpen: () => Swal.showLoading(),
      allowOutsideClick: false,
      showConfirmButton: false,
    });

    try {
      const { data: cartData, error: cartError } = await supabase
        .from("cart")
        .select("*")
        .eq("profile_id", user.user.id)
        .eq("coffee_id", product)
        .single();

      if (cartData) {
        // Update quantity jika produk sudah ada di keranjang
        const updatedQuantity = cartData.quantity + 1;
        const { error: updateError } = await supabase
          .from("cart")
          .update({ quantity: updatedQuantity })
          .eq("profile_id", user.user.id)
          .eq("coffee_id", product);

        if (updateError) throw updateError;

        // Update jumlah di cartCount
        setCartCount((prevCount) => prevCount + 1);
      } else {
        // Insert produk baru ke keranjang
        const { error: insertError } = await supabase.from("cart").insert([
          {
            profile_id: user.user.id,
            coffee_id: product,
            quantity: 1,
          },
        ]);

        if (insertError) throw insertError;

        // Update jumlah di cartCount
        setCartCount((prevCount) => prevCount + 1);
      }

      // Animasi keranjang
      setCartAnimation(true);
      setTimeout(() => setCartAnimation(false), 1000);
    } catch (error) {
      console.error("Error handling cart:", error.message);
      Swal.fire({
        title: "Gagal!",
        text: "Terjadi kesalahan saat menambahkan ke keranjang.",
        icon: "error",
        confirmButtonText: "Tutup",
        confirmButtonColor: "#ff6632",
      });
    } finally {
      setTimeout(() => {
        swalLoading.close();
      }, 2000);
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
          <div className="bg-white dark:bg-gray-800 shadow-xl rounded-2xl p-6 mb-10 transition-all duration-300 ease-in-out">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl lg:text-2xl font-extrabold text-gray-800 dark:text-white">
                Product Filter
              </h2>
              <button
                onClick={() => navigate("/cart")}
                className="relative text-3xl text-[#ff6632] hover:text-[#ff5500] transition-transform duration-300 hover:scale-110 focus:outline-none"
              >
                <BsCart4 />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 text-xs font-bold text-white bg-red-600 rounded-full px-2 py-0.5">
                    {cartCount}
                  </span>
                )}
              </button>
            </div>

            {/* Search Bar */}
            <div className="mb-6">
              <label
                htmlFor="search-bar"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Search Product
              </label>
              <input
                id="search-bar"
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Type to search..."
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg shadow-md focus:ring-2 focus:ring-[#ff6632] dark:bg-gray-700 dark:text-white text-sm transition-all"
              />
            </div>

            {/* Filter Options */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[
                {
                  id: "filter-harga",
                  label: "Price",
                  value: priceSortOrder,
                  onChange: setPriceSortOrder,
                  options: [
                    { value: "", label: "Select Price" },
                    { value: "asc", label: "Lowest Price" },
                    { value: "desc", label: "Highest Price" },
                  ],
                },
                {
                  id: "filter-stok",
                  label: "Stock",
                  value: stockSortOrder,
                  onChange: setStockSortOrder,
                  options: [
                    { value: "", label: "Select Stock" },
                    { value: "asc", label: "Most Stock" },
                    { value: "desc", label: "Least Stock" },
                  ],
                },
                {
                  id: "filter-nama",
                  label: "Product Name",
                  value: nameSortOrder,
                  onChange: setNameSortOrder,
                  options: [
                    { value: "", label: "Select Name" },
                    { value: "asc", label: "A-Z" },
                    { value: "desc", label: "Z-A" },
                  ],
                },
                {
                  id: "filter-rating",
                  label: "Rating",
                  value: ratingSortOrder,
                  onChange: setRatingSortOrder,
                  options: [
                    { value: "", label: "Select Rating" },
                    { value: "asc", label: "Lowest Rating" },
                    { value: "desc", label: "Highest Rating" },
                  ],
                },
              ].map(({ id, label, value, onChange, options }) => (
                <div key={id} className="flex flex-col">
                  <label
                    htmlFor={id}
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >
                    {label}
                  </label>
                  <select
                    id={id}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg shadow-md focus:ring-2 focus:ring-[#ff6632] dark:bg-gray-700 dark:text-white text-sm transition-all"
                  >
                    {options.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              ))}
            </div>

            {/* Reset Button */}
            <div className="mt-6 flex justify-end">
              <button
                onClick={resetFilters}
                className="px-6 py-3 bg-[#ff6632] text-white font-semibold rounded-lg shadow-md hover:bg-[#ff5500] transition-transform duration-300 ease-in-out focus:outline-none"
              >
                Reset Filters
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-2">
            {currentProducts.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-lg shadow-md overflow-hidden dark:bg-gray-800 dark:shadow-lg flex flex-col h-full hover:shadow-xl transition-shadow duration-300 ease-in-out max-w-sm mx-auto sm:max-w-xs"
                onClick={() => handleProductClick(product.id)}
              >
                <div className="relative group">
                  <img
                    src={product.foto_barang}
                    alt={product.nama_produk}
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                  {product.stok === 0 && (
                    <div className="absolute inset-0 bg-black bg-opacity-60 flex justify-center items-center rounded-t-lg">
                      <span className="text-white font-semibold text-sm">
                        Out of Stock
                      </span>
                    </div>
                  )}
                </div>

                {/* Content Section */}
                <div className="p-4 flex flex-col justify-between flex-grow">
                  {/* Product Name */}
                  <h2 className="text-sm font-semibold text-gray-800 dark:text-white truncate mb-2">
                    {product.nama_produk}
                  </h2>

                  {/* Description */}
                  <p className="text-xs text-gray-600 dark:text-gray-300 mt-2 line-clamp-3 mb-4">
                    {product.deskripsi}
                  </p>

                  {/* Stock and Rating */}
                  <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400 mt-2">
                    <span className="flex items-center space-x-1">
                      <i className="fas fa-box"></i>
                      <span>
                        <strong>Stock:</strong> {product.stok}
                      </span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <i className="fas  text-yellow-400"></i>
                      <span>
                        {product.rating_produk &&
                        !isNaN(Number(product.rating_produk))
                          ? `${parseFloat(
                              Number(product.rating_produk).toFixed(1)
                            )} ⭐`
                          : "No Rating"}
                      </span>
                    </span>
                  </div>

                  {/* Price */}
                  <p className="text-lg font-semibold text-orange-500 dark:text-orange-400 mt-4">
                    {formatRupiah(product.harga_produk)}
                  </p>
                </div>

                {/* Add to Cart Button */}
                <div className="p-4 pt-0">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAddToCart(product.id);
                    }}
                    disabled={product.stok === 0}
                    className={`w-full py-2 rounded-lg text-sm font-medium text-white transition-all duration-300 ease-in-out ${
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
