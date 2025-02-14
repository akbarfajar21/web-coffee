import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { supabase } from "../utils/SupaClient";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import LoadingBar from "react-top-loading-bar";
import Pagination from "../components/Pagination";
import { BsCart4, BsFilter } from "react-icons/bs";
import { IoClose } from "react-icons/io5"; // Import icon close

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

  // Format currency
  const formatRupiah = (amount) => {
    return "Rp " + amount.toLocaleString("id-ID");
  };

  // Handle Add to Cart functionality
  const handleAddToCart = async (product) => {
    const { data: user, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      Swal.fire({
        title: "🚀 Login Dulu Yuk!",
        text: "Anda harus masuk untuk menambahkan produk ke keranjang.",
        iconHtml: "🔑",
        confirmButtonText: "Login Sekarang",
        confirmButtonColor: "#4F46E5",
        background: "rgba(255, 255, 255, 0.9)",
        color: "#333",
        showClass: {
          popup: "animate__animated animate__fadeInDown animate__faster",
        },
        hideClass: {
          popup: "animate__animated animate__fadeOutUp animate__faster",
        },
        customClass: {
          popup: "rounded-xl shadow-lg backdrop-blur-md border border-gray-200",
          confirmButton: "px-6 py-2 rounded-lg text-lg font-semibold",
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
        iconHtml: `
          <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-green-500" 
            viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M5 12l4 4L19 7" />
          </svg>
        `,
        title: "<b>Produk berhasil ditambahkan! 🎉</b>",
        position: "top-end",
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
        background: "#ffffff", // Selalu putih
        color: "#222222", // Teks selalu hitam
        iconColor: "#16A34A",
        customClass: {
          popup:
            "rounded-xl shadow-xl border border-gray-200 animate-fade-in-out",
          title: "text-base font-medium tracking-wide text-gray-900",
          timerProgressBar: "bg-green-500",
        },
        showClass: {
          popup: "animate__animated animate__fadeInDown animate__faster",
        },
        hideClass: {
          popup: "animate__animated animate__fadeOutUp animate__faster",
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
    }, 3000); // Durasi 1 detik
    return () => clearTimeout(timer);
  }, []);

  // Navigate to product detail
  const handleProductClick = (productId) => {
    navigate(`/product-detail/${productId}`);
  };

  return (
    <>
      <LoadingBar
        color="linear-gradient(to right, #ff6632, #ffb432)"
        progress={progress}
        height={5}
        shadow={true}
        transitionTime={300}
        onLoaderFinished={() => setProgress(0)}
      />
      <Header />
      <div className="min-h-screen py-6 dark:bg-gray-900">
        <div className="mb-8">
          <h1 className="mt-14 text-4xl font-bold text-center mb-4 text-gray-800 dark:text-white">
            Our Products
          </h1>
        </div>

        <button
          onClick={() => setIsFilterOpen(true)}
          className="lg:hidden fixed bottom-6 right-6 z-50 bg-orange-600 text-white p-3 rounded-full shadow-lg"
        >
          <BsFilter className="text-2xl" />
        </button>

        <div className="bg-white dark:bg-gray-900 py-6 px-4 lg:px-16 flex gap-6">
          <aside className="w-1/5 hidden lg:block bg-white dark:bg-gray-800 shadow-xl rounded-2xl p-6 sticky top-20 max-h-[80vh] min-h-fit overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Filters
              </h2>

              <button
                onClick={() => navigate("/cart")}
                className="relative flex items-center justify-center text-orange-500 border border-orange-500 hover:bg-orange-500 hover:text-white transition-all duration-300 ease-in-out p-2 rounded-lg shadow-sm dark:border-orange-400 dark:hover:bg-orange-400 dark:hover:text-white"
              >
                <BsCart4 className="w-6 h-6" />
                {cartCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 text-xs font-bold text-white bg-red-600 border-2 border-white dark:border-gray-800 rounded-full px-2 py-0.5 shadow-md">
                    {cartCount}
                  </span>
                )}
              </button>
            </div>

            <div className="mb-6">
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
              onClick={resetFilters}
              className="w-full py-3 rounded-lg shadow-md border border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white transition-all duration-300 ease-in-out mt-6"
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

          <section className="w-full lg:w-4/5 h-screen max-h-screen flex flex-col overflow-y-auto pb-52">
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
                  className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6 p-2 gap-2 flex-grow place-items-start"
                  style={{ gridAutoRows: "minmax(280px, auto)" }}
                >
                  {currentProducts.map((product) => (
                    <div
                      key={product.id}
                      className="bg-white dark:bg-gray-900 rounded-2xl shadow-md overflow-hidden flex flex-col cursor-pointer min-h-[280px]"
                      onClick={() => handleProductClick(product.id)}
                    >
                      {/* Product Image */}
                      <div className="relative">
                        <img
                          src={product.foto_barang}
                          alt={product.nama_produk}
                          className="w-full h-40 object-cover rounded-t-2xl"
                        />
                        {product.stok === 0 && (
                          <div className="absolute inset-0 bg-black/70 flex justify-center items-center rounded-t-2xl">
                            <span className="text-white font-semibold text-xs bg-red-600 rounded-md px-2 py-1">
                              Out of Stock
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Product Info */}
                      <div className="p-4 flex flex-col flex-grow">
                        <h2 className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                          {product.nama_produk}
                        </h2>

                        <p className="text-xs text-gray-600 dark:text-gray-300 line-clamp-2 mt-1 min-h-[32px]">
                          {product.deskripsi}
                        </p>

                        <div className="flex justify-between items-center text-xs text-gray-600 dark:text-gray-400 mt-2 min-h-[24px]">
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

                        <p className="text-lg font-bold text-orange-600 dark:text-orange-400 mt-3 min-h-[28px]">
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
                          className={`w-full py-2 rounded-md text-xs font-medium text-white transition-all ${
                            product.stok === 0
                              ? "bg-gray-500 cursor-not-allowed"
                              : "bg-orange-600 dark:bg-orange-700 hover:bg-orange-700 dark:hover:bg-orange-800"
                          }`}
                        >
                          {product.stok === 0 ? "Out of Stock" : "Add To Cart"}
                        </button>
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
        <Footer />
      </div>
    </>
  );
}
