import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../utils/SupaClient";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Swal from "sweetalert2";
import { FaStar, FaArrowLeft } from "react-icons/fa"; // Import FaArrowLeft

export default function DetailProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(0);
  const [userRating, setUserRating] = useState(0);

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

  const handleRating = async (newRating) => {
    try {
      setUserRating(newRating);

      const { data, error } = await supabase
        .from("coffee")
        .update({ rating_produk: newRating })
        .eq("id", id);

      if (error) throw error;

      Swal.fire({
        title: "Terima Kasih!",
        text: `Anda memberikan rating ${newRating} / 5.`,
        icon: "success",
      });

      setRating(newRating);
    } catch (error) {
      Swal.fire({
        title: "Gagal Memberikan Rating!",
        text: "Silakan coba lagi.",
        icon: "error",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
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
      <div className="min-h-screen bg-gray-50 py-12 px-4 lg:px-16">
        <div className="flex items-center mb-4">
          {/* Tombol Kembali */}
          <button
            onClick={() => navigate(-1)} // Navigasi kembali ke halaman sebelumnya
            className="flex items-center mt-11 text-gray-600 hover:text-gray-900"
          >
            <FaArrowLeft className="text-2xl mr-2" />
            <span>Kembali</span>
          </button>
        </div>

        <div className="flex flex-col lg:flex-row items-start gap-12">
          {/* Gambar Produk */}
          <div className="flex justify-center w-full lg:w-1/2">
            <img
              src={product.foto_barang}
              alt={product.nama_produk}
              className="w-full max-w-lg h-auto rounded-lg shadow-md object-cover transition-transform transform hover:scale-105 duration-300"
            />
          </div>

          {/* Detail Produk */}
          <div className="w-full lg:w-1/2">
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-800 mb-4">
              {product.nama_produk}
            </h1>
            <p className="text-lg text-gray-600 mb-6 leading-relaxed">
              {product.deskripsi}
            </p>
            <p className="text-3xl font-bold text-orange-600 mb-4">
              Harga: Rp {product.harga_produk.toLocaleString("id-ID")}
            </p>
            <p className="text-lg text-gray-600 mb-6">
              <strong>Stok:</strong> {product.stok}
            </p>
            <div className="flex items-center space-x-3 mb-8">
              <span className="text-yellow-500 text-2xl">
                <FaStar />
              </span>
              <p className="text-gray-800 text-lg font-medium">
                <strong>Rating:</strong>{" "}
                {rating ? Number(rating).toFixed(1) : "N/A"} / 5
              </p>
            </div>
            <div className="mt-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                Berikan Rating:
              </h2>
              <div className="flex items-center space-x-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => handleRating(star)}
                    className={`text-3xl ${
                      star <= userRating || star <= rating
                        ? "text-yellow-500"
                        : "text-gray-400"
                    } hover:text-yellow-600 hover:scale-125 transition-transform duration-300`}
                  >
                    <FaStar />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
