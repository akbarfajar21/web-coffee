import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import { supabase } from "../utils/SupaClient";
import Header from "../components/Header";
import CheckoutButton from "../components/Cart/CheckoutButton";
import CheckableCartItem from "../components/Cart/CheckableCartItem";
import { Helmet } from "react-helmet";

export default function CartPage() {
  const [cart, setCart] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCart = async () => {
      const { data: user } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("cart")
        .select(
          "id, coffee_id, quantity, coffee(nama_produk, foto_barang, harga_produk, stok)"
        )
        .eq("profile_id", user.user.id);

      if (error) {
        console.error(error);
      } else {
        setCart(data);

        // Ambil data ceklis dari localStorage
        const storedCheckedItems =
          JSON.parse(localStorage.getItem("checkedItems")) || [];
        const validCheckedItems = storedCheckedItems.filter((id) =>
          data.some((item) => item.coffee_id === id)
        );

        setSelectedItems(validCheckedItems);
      }
    };

    fetchCart();
  }, []);

  useEffect(() => {
    const coffeeChannel = supabase
      .channel("realtime-coffee-price")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "coffee",
        },
        (payload) => {
          const updatedCoffee = payload.new;

          setCart((prevCart) =>
            prevCart.map((item) => {
              if (item.coffee_id === updatedCoffee.id) {
                return {
                  ...item,
                  coffee: {
                    ...item.coffee,
                    harga_produk: updatedCoffee.harga_produk,
                  },
                };
              }
              return item;
            })
          );
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(coffeeChannel);
    };
  }, []);

  const formatHarga = (harga) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(harga);
  };

  const toggleCheck = (coffeeId) => {
    setSelectedItems((prev) => {
      const newCheckedItems = prev.includes(coffeeId)
        ? prev.filter((id) => id !== coffeeId) // Uncheck
        : [...prev, coffeeId]; // Check

      // Simpan ke localStorage
      localStorage.setItem("checkedItems", JSON.stringify(newCheckedItems));

      return newCheckedItems;
    });
  };

  const filteredCart = cart.filter((item) =>
    selectedItems.includes(item.coffee_id)
  );

  const totalHarga = filteredCart.reduce(
    (total, item) => total + item.coffee.harga_produk * item.quantity,
    0
  );

  const removeItem = async (coffee_id) => {
    const { data: user } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase
      .from("cart")
      .delete()
      .eq("profile_id", user.user.id)
      .eq("coffee_id", coffee_id);

    if (error) {
      console.error("Error menghapus item:", error);
      return;
    }

    // Update state setelah berhasil menghapus
    setCart((prevCart) =>
      prevCart.filter((item) => item.coffee_id !== coffee_id)
    );
    setSelectedItems((prevSelected) =>
      prevSelected.filter((id) => id !== coffee_id)
    );
  };

  const updateQuantity = async (coffee_id, newQuantity) => {
    if (newQuantity < 1) return;

    // 1. Optimistic update: langsung update UI
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.coffee_id === coffee_id ? { ...item, quantity: newQuantity } : item
      )
    );

    // 2. Async update ke database tanpa menahan UI
    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();
      if (userError || !user) throw new Error("User not found");

      const { error } = await supabase
        .from("cart")
        .update({ quantity: newQuantity })
        .eq("profile_id", user.id)
        .eq("coffee_id", coffee_id);

      if (error) {
        console.error("Database update failed:", error.message);
      }
    } catch (err) {
      console.error("Update failed:", err.message);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <Header />
      <Helmet>
        <title>CoffeeShopMe | Keranjang Belanja</title>
      </Helmet>

      <div className="p-6 flex-grow max-w-7xl mx-auto mt-12">
        <div className="flex items-center mt-7 justify-between mb-6 sm:mb-8">
          <button
            onClick={() => navigate("/product")}
            className="p-2 sm:p-3 rounded-full bg-gray-100 dark:bg-gray-800 shadow-md text-gray-600 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all"
          >
            <FaArrowLeft className="text-xl sm:text-2xl" />
          </button>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white drop-shadow-md">
            Keranjang Belanja
          </h1>
          <div className="w-8 sm:w-10"></div>
        </div>

        {cart.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center py-8 sm:py-10">
            <img
              src="/Empty.gif"
              alt="Keranjang Kosong"
              className="w-48 sm:w-64 h-auto rounded-lg shadow-md transition-transform duration-300 hover:scale-105"
            />
            <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 mt-4 sm:mt-6 max-w-xs sm:max-w-md">
              Ups! Sepertinya keranjang Anda kosong. Mulai tambahkan kopi
              favorit Anda!
            </p>
            <button
              onClick={() => navigate("/product")}
              className="mt-4 sm:mt-6 bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 sm:px-8 py-2 sm:py-3 rounded-lg shadow-md text-base sm:text-lg font-semibold hover:from-orange-600 hover:to-orange-700 transform hover:scale-105 transition-all duration-300"
            >
              Mulai Belanja
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              {cart.map((item) => (
                <CheckableCartItem
                  key={item.coffee_id}
                  item={item}
                  isChecked={selectedItems.includes(item.coffee_id)}
                  toggleCheck={toggleCheck}
                  removeItem={removeItem}
                  updateQuantity={updateQuantity}
                />
              ))}
            </div>

            <div className="bg-white/80 dark:bg-gray-900/70 backdrop-blur-md border border-gray-200 dark:border-gray-700 rounded-3xl shadow-2xl p-6 sticky top-20 flex flex-col min-h-[320px] transition-all duration-300">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center tracking-tight">
                Ringkasan Pesanan
              </h2>

              <div className="space-y-4 text-gray-800 dark:text-gray-300 flex-grow">
                {filteredCart.length > 0 ? (
                  filteredCart.map((item) => (
                    <div
                      key={item.coffee_id}
                      className="flex justify-between items-center text-sm pb-2 border-b border-gray-200 dark:border-gray-700"
                    >
                      <p className="truncate max-w-[65%]">
                        {item.coffee.nama_produk} × {item.quantity}
                      </p>
                      <p className="font-medium">
                        {formatHarga(item.coffee.harga_produk * item.quantity)}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 dark:text-gray-400 text-center italic">
                    Pilih produk untuk checkout
                  </p>
                )}
              </div>

              {/* Total Harga */}
              <div className="flex justify-between items-center text-lg font-semibold text-gray-900 dark:text-white">
                <p>Total</p>
                <p>{formatHarga(totalHarga)}</p>
              </div>

              {/* Tombol Checkout */}
              <div className="mt-6">
                <CheckoutButton
                  cart={filteredCart}
                  totalHarga={totalHarga}
                  navigate={navigate}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
