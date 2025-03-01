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
          title: "⚠️ Isi Semua Formulir!",
          text: "Harap berikan komentar sebelum mengirim.",
          iconHtml: "⚠️",
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

      // Cek apakah pengguna sudah memberikan rating sebelumnya
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

      // Jika belum ada rating, lanjutkan menyimpan rating baru
      const { data, error } = await supabase.from("rating").insert([
        {
          coffee_id: id,
          profile_id: user.id,
          rating: userRating,
          komentar: comment,
        },
      ]);

      if (error) throw error;

      Swal.fire({
        title: "🎉 Terima Kasih!",
        html: `
          <div class="text-gray-700 dark:text-gray-200">
            <p class="text-lg font-medium">
              Anda memberikan rating <strong class="text-orange-500">${userRating} / 5</strong>
            </p>
            <p class="italic text-sm mt-2">"${comment}"</p>
          </div>
        `,
        icon: "success",
        background: "#ffffff",
        color: "#333",
        confirmButtonColor: "#ff7b00",
        confirmButtonText: "🎯 Oke",
        customClass: {
          popup: "rounded-xl shadow-lg p-6",
          title: "text-2xl font-bold text-gray-900",
          confirmButton:
            "py-2 px-4 rounded-lg text-white bg-orange-500 hover:bg-orange-600 transition-all",
        },
      }).then(() => {
        window.location.reload();
      });

      // Hitung rata-rata rating terbaru
      const { data: ratingsData, error: ratingsError } = await supabase
        .from("rating")
        .select("rating")
        .eq("coffee_id", id);

      if (ratingsError) throw ratingsError;

      const avgRating =
        ratingsData.reduce((sum, rating) => sum + rating.rating, 0) /
        ratingsData.length;

      // Update rating di tabel coffee
      await supabase
        .from("coffee")
        .update({ rating_produk: avgRating })
        .eq("id", id);

      setRating(avgRating);
      setUserRatings([
        ...userRatings,
        {
          rating: userRating,
          komentar: comment,
          profile: {
            full_name: user.user_metadata.full_name,
            avatar_url: user.user_metadata.avatar_url,
          },
        },
      ]);
      setUserRating(0);
      setComment("");
    } catch (error) {
      Swal.fire({
        title: "❌ Gagal Memberikan Rating!",
        text: error.message || "Silakan coba lagi nanti.",
        iconHtml: "❌",
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

  const handleDeleteRating = async (ratingId) => {
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
      }).then(async () => {
        const { data: ratingsData, error: ratingsError } = await supabase
          .from("rating")
          .select("rating")
          .eq("coffee_id", id);

        if (ratingsError) throw ratingsError;

        const avgRating = ratingsData.length
          ? ratingsData.reduce((sum, rating) => sum + rating.rating, 0) /
            ratingsData.length
          : null;

        await supabase
          .from("coffee")
          .update({ rating_produk: avgRating })
          .eq("id", id);

        setRating(avgRating);
        window.location.reload();
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
          Brewing your coffee...
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
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-gray-100 dark:from-gray-900 dark:to-black py-12 px-6 lg:px-16">
        {/* Tombol Kembali */}
        <button
          onClick={() => navigate("/product")}
          className="flex items-center text-gray-700 mt-5 hover:text-gray-900 dark:text-white transition-all duration-300"
        >
          <FaArrowLeft className="text-xl mr-2" />
          <span className="text-lg font-medium">Kembali</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mt-8">
          {/* Gambar Produk */}
          <div className="flex justify-center">
            <img
              src={product.foto_barang}
              alt={product.nama_produk}
              className="w-full max-w-md h-auto object-cover rounded-2xl shadow-xl"
            />
          </div>

          {/* Info Produk */}
          <div className="flex flex-col">
            <h1 className="text-4xl font-bold text-gray-800 dark:text-white">
              {product.nama_produk}
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 mt-4">
              {product.deskripsi}
            </p>

            <p className="text-3xl font-bold text-orange-600 dark:text-orange-400 mt-6">
              Rp {product.harga_produk.toLocaleString("id-ID")}
            </p>

            <p className="text-lg text-gray-700 dark:text-gray-300 mt-4">
              <strong>Stok:</strong> {product.stok}
            </p>

            {/* Rating Produk */}
            <div className="flex items-center mt-6">
              <FaStar className="text-yellow-500 text-2xl" />
              <p className="text-xl font-medium text-gray-800 dark:text-white ml-2">
                {rating ? Number(rating).toFixed(1) : "N/A"} / 5
              </p>
            </div>

            {/* Form Rating dan Komentar */}
            <div className="mt-8">
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">
                Berikan Rating dan Komentar:
              </h2>
              <div className="flex items-center space-x-3 mt-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setUserRating(star)}
                    className={`text-3xl transition-all duration-300 ${
                      star <= userRating
                        ? "text-yellow-500"
                        : "text-gray-400 dark:text-gray-500"
                    } hover:text-yellow-600 hover:scale-125`}
                  >
                    <FaStar />
                  </button>
                ))}
              </div>
              <textarea
                placeholder="Tambahkan komentar Anda..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full p-4 border-2 border-gray-300 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 dark:bg-gray-800 dark:text-white mt-4"
                rows={4}
              />
              <button
                onClick={handleRating}
                className="w-full py-3 mt-4 bg-orange-600 text-white font-semibold rounded-lg hover:bg-orange-700 transition-all duration-300"
              >
                Kirim
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-300 dark:border-gray-700 my-12"></div>

        {/* Rating Pengguna Lain */}
        <div className="mt-10">
          <h3 className="text-xl md:text-2xl font-semibold text-gray-800 dark:text-white">
            Rating Pengguna Lain:
          </h3>
          <div className="space-y-4 mt-4">
            {userRatings.length > 0 ? (
              userRatings.map((ratingItem, index) => (
                <div
                  key={ratingItem.profile_id}
                  className="flex items-start space-x-3 p-3 md:p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700"
                >
                  <img
                    src={ratingItem.profile.avatar_url || "/default-avatar.png"}
                    alt={ratingItem.profile.full_name}
                    className="w-12 h-12 rounded-full object-cover border-2 border-orange-500"
                  />
                  <div className="flex-grow">
                    <p className="font-semibold text-gray-800 dark:text-white text-sm md:text-base">
                      {ratingItem.profile.full_name}
                    </p>
                    <div className="flex space-x-1 text-yellow-500 mt-1">
                      {[...Array(ratingItem.rating)].map((_, i) => (
                        <FaStar key={i} className="text-sm md:text-base" />
                      ))}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {ratingItem.komentar}
                    </p>
                  </div>

                  {/* Dropdown Menu untuk Edit / Hapus */}
                  {user && ratingItem.profile_id === user.id && (
                    <div className="relative">
                      <button
                        onClick={() => toggleDropdown(index)}
                        className="text-gray-600 dark:text-gray-400 hover:text-gray-900 focus:outline-none transition-all duration-300 ease-in-out transform hover:scale-105"
                      >
                        <FaEllipsisV className="text-base" />
                      </button>

                      {showDropdown === index && (
                        <div className="absolute right-0 mt-2 w-36 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-2xl transition-all duration-200 ease-in-out">
                          <button
                            onClick={() =>
                              handleDeleteRating(ratingItem.profile_id)
                            }
                            className="block w-full px-4 py-2 text-sm text-red-600 hover:bg-red-200 dark:text-red-400 dark:hover:bg-red-600 focus:outline-none transition-all duration-200 ease-in-out rounded-lg"
                          >
                            Hapus Rating
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
                Belum ada rating dari pengguna lain.
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
