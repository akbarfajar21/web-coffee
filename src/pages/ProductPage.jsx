import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { supabase } from "../utils/SupaClient";
import { useNavigate } from "react-router-dom";
import { FaShoppingCart } from "react-icons/fa";
import { ClipLoader } from "react-spinners";
import { Checkbox } from "@nextui-org/react";
import { Card, Skeleton } from "@nextui-org/react";
import Swal from "sweetalert2";

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

  const navigate = useNavigate();

  // Fetch products from Supabase
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
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
        swalLoading.close(); // Menutup loading jika ada error
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
      <Header />
      <div className="min-h-screen py-8 px-4 lg:px-12 dark:bg-gray-800">
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
          <aside className="bg-white rounded-lg shadow-lg p-6 space-y-6 divide-y divide-gray-200 dark:bg-gray-700 dark:text-white">
            <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">
              Filter Produk
            </h2>
            {/* Filter form */}
            <div className="pt-4">
              <h3 className="text-lg font-semibold text-gray-700 dark:text-white mb-3">
                Harga
              </h3>
              <div className="space-y-3">
                <label className="flex items-center space-x-3 text-base text-gray-600 dark:text-white">
                  <Checkbox
                    defaultSelected
                    isSelected={priceSortOrder === "asc"}
                    onChange={() => setPriceSortOrder("asc")}
                    color="success"
                  />
                  <span>Harga Termurah</span>
                </label>
                <label className="flex items-center space-x-3 text-base text-gray-600 dark:text-white">
                  <Checkbox
                    defaultSelected
                    isSelected={priceSortOrder === "desc"}
                    onChange={() => setPriceSortOrder("desc")}
                    color="success"
                  />
                  <span>Harga Termahal</span>
                </label>
              </div>
            </div>

            <div className="pt-4">
              <h3 className="text-lg font-semibold text-gray-700 dark:text-white mb-3">
                Stok
              </h3>
              <div className="space-y-3">
                <label className="flex items-center space-x-3 text-base text-gray-600 dark:text-white">
                  <Checkbox
                    defaultSelected
                    isSelected={stockSortOrder === "asc"}
                    onChange={() => setStockSortOrder("asc")}
                    color="success"
                  />
                  <span>Stok Terdikit</span>
                </label>
                <label className="flex items-center space-x-3 text-base text-gray-600 dark:text-white">
                  <Checkbox
                    isSelected={stockSortOrder === "desc"}
                    onChange={() => setStockSortOrder("desc")}
                    color="success"
                  />
                  <span>Stok Terbanyak</span>
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
              // Tampilkan skeleton saat loading
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                {Array.from({ length: 8 }).map((_, index) => (
                  <Card
                    key={index}
                    className="w-[200px] space-y-5 p-4"
                    radius="lg"
                  >
                    <Skeleton className="rounded-lg">
                      <div className="h-24 rounded-lg bg-default-300" />
                    </Skeleton>
                    <div className="space-y-3">
                      <Skeleton className="w-3/5 rounded-lg">
                        <div className="h-3 w-3/5 rounded-lg bg-default-200" />
                      </Skeleton>
                      <Skeleton className="w-4/5 rounded-lg">
                        <div className="h-3 w-4/5 rounded-lg bg-default-200" />
                      </Skeleton>
                      <Skeleton className="w-2/5 rounded-lg">
                        <div className="h-3 w-2/5 rounded-lg bg-default-300" />
                      </Skeleton>
                    </div>
                  </Card>
                ))}
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="flex justify-center items-center h-full text-center text-gray-600 dark:text-white">
                <p>Produk tidak tersedia</p>
              </div>
            ) : (
              // Tampilkan produk yang sudah dimuat
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                {filteredProducts.map((product) => (
                  <div
                    key={product.id}
                    className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 dark:bg-gray-700"
                    onClick={() => handleProductClick(product.id)}
                  >
                    <div className="relative group">
                      <img
                        src={product.foto_barang}
                        alt={product.nama_produk}
                        className="w-full h-48 object-cover"
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
                      <h2 className="text-sm sm:text-base md:text-lg font-semibold text-gray-800 dark:text-white mb-2">
                        {product.nama_produk}
                      </h2>
                      <p className="text-xs sm:text-sm md:text-base text-gray-600 dark:text-white flex-grow mb-4 line-clamp-3">
                        {product.deskripsi}
                      </p>
                      <div className="text-sm text-gray-600 dark:text-white mb-4">
                        <strong>Stok: </strong>
                        {product.stok}
                      </div>
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                        <div className="text-sm text-gray-600 dark:text-white">
                          {product.rating_produk ? (
                            <span>{product.rating_produk} ⭐</span>
                          ) : (
                            <span>No Rating</span>
                          )}
                        </div>
                        <p className="text-base font-bold text-orange-600 dark:text-white mt-2 sm:mt-0">
                          {formatRupiah(product.harga_produk)}
                        </p>
                      </div>
                      <div className="flex justify-between items-center mt-auto">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAddToCart(product.id);
                          }}
                          disabled={product.stok === 0}
                          className={`px-4 py-2 text-white rounded-lg text-sm transition-colors ${
                            product.stok === 0
                              ? "bg-gray-400 cursor-not-allowed"
                              : "bg-orange-500 hover:bg-orange-600"
                          }`}
                        >
                          {product.stok === 0 ? (
                            "Stok Habis"
                          ) : (
                            <i className="fas fa-cart-plus text-lg sm:text-base md:text-lg"></i>
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
