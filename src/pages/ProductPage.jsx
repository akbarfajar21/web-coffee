import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import { supabase } from "../utils/SupaClient";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import LoadingBar from "react-top-loading-bar";
import Pagination from "../components/Pagination";
import { BsCart4, BsFilter } from "react-icons/bs";
import { IoClose } from "react-icons/io5";
import { Helmet } from "react-helmet";

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
  const [progress, setProgress] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [ratingSortOrder, setRatingSortOrder] = useState("");
  const productsPerPage = 24;
  const navigate = useNavigate();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

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

    // Urutkan berdasarkan harga jika dipilih
    if (priceSortOrder) {
      sortedProducts.sort((a, b) =>
        priceSortOrder === "asc"
          ? a.harga_produk - b.harga_produk
          : b.harga_produk - a.harga_produk
      );
    }

    // Urutkan berdasarkan stok jika dipilih
    if (stockSortOrder) {
      sortedProducts.sort((a, b) =>
        stockSortOrder === "asc" ? a.stok - b.stok : b.stok - a.stok
      );
    }

    // Urutkan berdasarkan nama produk jika dipilih
    if (nameSortOrder) {
      sortedProducts.sort((a, b) =>
        nameSortOrder === "asc"
          ? a.nama_produk.localeCompare(b.nama_produk)
          : b.nama_produk.localeCompare(a.nama_produk)
      );
    }

    // Urutkan berdasarkan rating jika dipilih
    if (ratingSortOrder) {
      sortedProducts.sort((a, b) =>
        ratingSortOrder === "asc"
          ? (a.rating_produk || 0) - (b.rating_produk || 0)
          : (b.rating_produk || 0) - (a.rating_produk || 0)
      );
    }

    // Pindahkan produk dengan stok habis ke bawah tanpa mengganggu sorting lainnya
    sortedProducts = sortedProducts.sort((a, b) => {
      if (a.stok === 0 && b.stok !== 0) return 1;
      if (b.stok === 0 && a.stok !== 0) return -1;
      return 0;
    });

    setFilteredProducts(sortedProducts);
    setCurrentPage(1);
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

  const formatRupiah = (amount) => {
    return "Rp " + amount.toLocaleString("id-ID");
  };

  const handleAddToCart = async (product) => {
    const { data: user, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      Swal.fire({
        title: "Login Dulu Yuk!",
        text: "Anda harus login untuk menambahkan produk ke keranjang.",
        icon: "info",
        confirmButtonText: "Login Sekarang",
        confirmButtonColor: "#6366F1",
        background: "#ffffff",
        color: "#1f2937",
        showClass: {
          popup: "animate__animated animate__fadeInDown animate__faster",
        },
        hideClass: {
          popup: "animate__animated animate__fadeOutUp animate__faster",
        },
        customClass: {
          popup:
            "rounded-2xl shadow-2xl border border-gray-200 px-6 pt-6 pb-4 backdrop-blur-sm",
          title: "text-xl font-bold text-gray-800",
          htmlContainer: "text-base text-gray-600",
          confirmButton:
            "bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg text-base font-medium shadow-md transition duration-200",
        },
      }).then((result) => {
        if (result.isConfirmed) navigate("/login");
      });
      return;
    }

    try {
      const { data: cartData, error: cartError } = await supabase
        .from("cart")
        .select("*")
        .eq("profile_id", user.user.id)
        .eq("coffee_id", product)
        .single();

      if (cartData) {
        const updatedQuantity = cartData.quantity + 1;
        const { error: updateError } = await supabase
          .from("cart")
          .update({ quantity: updatedQuantity })
          .eq("profile_id", user.user.id)
          .eq("coffee_id", product);

        if (updateError) throw updateError;
        setCartCount((prevCount) => prevCount + 1);
      } else {
        const { error: insertError } = await supabase
          .from("cart")
          .insert([
            { profile_id: user.user.id, coffee_id: product, quantity: 1 },
          ]);

        if (insertError) throw insertError;
        setCartCount((prevCount) => prevCount + 1);
      }

      Swal.fire({
        toast: true,
        icon: "success", // Menggunakan ikon bawaan 'success' dari SweetAlert2
        title: "<b>Produk berhasil ditambahkan!</b>",
        position: "top-end",
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
        background: "#ffffff", // Warna latar belakang putih untuk toast
        color: "#333333", // Warna teks hitam agar lebih kontras
        iconColor: "#16A34A", // Warna hijau untuk ikon sukses
        customClass: {
          popup:
            "rounded-xl shadow-xl border border-gray-200 animate__animated animate__fadeInDown animate__faster", // Popup dengan sudut tumpul dan bayangan halus
          title: "text-base font-medium tracking-wide text-gray-900", // Teks judul dengan ukuran yang tepat dan kesan modern
          timerProgressBar: "bg-green-500",
        },
        showClass: {
          popup: "animate__animated animate__fadeInDown animate__faster", // Efek muncul dengan animasi fade-in
        },
        hideClass: {
          popup: "animate__animated animate__fadeOutUp animate__faster", // Efek menghilang dengan animasi fade-out
        },
      });
    } catch (error) {
      console.error("Error handling cart:", error.message);
      Swal.fire({
        title: "Oops! ❌",
        text: "Gagal menambahkan produk ke keranjang.",
        iconHtml: `
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" 
            fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
            class="lucide lucide-alert-circle text-red-500">
            <circle cx="12" cy="12" r="10"></circle>
            <path d="M12 8v4m0 4h.01"></path>
          </svg>
        `,
        confirmButtonText: "Coba Lagi",
        confirmButtonColor: "#EF4444",
        background: "#F9FAFB",
        color: "#374151",
        position: "center",
        showClass: {
          popup: "animate__animated animate__fadeInUp animate__fast",
        },
        hideClass: {
          popup: "animate__animated animate__fadeOutDown animate__fast",
        },
        customClass: {
          popup: "rounded-2xl shadow-2xl border border-gray-300 p-6",
          title: "text-xl font-bold text-gray-900",
          htmlContainer: "text-gray-600 text-base",
          confirmButton:
            "px-6 py-2 rounded-full text-lg font-semibold bg-red-500 hover:bg-red-600 text-white shadow-md transition-all",
        },
      });
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000); // Durasi 1 detik
    return () => clearTimeout(timer);
  }, []);
  const handleProductClick = (productId) => {
    navigate(`/product-detail/${productId}`);
  };

  return (
    <>
      <Helmet>
        <title>CoffeeShopMe | Product</title>
      </Helmet>
      <LoadingBar
        color="linear-gradient(to right, #ff6632, #ffb432)"
        progress={progress}
        height={5}
        shadow={true}
        transitionTime={300}
        onLoaderFinished={() => setProgress(0)}
      />
      <Header />
      <div className="h-screen overflow-hidden py-6 dark:bg-gray-900">
        <div className="mb-8">
          <h1 className="mt-16 text-4xl font-bold text-center mb-4 text-gray-800 dark:text-white">
            Our Products
          </h1>
        </div>

        <button
          onClick={() => setIsFilterOpen(true)}
          className="lg:hidden fixed bottom-6 right-6 z-50 bg-orange-600 text-white p-3 rounded-full shadow-lg"
        >
          <BsFilter className="text-2xl" />
        </button>

        <div className="bg-white dark:bg-gray-900 px-4 flex gap-6">
          <aside className="w-full lg:w-1/5 lg:block bg-white dark:bg-gray-800 shadow-lg rounded-xl p-4 sticky top-20 max-h-[83vh] min-h-fit overflow-y-auto border border-gray-200 dark:border-gray-700 lg:visible hidden">
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-sm sm:text-lg font-semibold text-gray-900 dark:text-white">
                Filters
              </h2>
              <button
                onClick={() => navigate("/cart")}
                className="relative flex items-center justify-center text-orange-500 border border-orange-500 hover:bg-orange-500 hover:text-white transition-all duration-200 ease-in-out p-2 rounded-lg shadow-sm dark:border-orange-400 dark:hover:bg-orange-400 dark:hover:text-white hover:scale-105"
              >
                <BsCart4 className="w-5 h-5 sm:w-6 sm:h-6" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 text-xs font-bold text-white bg-red-600 border border-white dark:border-gray-800 rounded-full px-1.5 py-0.5 shadow-md">
                    {cartCount}
                  </span>
                )}
              </button>
            </div>

            {/* Search Input */}
            <div className="mb-4">
              <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Search Product
              </label>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Search..."
                className="w-full px-3 py-1.5 border rounded-md shadow-sm text-sm focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:text-white transition-all"
              />
            </div>

            {/* Filter Options */}
            <div className="space-y-4">
              {[
                {
                  id: "price",
                  label: "Sort by Price",
                  value: priceSortOrder,
                  onChange: (value) =>
                    setPriceSortOrder(value === priceSortOrder ? null : value), // Toggle between selected value and null
                  options: [
                    { value: "asc", label: "Low - High" },
                    { value: "desc", label: "High - Low" },
                  ],
                },
                {
                  id: "stock",
                  label: "Stock Availability",
                  value: stockSortOrder,
                  onChange: (value) =>
                    setStockSortOrder(value === stockSortOrder ? null : value), // Toggle between selected value and null
                  options: [
                    { value: "asc", label: "Most Stock" },
                    { value: "desc", label: "Least Stock" },
                  ],
                },
                {
                  id: "name",
                  label: "Sort by Name",
                  value: nameSortOrder,
                  onChange: (value) =>
                    setNameSortOrder(value === nameSortOrder ? null : value), // Toggle between selected value and null
                  options: [
                    { value: "asc", label: "A - Z" },
                    { value: "desc", label: "Z - A" },
                  ],
                },
                {
                  id: "rating",
                  label: "Sort by Rating",
                  value: ratingSortOrder,
                  onChange: (value) =>
                    setRatingSortOrder(
                      value === ratingSortOrder ? null : value
                    ), // Toggle between selected value and null
                  options: [
                    { value: "asc", label: "Low - High" },
                    { value: "desc", label: "High - Low" },
                  ],
                },
              ].map(({ id, label, value, onChange, options }) => (
                <div key={id} className="space-y-2">
                  <h3 className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white">
                    {label}
                  </h3>
                  <div className="flex flex-col space-y-2">
                    {options.map((option) => (
                      <label
                        key={option.value}
                        className="flex items-center justify-between px-2 py-1 rounded-md border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 transition-all duration-200 shadow-sm hover:shadow-md cursor-pointer text-xs sm:text-sm"
                      >
                        <span className="text-gray-800 dark:text-gray-300 font-medium">
                          {option.label}
                        </span>
                        <input
                          type="checkbox" // Ganti menjadi checkbox
                          checked={value === option.value}
                          onChange={() => onChange(option.value)} // Toggle like before
                          className="hidden"
                        />
                        <span
                          className={`relative w-7 h-4 sm:w-8 sm:h-5 flex items-center bg-gray-300 dark:bg-gray-500 rounded-full p-0.5 transition-all duration-200 ${
                            value === option.value
                              ? "bg-orange-500 dark:bg-orange-400"
                              : ""
                          }`}
                        >
                          <span
                            className={`w-3 h-3 sm:w-4 sm:h-4 bg-white dark:bg-gray-300 rounded-full shadow-md transform transition-all duration-200 ${
                              value === option.value ? "translate-x-3" : ""
                            }`}
                          />
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Reset Filters Button */}
            <button
              onClick={resetFilters}
              className="w-full py-2 rounded-md shadow-sm border border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white transition-all duration-200 ease-in-out mt-4 text-xs sm:text-sm font-medium"
            >
              Reset Filters
            </button>
          </aside>

          {isFilterOpen && (
            <div className="fixed inset-0 z-50 bg-black/50 flex">
              <div className="bg-white dark:bg-gray-800 w-4/5 sm:w-1/2 h-full p-4 sm:p-6 shadow-lg overflow-y-auto">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    Product Filter
                  </h2>
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => navigate("/cart")}
                      className="relative text-xl text-orange-500 hover:text-orange-600 transition-all p-2 rounded-full bg-gray-100 dark:bg-gray-700 shadow-md"
                    >
                      <BsCart4 className="w-6 h-6" />
                      {cartCount > 0 && (
                        <span className="absolute -top-1.5 -right-1.5 text-xs font-bold text-white bg-red-600 border-2 border-white dark:border-gray-800 rounded-full px-2">
                          {cartCount}
                        </span>
                      )}
                    </button>
                    <button
                      onClick={() => setIsFilterOpen(false)}
                      className="text-2xl text-gray-600 hover:text-gray-800 transition-all"
                    >
                      <IoClose />
                    </button>
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Search Product
                  </label>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                    placeholder="Search for products..."
                    className="w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>

                <div className="space-y-4">
                  {[
                    {
                      id: "price",
                      label: "Sort by Price",
                      value: priceSortOrder,
                      onChange: setPriceSortOrder,
                      options: [
                        { value: "asc", label: "Lowest to Highest" },
                        { value: "desc", label: "Highest to Lowest" },
                      ],
                    },
                    {
                      id: "stock",
                      label: "Stock Availability",
                      value: stockSortOrder,
                      onChange: setStockSortOrder,
                      options: [
                        { value: "asc", label: "Most Stock" },
                        { value: "desc", label: "Least Stock" },
                      ],
                    },
                    {
                      id: "name",
                      label: "Sort by Name",
                      value: nameSortOrder,
                      onChange: setNameSortOrder,
                      options: [
                        { value: "asc", label: "A - Z" },
                        { value: "desc", label: "Z - A" },
                      ],
                    },
                    {
                      id: "rating",
                      label: "Sort by Rating",
                      value: ratingSortOrder,
                      onChange: setRatingSortOrder,
                      options: [
                        { value: "asc", label: "Lowest to Highest" },
                        { value: "desc", label: "Highest to Lowest" },
                      ],
                    },
                  ].map(({ id, label, value, onChange, options }) => (
                    <div key={id} className="space-y-1">
                      <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                        {label}
                      </h3>
                      <div className="flex flex-col space-y-1">
                        {options.map((option) => (
                          <label
                            key={option.value}
                            className="flex items-center justify-between p-2 rounded-md border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 transition-all duration-200 shadow-sm"
                          >
                            <span className="text-gray-800 dark:text-gray-300 text-xs font-medium">
                              {option.label}
                            </span>
                            <input
                              type="radio"
                              name={id}
                              value={option.value}
                              checked={value === option.value}
                              onChange={() => onChange(option.value)}
                              className="hidden"
                            />
                            <span
                              className={`relative w-8 h-4 flex items-center bg-gray-300 dark:bg-gray-600 rounded-full p-0.5 transition-all duration-200 ${
                                value === option.value ? "bg-orange-500" : ""
                              }`}
                            >
                              <span
                                className={`w-3 h-3 bg-white dark:bg-gray-300 rounded-full shadow-md transform transition-all duration-200 ${
                                  value === option.value ? "translate-x-4" : ""
                                }`}
                              />
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => {
                    resetFilters();
                    setIsFilterOpen(false);
                  }}
                  className="w-full py-2 bg-orange-500 text-white font-semibold rounded-lg mt-4"
                >
                  Reset Filters
                </button>
              </div>
            </div>
          )}

          <section className="w-full h-screen max-h-screen flex flex-col overflow-y-auto pb-52">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
                <div className="relative flex items-center justify-center">
                  <div className="absolute -top-8 flex space-x-2">
                    {[0, 1, 2].map((i) => (
                      <div
                        key={i}
                        className="w-2 h-6 bg-gray-400 opacity-50 rounded-full animate-steam"
                        style={{ animationDelay: `${i * 0.2}s` }}
                      ></div>
                    ))}
                  </div>

                  <div className="relative w-20 h-16 bg-gradient-to-b from-orange-500 to-orange-700 rounded-t-full flex items-end justify-center shadow-lg glow-effect">
                    <div className="absolute bottom-0 w-16 h-12 bg-white dark:bg-gray-800 rounded-t-full"></div>
                  </div>

                  <div className="absolute right-[-10px] top-[6px] w-5 h-5 border-4 border-orange-500 rounded-full"></div>
                </div>

                <p className="text-gray-600 dark:text-gray-300 mt-4 text-lg font-semibold animate-fade-in">
                  Brewing your coffee...
                </p>
              </div>
            ) : (
              <>
                <div
                  className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6 gap-2"
                  style={{ gridAutoRows: "minmax(320px, auto)" }}
                >
                  {currentProducts.map((product) => (
                    <div
                      onClick={() => handleProductClick(product.id)}
                      className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 border border-gray-200 dark:border-gray-700 flex flex-col"
                    >
                      {/* Product Image */}
                      <div className="relative group">
                        <img
                          src={product.foto_barang}
                          alt={product.nama_produk}
                          className="w-full h-48 object-cover rounded-t-2xl transition-transform duration-300 group-hover:scale-105"
                        />
                        {product.stok === 0 && (
                          <div className="absolute inset-0 bg-black/70 backdrop-blur-md flex justify-center items-center rounded-t-2xl">
                            <span className="text-white font-semibold text-xs bg-red-600 px-3 py-1 rounded-full shadow-md">
                              Out of Stock
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Product Info (Menggunakan flex-grow agar tombol selalu di bawah) */}
                      <div className="p-4 flex flex-col flex-grow">
                        <h2 className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                          {product.nama_produk}
                        </h2>

                        <p className="text-xs text-gray-600 dark:text-gray-300 line-clamp-2 mt-1">
                          {product.deskripsi}
                        </p>

                        {/* Stock & Rating */}
                        <div className="flex justify-between items-center text-xs text-gray-600 dark:text-gray-400 mt-3">
                          <span className="flex items-center space-x-1">
                            <i className="fas fa-box"></i>
                            <span className="font-medium">
                              Stok: {product.stok}
                            </span>
                          </span>
                          <span className="flex items-center space-x-1">
                            <i className="fas fa-star text-yellow-400"></i>
                            <span className="font-medium">
                              {product.rating_produk &&
                              !isNaN(Number(product.rating_produk))
                                ? `${parseFloat(
                                    Number(product.rating_produk).toFixed(1)
                                  )} `
                                : "No Rating"}
                            </span>
                          </span>
                        </div>

                        {/* Price */}
                        <p className="text-lg font-bold text-orange-600 dark:text-orange-400 mt-3">
                          {formatRupiah(product.harga_produk)}
                        </p>

                        {/* Add to Cart Button (Selalu di bawah) */}
                        <div className="mt-auto pt-4">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAddToCart(product.id);
                            }}
                            disabled={product.stok === 0}
                            className={`w-full py-2 rounded-lg text-sm font-medium text-white transition-all shadow-md flex items-center justify-center gap-2 ${
                              product.stok === 0
                                ? "bg-gray-400 cursor-not-allowed opacity-60"
                                : "bg-orange-600 dark:bg-orange-700 hover:bg-orange-700 dark:hover:bg-orange-800"
                            }`}
                          >
                            {product.stok === 0 ? (
                              <>
                                <i className="fas fa-times-circle"></i> Out of
                                Stock
                              </>
                            ) : (
                              <>
                                <i className="fas fa-cart-plus"></i> Add To Cart
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                <div className="mt-auto">
                  <Pagination
                    totalPages={totalPages}
                    currentPage={currentPage}
                    onPageChange={handlePageChange}
                  />
                </div>
              </>
            )}
          </section>
        </div>
      </div>
    </>
  );
}
