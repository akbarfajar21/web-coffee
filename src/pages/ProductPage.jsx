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
  const productsPerPage = 35;
  const navigate = useNavigate();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const isDarkMode = document.documentElement.classList.contains("dark");

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

    // Realtime subscription
    const coffeeChannel = supabase
      .channel("realtime-coffee")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "coffee",
        },
        (payload) => {
          const { eventType, new: newItem, old: oldItem } = payload;

          setProducts((prev) => {
            if (eventType === "INSERT") {
              return [newItem, ...prev];
            }

            if (eventType === "UPDATE") {
              return prev.map((item) =>
                item.id === newItem.id ? newItem : item
              );
            }

            if (eventType === "DELETE") {
              return prev.filter((item) => item.id !== oldItem.id);
            }

            return prev;
          });

          // Update filteredProducts juga (biar sinkron)
          setFilteredProducts((prev) => {
            if (eventType === "INSERT") {
              return [newItem, ...prev];
            }

            if (eventType === "UPDATE") {
              return prev.map((item) =>
                item.id === newItem.id ? newItem : item
              );
            }

            if (eventType === "DELETE") {
              return prev.filter((item) => item.id !== oldItem.id);
            }

            return prev;
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(coffeeChannel);
    };
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
  }, []);

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

    setCartCount((prevCount) => prevCount + 1);

    Swal.fire({
      toast: true,
      position: "top-end",
      icon: "success",
      title: "<b>Produk berhasil ditambahkan ke keranjang!</b>",
      showConfirmButton: false,
      timer: 1400,
      timerProgressBar: true,
      background: isDarkMode ? "#1f2937" : "#ffffff", // dark: slate-800, light: white
      color: isDarkMode ? "#f9fafb" : "#1f2937", // dark: gray-50, light: slate-800
      iconColor: "#22c55e", // green-500
      customClass: {
        popup: `
      rounded-lg 
      shadow-lg 
      border 
      ${
        isDarkMode
          ? "border-gray-700 bg-gray-900/80"
          : "border-gray-200 bg-white/80"
      } 
      px-5 py-4 
      animate__animated 
      animate__fadeInRight 
      animate__faster 
      backdrop-blur-sm 
    `,
        title: `
      text-sm 
      font-semibold 
      ${isDarkMode ? "text-white" : "text-gray-800"} 
      tracking-wide
    `,
        timerProgressBar: "bg-green-500 h-1 rounded-b-lg",
      },
      showClass: {
        popup: "animate__animated animate__fadeInRight animate__fast",
      },
      hideClass: {
        popup: "animate__animated animate__fadeOutRight animate__fast",
      },
    });

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
      } else {
        const { error: insertError } = await supabase
          .from("cart")
          .insert([
            { profile_id: user.user.id, coffee_id: product, quantity: 1 },
          ]);

        if (insertError) throw insertError;
      }
    } catch (error) {
      console.error("Error handling cart:", error.message);

      setCartCount((prevCount) => Math.max(0, prevCount - 1));

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
    }, 2000);
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
            Produk Coffee
          </h1>
        </div>

        <button
          onClick={() => setIsFilterOpen(true)}
          className="lg:hidden fixed bottom-6 right-6 z-50 bg-orange-600 text-white p-3 rounded-full shadow-lg"
        >
          <BsFilter className="text-2xl" />

          {cartCount > 0 && (
            <span className="absolute -top-1 -right-1 text-[10px] font-bold text-white bg-red-600 border border-white rounded-full px-1 py-0.5 shadow-md">
              {cartCount}
            </span>
          )}
        </button>

        <div className="bg-white dark:bg-gray-900 px-4 flex gap-6">
          <aside
            className="
            w-full max-w-xs lg:max-w-[270px] lg:w-1/5 lg:block
          bg-white dark:bg-gradient-to-b dark:from-gray-900 dark:via-gray-800 dark:to-gray-900
            shadow-md rounded-xl p-5
            sticky top-16
            max-h-[75vh] overflow-y-auto
            border border-gray-200 dark:border-gray-700
            lg:visible hidden
            "
          >
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-white tracking-wide">
                Filter
              </h2>
              <button
                onClick={() => navigate("/cart")}
                className="
                relative flex items-center justify-center
              text-orange-500 border border-orange-500
              hover:bg-orange-500 hover:text-white
                transition-all duration-300 ease-in-out
                p-2 rounded-lg shadow-md
              dark:border-orange-400 dark:hover:bg-orange-400 dark:hover:text-white
                hover:scale-110
                focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-orange-400
                "
                aria-label="Go to cart"
              >
                <BsCart4 className="w-5 h-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 text-[10px] font-bold text-white bg-red-600 border border-white dark:border-gray-800 rounded-full px-1 py-0.5 shadow-md select-none">
                    {cartCount}
                  </span>
                )}
              </button>
            </div>

            <div className="mb-5">
              <label
                htmlFor="search"
                className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Cari Produk
              </label>
              <input
                id="search"
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Cari..."
                className="
                w-full px-3 py-1.5
                border border-gray-300 rounded-md shadow-sm
                text-xs text-gray-900
                focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent
              dark:bg-gray-700 dark:text-white dark:border-gray-600
                transition-all duration-300
                "
              />
            </div>

            {/* Filter Options */}
            <div className="space-y-5">
              {[
                {
                  id: "price",
                  label: "Urutkan Berdasarkan Harga",
                  value: priceSortOrder,
                  onChange: (value) =>
                    setPriceSortOrder(value === priceSortOrder ? null : value),
                  options: [
                    { value: "asc", label: "Rendah - Tinggi" },
                    { value: "desc", label: "Tinggi - Rendah" },
                  ],
                },
                {
                  id: "stock",
                  label: "Ketersediaan Stok",
                  value: stockSortOrder,
                  onChange: (value) =>
                    setStockSortOrder(value === stockSortOrder ? null : value),
                  options: [
                    { value: "desc", label: "Stok Terbanyak" },
                    { value: "asc", label: "Stok Terdikit" },
                  ],
                },
                {
                  id: "name",
                  label: "Urutkan Berdasarkan Nama",
                  value: nameSortOrder,
                  onChange: (value) =>
                    setNameSortOrder(value === nameSortOrder ? null : value),
                  options: [
                    { value: "asc", label: "A - Z" },
                    { value: "desc", label: "Z - A" },
                  ],
                },
              ].map(({ id, label, value, onChange, options }) => (
                <div key={id} className="space-y-2">
                  <h3 className="text-xs font-semibold text-gray-900 dark:text-white">
                    {label}
                  </h3>
                  <div className="flex flex-col space-y-1.5">
                    {options.map((option) => (
                      <label
                        key={option.value}
                        className={`
                      flex items-center justify-between
                      p-1.5 rounded-md border cursor-pointer
                      transition-shadow duration-300
                    ${
                      value === option.value
                        ? "bg-orange-500 border-orange-500 text-white shadow-md"
                        : "bg-gray-50 border-gray-300 dark:bg-gray-800 dark:border-gray-600 text-gray-800 dark:text-gray-300 hover:shadow-sm"
                    }
              `}
                      >
                        <span className="font-medium text-xs">
                          {option.label}
                        </span>
                        <input
                          type="checkbox"
                          checked={value === option.value}
                          onChange={() => onChange(option.value)}
                          className="hidden"
                          aria-checked={value === option.value}
                          aria-labelledby={`${id}-${option.value}`}
                        />
                        <span
                          className={`relative w-7 h-4 flex items-center rounded-full p-0.5 transition-colors duration-300 ${
                            value === option.value
                              ? "bg-white"
                              : "bg-gray-300 dark:bg-gray-600"
                          }`}
                        >
                          <span
                            className={`w-3.5 h-3.5 bg-orange-500 rounded-full shadow transform transition-transform duration-300 ${
                              value === option.value
                                ? "translate-x-2.5"
                                : "translate-x-0"
                            }`}
                          />
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Reset Button */}
            <button
              onClick={resetFilters}
              className="
              mt-6 w-full py-1.5 rounded-md border border-orange-500
            text-orange-600 font-semibold text-sm
            hover:bg-orange-500 hover:text-white
              transition-all duration-300 ease-in-out shadow-md
              focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-1
              "
            >
              Reset Filter
            </button>
          </aside>

          {isFilterOpen && (
            <div className="fixed inset-0 z-50 bg-black/50 flex">
              <div
                className="
            bg-white dark:bg-gradient-to-b dark:from-gray-900 dark:via-gray-800 dark:to-gray-900
              w-4/5 sm:w-1/2 h-full p-5
              shadow-md rounded-xl overflow-y-auto
              border border-gray-200 dark:border-gray-700
              "
              >
                {/* Header */}
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-white tracking-wide">
                    Filter
                  </h2>
                  <div className="flex gap-2 items-center">
                    {/* Tombol Close */}
                    <button
                      onClick={() => setIsFilterOpen(false)}
                      className="text-gray-500 hover:text-red-500 transition-colors duration-200 p-1 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-red-400"
                      aria-label="Close filter panel"
                    >
                      <IoClose className="h-5 w-5" />
                    </button>

                    {/* Tombol ke Cart */}
                    <button
                      onClick={() => navigate("/cart")}
                      className="
                    relative flex items-center justify-center
                  text-orange-500 border border-orange-500
                  hover:bg-orange-500 hover:text-white
                    transition-all duration-300 ease-in-out
                    p-2 rounded-lg shadow-md
                  dark:border-orange-400 dark:hover:bg-orange-400 dark:hover:text-white
                    hover:scale-110
                    focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-orange-400
                    "
                      aria-label="Go to cart"
                    >
                      <BsCart4 className="w-5 h-5" />
                      {cartCount > 0 && (
                        <span className="absolute -top-2 -right-2 text-[10px] font-bold text-white bg-red-600 border border-white dark:border-gray-800 rounded-full px-1 py-0.5 shadow-md select-none">
                          {cartCount}
                        </span>
                      )}
                    </button>
                  </div>
                </div>
                {/* Search Input */}
                <div className="mb-5">
                  <label
                    htmlFor="search"
                    className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    Cari Produk
                  </label>
                  <input
                    id="search"
                    type="text"
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                    placeholder="Cari..."
                    className="
                    w-full px-3 py-1.5
                    border border-gray-300 rounded-md shadow-sm
                    text-xs text-gray-900
                    focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent
                  dark:bg-gray-700 dark:text-white dark:border-gray-600
                    transition-all duration-300
                    "
                  />
                </div>
                {/* Filter Options */}
                <div className="space-y-5">
                  {[
                    {
                      id: "price",
                      label: "Urutkan Berdasarkan Harga",
                      value: priceSortOrder,
                      onChange: (value) =>
                        setPriceSortOrder(
                          value === priceSortOrder ? null : value
                        ),
                      options: [
                        { value: "asc", label: "Rendah - Tinggi" },
                        { value: "desc", label: "Tinggi - Rendah" },
                      ],
                    },
                    {
                      id: "stock",
                      label: "Ketersediaan Stok",
                      value: stockSortOrder,
                      onChange: (value) =>
                        setStockSortOrder(
                          value === stockSortOrder ? null : value
                        ),
                      options: [
                        { value: "desc", label: "Stok Terbanyak" },
                        { value: "asc", label: "Stok Terdikit" },
                      ],
                    },
                    {
                      id: "name",
                      label: "Urutkan Berdasarkan Nama",
                      value: nameSortOrder,
                      onChange: (value) =>
                        setNameSortOrder(
                          value === nameSortOrder ? null : value
                        ),
                      options: [
                        { value: "asc", label: "A - Z" },
                        { value: "desc", label: "Z - A" },
                      ],
                    },
                  ].map(({ id, label, value, onChange, options }) => (
                    <div key={id} className="space-y-2">
                      <h3 className="text-xs font-semibold text-gray-900 dark:text-white">
                        {label}
                      </h3>
                      <div className="flex flex-col space-y-1.5">
                        {options.map((option) => (
                          <label
                            key={option.value}
                            className={`
                      flex items-center justify-between
                      p-1.5 rounded-md border cursor-pointer
                      transition-shadow duration-300
                  ${
                    value === option.value
                      ? "bg-orange-500 border-orange-500 text-white shadow-md"
                      : "bg-gray-50 border-gray-300 dark:bg-gray-800 dark:border-gray-600 text-gray-800 dark:text-gray-300 hover:shadow-sm"
                  }
                `}
                          >
                            <span className="font-medium text-xs">
                              {option.label}
                            </span>
                            <input
                              type="checkbox"
                              checked={value === option.value}
                              onChange={() => onChange(option.value)}
                              className="hidden"
                              aria-checked={value === option.value}
                              aria-labelledby={`${id}-${option.value}`}
                            />
                            <span
                              className={`relative w-7 h-4 flex items-center rounded-full p-0.5 transition-colors duration-300 ${
                                value === option.value
                                  ? "bg-white"
                                  : "bg-gray-300 dark:bg-gray-600"
                              }`}
                            >
                              <span
                                className={`w-3.5 h-3.5 bg-orange-500 rounded-full shadow transform transition-transform duration-300 ${
                                  value === option.value
                                    ? "translate-x-2.5"
                                    : "translate-x-0"
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
                  className="
                  mt-6 w-full py-1.5 rounded-md border border-orange-500
                text-orange-600 font-semibold text-sm
                hover:bg-orange-500 hover:text-white
                  transition-all duration-300 ease-in-out shadow-md
                  focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-1
                  "
                >
                  Reset Filter
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
                  Memuat...
                </p>
              </div>
            ) : (
              <>
                <div
                  className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-7 gap-2"
                  style={{ gridAutoRows: "minmax(320px, auto)" }}
                >
                  {currentProducts.map((product) => (
                    <div
                      onClick={() => handleProductClick(product.id)}
                      className="relative bg-white dark:bg-gray-900 rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border border-gray-200 dark:border-gray-700 flex flex-col"
                    >
                      <div className="relative group">
                        <img
                          src={product.foto_barang}
                          alt={product.nama_produk}
                          className="w-full h-36 object-cover rounded-t-xl"
                        />
                        {product.stok === 0 && (
                          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center rounded-t-xl">
                            <span className="text-white font-semibold text-[10px] bg-red-600 px-2 py-0.5 rounded-full shadow-sm">
                              Out of Stock
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="p-3 flex flex-col flex-grow">
                        <h2 className="text-xs font-semibold text-gray-900 dark:text-white truncate">
                          {product.nama_produk}
                        </h2>

                        <p className="text-[11px] text-gray-600 dark:text-gray-300 line-clamp-2 mt-1">
                          {product.deskripsi}
                        </p>

                        <div className="flex justify-between items-center text-[10px] text-gray-600 dark:text-gray-400 mt-2">
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
                                  )}`
                                : "No Rating"}
                            </span>
                          </span>
                        </div>

                        <p className="text-base font-bold text-orange-600 dark:text-orange-400 mt-2">
                          {formatRupiah(product.harga_produk)}
                        </p>

                        <div className="mt-auto pt-3">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAddToCart(product.id);
                            }}
                            disabled={product.stok === 0}
                            className={`w-full py-1.5 rounded-md text-xs font-medium text-white transition-all shadow-sm flex items-center justify-center gap-2 ${
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
