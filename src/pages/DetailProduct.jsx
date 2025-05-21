import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../utils/SupaClient";
import Header from "../components/Header";
import Swal from "sweetalert2";
import { FaStar, FaArrowLeft, FaEllipsisV } from "react-icons/fa";
import { Helmet } from "react-helmet";

export default function DetailProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(0);
  const [userRating, setUserRating] = useState(0);
  const [userRatings, setUserRatings] = useState([]);
  const [showDropdown, setShowDropdown] = useState(null);
  const [user, setUser] = useState(null);
  const [comment, setComment] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("coffee")
          .select(
            "id, nama_produk, harga_produk, deskripsi, stok, foto_barang, rating_produk"
          )
          .eq("id", id)
          .single();

        if (error) throw error;
        setProduct(data);
        setRating(data.rating_produk || 0);

        const { data: ratingsData, error: ratingsError } = await supabase
          .from("rating")
          .select("rating, profile_id, komentar")
          .eq("coffee_id", id);

        if (ratingsError) throw ratingsError;

        const userProfilePromises = ratingsData.map(async (rating) => {
          const { data: profileData, error: profileError } = await supabase
            .from("profiles")
            .select("full_name, avatar_url")
            .eq("id", rating.profile_id)
            .single();

          if (profileError) return null;

          return { ...rating, profile: profileData };
        });

        const profiles = await Promise.all(userProfilePromises);
        setUserRatings(profiles.filter((profile) => profile !== null));

        const { data: currentUser, error: authError } =
          await supabase.auth.getUser();
        if (!authError && currentUser) {
          setUser(currentUser.user);
          const userRating = ratingsData.find(
            (rating) => rating.profile_id === currentUser.user.id
          );
          setUserRating(userRating ? userRating.rating : null);
        }
      } catch (error) {
        Swal.fire({
          title: "Gagal Memuat Data!",
          text: "Produk tidak ditemukan atau ada masalah dengan koneksi.",
          icon: "error",
          confirmButtonText: "Kembali",
        }).then(() => navigate("/products"));
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, navigate]);

  useEffect(() => {
    const channel = supabase
      .channel("realtime-rating")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "rating",
          filter: `coffee_id=eq.${id}`,
        },
        async () => {
          // Ambil ulang data rating setiap ada perubahan
          const { data: ratingsData, error: ratingsError } = await supabase
            .from("rating")
            .select("rating, profile_id, komentar")
            .eq("coffee_id", id);

          if (!ratingsError) {
            const userProfilePromises = ratingsData.map(async (rating) => {
              const { data: profileData } = await supabase
                .from("profiles")
                .select("full_name, avatar_url")
                .eq("id", rating.profile_id)
                .single();
              return { ...rating, profile: profileData };
            });

            const profiles = await Promise.all(userProfilePromises);
            setUserRatings(profiles.filter((p) => p !== null));

            // Update rating rata-rata juga
            const avgRating =
              ratingsData.reduce((sum, r) => sum + r.rating, 0) /
              ratingsData.length;
            setRating(avgRating);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [id]);

  const handleRating = async () => {
    try {
      if (!user) {
        Swal.fire({
          title: "Tidak Terautentikasi",
          text: "Anda harus login untuk memberikan rating dan komentar.",
          icon: "warning",
        });
        return;
      }

      if (userRating === 0) {
        Swal.fire({
          title: "Pilih Rating!",
          text: "Harap pilih rating bintang sebelum mengirim.",
          icon: "warning",
        });
        return;
      }

      if (comment.trim() === "") {
        Swal.fire({
          title: "Isi Semua Formulir!",
          text: "Harap berikan komentar sebelum mengirim.",
          icon: "warning",
          confirmButtonText: "OK, Mengerti",
          background: "#ffffff",
          color: "#333",
          confirmButtonColor: "#F59E0B",
          showClass: {
            popup: "animate__animated animate__fadeInDown animate__faster",
          },
          hideClass: {
            popup: "animate__animated animate__fadeOutUp animate__faster",
          },
          customClass: {
            popup:
              "rounded-xl shadow-lg backdrop-blur-sm border border-gray-200",
            confirmButton: "px-6 py-2 rounded-lg text-lg font-semibold",
          },
        });
        return;
      }

      const { data: existingRatings, error: existingError } = await supabase
        .from("rating")
        .select("id")
        .eq("coffee_id", id)
        .eq("profile_id", user.id);

      if (existingError) throw existingError;

      if (existingRatings.length > 0) {
        Swal.fire({
          title: "Anda Sudah Memberikan Rating!",
          text: "Anda hanya bisa memberikan satu rating per produk.",
          icon: "info",
          confirmButtonColor: "#ff7b00",
        });
        return;
      }

      const { error: insertError } = await supabase.from("rating").insert([
        {
          coffee_id: id,
          profile_id: user.id,
          rating: userRating,
          komentar: comment,
        },
      ]);

      if (insertError) throw insertError;

      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("full_name, avatar_url")
        .eq("id", user.id)
        .single();

      if (profileError) throw profileError;

      setUserRatings((prev) => [
        ...prev,
        {
          profile_id: user.id,
          rating: userRating,
          komentar: comment,
          profile: {
            full_name: profileData.full_name,
            avatar_url: profileData.avatar_url,
          },
        },
      ]);

      setUserRating(0);
      setComment("");

      Swal.fire({
        title: "Terima Kasih!",
        html: `
        <div style="color: #374151;">
        <p style="font-size: 1rem; font-weight: 500;">
        Anda memberikan rating <strong style="color: #f97316;">${userRating} / 5</strong>
        </p>
        <p style="font-style: italic; font-size: 0.875rem; margin-top: 0.5rem;">"${comment}"</p>
        </div>
        `,
        icon: "success",
        iconColor: "#10b981", // hijau modern
        background: "#f9fafb", // abu terang elegan
        color: "#1f2937", // abu gelap
        confirmButtonColor: "#10b981", // hijau toska
        confirmButtonText: "Oke",
        showClass: {
          popup: "swal2-show",
        },
        hideClass: {
          popup: "swal2-hide",
        },
        customClass: {
          popup: "rounded-xl shadow-lg px-6 pt-6 pb-4",
          title: "text-xl font-semibold",
          confirmButton: "swal2-confirm swal2-styled",
        },
      });

      // Hitung ulang rata-rata rating
      const { data: ratingsData, error: ratingsError } = await supabase
        .from("rating")
        .select("rating")
        .eq("coffee_id", id);

      if (ratingsError) throw ratingsError;

      const avgRating =
        ratingsData.reduce((sum, r) => sum + r.rating, 0) / ratingsData.length;

      // Update rating di tabel coffee
      await supabase
        .from("coffee")
        .update({ rating_produk: avgRating })
        .eq("id", id);

      setRating(avgRating);
    } catch (error) {
      Swal.fire({
        title: "Gagal Memberikan Rating!",
        text: error.message || "Silakan coba lagi nanti.",
        icon: "error", // icon bawaan SweetAlert (error)
        confirmButtonText: "OK, Mengerti",
        background: "#ffffff",
        color: "#333",
        confirmButtonColor: "#EF4444",
        showClass: {
          popup: "animate__animated animate__shakeX",
        },
        customClass: {
          popup:
            "rounded-lg shadow-2xl backdrop-blur-sm border border-gray-200",
          confirmButton: "px-6 py-2 rounded-lg text-lg font-semibold",
        },
      });
    }
  };

  const handleDeleteRating = async (ratingProfileId) => {
    try {
      if (!user) {
        Swal.fire({
          title: "Tidak Terautentikasi",
          text: "Anda harus login untuk menghapus rating.",
          icon: "warning",
        });
        return;
      }

      const { error } = await supabase
        .from("rating")
        .delete()
        .eq("profile_id", user.id)
        .eq("coffee_id", id);

      if (error) throw error;

      setUserRatings((prevRatings) =>
        prevRatings.filter(
          (ratingItem) =>
            !(
              ratingItem.profile_id === user.id &&
              ratingItem.profile_id === ratingProfileId
            )
        )
      );

      setUserRating(0);

      const { data: ratingsData, error: ratingsError } = await supabase
        .from("rating")
        .select("rating")
        .eq("coffee_id", id);

      if (ratingsError) throw ratingsError;

      const avgRating = ratingsData.length
        ? ratingsData.reduce((sum, r) => sum + r.rating, 0) / ratingsData.length
        : null;

      await supabase
        .from("coffee")
        .update({ rating_produk: avgRating })
        .eq("id", id);

      setRating(avgRating);

      Swal.fire({
        title: "Rating Dihapus!",
        text: "Rating Anda telah dihapus.",
        icon: "success",
        iconColor: "#4CAF50",
        background: "#f8f9fa",
        color: "#333",
        showConfirmButton: false,
        timer: 2000,
        toast: true,
        position: "top-end",
        customClass: {
          popup: "rounded-xl shadow-lg border border-gray-200",
          title: "text-lg font-semibold",
          content: "text-gray-600",
        },
      });
    } catch (error) {
      Swal.fire({
        title: "Gagal Menghapus Rating!",
        text: error.message || "Silakan coba lagi.",
        icon: "error",
      });
    }
  };

  const toggleDropdown = (index) => {
    setShowDropdown(showDropdown === index ? null : index);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
        <Helmet>
          <title>{`CoffeeShopMe - ${product?.nama_produk || "Produk"}`}</title>
        </Helmet>
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
    );
  }

  if (!product) {
    return null;
  }

  return (
    <>
      <Header />

      <Helmet>
        <title>{`CoffeeShopMe - ${
          product ? product.nama_produk : "Memuat..."
        }`}</title>
      </Helmet>

      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-gray-100 dark:from-gray-900 dark:to-black py-10 px-4 md:px-10 lg:px-20">
        <button
          onClick={() => navigate("/product")}
          className="flex items-center text-gray-700 mt-9 dark:text-white hover:text-orange-600 dark:hover:text-orange-400 transition-all duration-300"
        >
          <FaArrowLeft className="text-xl mr-2" />
          <span className="text-lg font-semibold">Kembali ke Produk</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mt-10">
          <div className="flex justify-center items-center">
            <img
              src={product.foto_barang}
              alt={product.nama_produk}
              className="w-full max-w-lg h-auto object-cover rounded-3xl shadow-lg"
            />
          </div>

          <div className="flex flex-col space-y-5">
            <h1 className="text-4xl font-bold text-gray-800 dark:text-white">
              {product.nama_produk}
            </h1>

            <p className="text-gray-600 dark:text-gray-300 text-base leading-relaxed">
              {product.deskripsi}
            </p>

            <p className="text-3xl font-semibold text-orange-600 dark:text-orange-400">
              Rp {product.harga_produk.toLocaleString("id-ID")}
            </p>

            <p className="text-gray-700 dark:text-gray-300">
              <strong>Stok:</strong> {product.stok}
            </p>

            <div className="flex items-center mt-2">
              <FaStar className="text-yellow-500 text-xl" />
              <span className="ml-2 text-lg font-medium text-gray-800 dark:text-white">
                {rating ? Number(rating).toFixed(1) : "0"} / 5
              </span>
            </div>

            <div className="mt-6">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
                Berikan Rating & Komentar:
              </h2>

              <div className="flex space-x-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setUserRating(star)}
                    className={`text-3xl transition-all ${
                      star <= userRating
                        ? "text-yellow-500"
                        : "text-gray-400 dark:text-gray-500"
                    } hover:scale-125 hover:text-yellow-600`}
                  >
                    <FaStar />
                  </button>
                ))}
              </div>

              <textarea
                placeholder="Tulis komentar Anda..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full mt-4 p-4 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-orange-500 dark:bg-gray-800 dark:text-white"
                rows={4}
              />

              <button
                onClick={handleRating}
                className="w-full mt-4 py-3 bg-orange-600 text-white font-bold rounded-xl hover:bg-orange-700 transition"
              >
                Kirim Rating
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-300 dark:border-gray-700 my-12"></div>

        <div className="mt-10">
          <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
            Ulasan Pengguna Lain:
          </h3>

          {userRatings.length > 0 ? (
            <div className="space-y-6">
              {userRatings.map((ratingItem, index) => (
                <div
                  key={ratingItem.profile_id}
                  className="flex items-start p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-md hover:shadow-lg transition min-w-0"
                >
                  <img
                    src={ratingItem.profile.avatar_url || "/default-avatar.png"}
                    alt={ratingItem.profile.full_name}
                    className="w-12 h-12 rounded-full object-cover border-2 border-orange-500 mr-4 flex-shrink-0"
                  />
                  <div className="flex-grow min-w-0 overflow-hidden">
                    <p className="font-semibold text-gray-800 dark:text-white truncate">
                      {ratingItem.profile.full_name}
                    </p>
                    <div className="flex space-x-1 text-yellow-500 mt-1">
                      {[...Array(ratingItem.rating)].map((_, i) => (
                        <FaStar key={i} className="text-sm" />
                      ))}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 break-words whitespace-normal">
                      {ratingItem.komentar}
                    </p>
                  </div>

                  {user && ratingItem.profile_id === user.id && (
                    <div className="relative">
                      <button
                        onClick={() => toggleDropdown(index)}
                        className="text-gray-500 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white transition"
                      >
                        <FaEllipsisV className="text-lg" />
                      </button>

                      {showDropdown === index && (
                        <div className="absolute right-0 mt-2 w-36 bg-white dark:bg-gray-700 rounded-md shadow-lg z-10">
                          <button
                            onClick={() => {
                              handleDeleteRating(user.id);
                              setShowDropdown(null);
                            }}
                            className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-100 dark:hover:bg-red-800 rounded-md"
                          >
                            Hapus Rating
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-600 dark:text-gray-400">
              Belum ada rating dari pengguna lain.
            </p>
          )}
        </div>
      </div>
    </>
  );
}
