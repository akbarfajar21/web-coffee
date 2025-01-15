import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../utils/SupaClient";
import Header from "../components/Header";
import Swal from "sweetalert2";
import { FaStar, FaArrowLeft, FaEllipsisV } from "react-icons/fa";

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

      // Cek apakah pengguna sudah memberikan rating
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
        });
        return;
      }

      // Kirim rating dan komentar
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
        title: "Terima Kasih!",
        text: `Anda memberikan rating ${userRating} / 5 dengan komentar: "${comment}".`,
        icon: "success",
        willClose: () => {
          // Refresh halaman setelah SweetAlert ditutup
          window.location.reload();
        },
      });

      // Update rating produk
      const { data: ratingsData, error: ratingsError } = await supabase
        .from("rating")
        .select("rating")
        .eq("coffee_id", id);

      if (ratingsError) throw ratingsError;

      const avgRating =
        ratingsData.reduce((sum, rating) => sum + rating.rating, 0) /
        ratingsData.length;

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
        title: "Gagal Memberikan Rating!",
        text: error.message || "Silakan coba lagi.",
        icon: "error",
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
      }).then(async () => {
        const { data: ratingsData, error: ratingsError } = await supabase
          .from("rating")
          .select("rating")
          .eq("coffee_id", id);

        if (ratingsError) {
          console.error("Error saat menghitung rating produk:", ratingsError);
          throw ratingsError;
        }

        const avgRating = ratingsData.length
          ? ratingsData.reduce((sum, rating) => sum + rating.rating, null) /
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
      <div className="flex justify-center items-center h-screen bg-gray-50 dark:bg-gray-900">
        <div className="loader"></div>
      </div>
    );
  }

  if (!product) {
    return null;
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-gray-100 dark:from-gray-900 dark:to-black py-8 px-6 lg:px-12">
        <div className="flex mt-12 items-center mb-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-700 hover:text-gray-900 dark:text-white"
          >
            <FaArrowLeft className="text-xl mr-2" />
            <span className="text-md">Kembali</span>
          </button>
        </div>

        <div className="flex flex-col items-start gap-8">
          <div className="flex justify-center w-full">
            <img
              src={product.foto_barang}
              alt={product.nama_produk}
              className="w-80 h-auto rounded-lg shadow-md transform transition duration-300 hover:scale-105"
            />
          </div>

          <div className="w-full">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">
              {product.nama_produk}
            </h1>
            <p className="text-md text-gray-600 dark:text-gray-400 mb-4">
              {product.deskripsi}
            </p>
            <p className="text-2xl font-bold text-orange-600 dark:text-orange-400 mb-4">
              Rp {product.harga_produk.toLocaleString("id-ID")}
            </p>
            <p className="text-md text-gray-600 dark:text-gray-400 mb-4">
              <strong>Stok:</strong> {product.stok}
            </p>

            <div className="flex items-center mb-6">
              <FaStar className="text-yellow-500 text-xl" />
              <p className="text-md font-medium text-gray-800 dark:text-white ml-2">
                {rating ? Number(rating).toFixed(1) : "N/A"} / 5
              </p>
            </div>

            <div className="mt-4">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">
                Berikan Rating dan Komentar:
              </h2>
              <div className="flex items-center space-x-4 mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setUserRating(star)}
                    className={`text-2xl transition-transform duration-300 ${
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
                className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-orange-500 dark:bg-gray-800 dark:text-white"
                rows={3}
              ></textarea>
              <button
                onClick={handleRating}
                className="mt-3 px-5 py-2 bg-orange-600 text-white font-semibold rounded-lg hover:bg-orange-700"
              >
                Kirim
              </button>
            </div>

            <div className="border-t border-gray-300 dark:border-gray-700 my-6"></div>

            <div className="mt-6">
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">
                Rating Pengguna Lain:
              </h3>
              <div className="space-y-3">
                {userRatings.length > 0 ? (
                  userRatings.map((ratingItem, index) => (
                    <div
                      key={ratingItem.profile_id}
                      className="flex items-start space-x-3 p-3 border rounded-lg shadow-sm bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700"
                    >
                      <img
                        src={
                          ratingItem.profile.avatar_url || "/default-avatar.png"
                        }
                        alt={ratingItem.profile.full_name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div className="flex-grow">
                        <p className="font-semibold text-gray-800 dark:text-white">
                          {ratingItem.profile.full_name}
                        </p>
                        <div className="flex space-x-1 text-yellow-500">
                          {[...Array(ratingItem.rating)].map((_, index) => (
                            <FaStar key={index} />
                          ))}
                        </div>
                        <p className="text-gray-600 dark:text-gray-400 mt-2">
                          {ratingItem.komentar}
                        </p>
                      </div>
                      {user && ratingItem.profile_id === user.id && (
                        <div className="relative">
                          <button
                            onClick={() => toggleDropdown(index)}
                            className="text-gray-600 dark:text-gray-400 hover:text-gray-900"
                          >
                            <FaEllipsisV className="text-lg" />
                          </button>

                          {showDropdown === index && (
                            <div className="absolute right-0 mt-2 w-36 bg-white dark:bg-gray-700 border rounded-lg shadow-lg">
                              <button
                                onClick={() =>
                                  handleDeleteRating(ratingItem.profile_id)
                                }
                                className="block px-3 py-2 text-sm text-red-600 hover:bg-red-200 dark:text-red-400 dark:hover:bg-red-600"
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
                  <p className="text-gray-600 dark:text-gray-400">
                    Belum ada rating dari pengguna lain.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
