import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { supabase } from "../utils/SupaClient";
import Swal from "sweetalert2";

const ContactPage = () => {
  const [formData, setFormData] = useState({
    message: "",
    rating: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [errors, setErrors] = useState({ message: "", rating: "" });

  // Simulasi loading selesai setelah beberapa waktu
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000); // Durasi 1 detik
    return () => clearTimeout(timer);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleRatingChange = (rating) => {
    setFormData({
      ...formData,
      rating,
    });
    setErrors({
      ...errors,
      rating: "",
    });
  };

  const validateForm = () => {
    const newErrors = {};
    if (formData.message.trim().length < 10) {
      newErrors.message = "Message must be at least 10 characters long.";
    }
    if (formData.rating === 0) {
      newErrors.rating = "Please select a rating.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const { data: user, error: userError } = await supabase.auth.getUser();

    if (userError) {
      Swal.fire({
        title: "Login Diperlukan",
        text: "Anda harus login terlebih dahulu untuk mengirim testimoni.",
        imageUrl: "/login.gif", // Gambar ilustrasi
        imageWidth: 250,
        imageHeight: 250,
        imageAlt: "Login Required",
        confirmButtonColor: "#2563eb", // Warna biru modern
        confirmButtonText: "Login Sekarang",
        background: "#ffffff",
        color: "#333333",
        customClass: {
          popup: "rounded-xl shadow-lg",
          title: "text-lg font-semibold",
          confirmButton: "px-6 py-2 rounded-lg bg-blue-600 hover:bg-blue-700",
        },
      });
    } else {
      const { data, error } = await supabase.from("testimoni").insert([
        {
          user_id: user.user.id,
          message: formData.message,
          rating: formData.rating,
          status: false,
        },
      ]);

      if (error) {
        Swal.fire({
          icon: "error",
          title: "Terjadi Kesalahan",
          text: error.message || "Terjadi kesalahan saat mengirim testimoni.",
          background: "#ffffff",
          color: "#333333",
          confirmButtonColor: "#ef4444",
          confirmButtonText: "Coba Lagi",
          customClass: {
            popup: "rounded-xl shadow-lg",
            title: "text-lg font-semibold",
            confirmButton: "px-6 py-2 rounded-lg bg-red-500 hover:bg-red-600",
          },
        });
      } else {
        Swal.fire({
          icon: "success",
          title: "Testimoni Terkirim!",
          text: "Terima kasih telah memberikan testimoni.",
          confirmButtonText: "Kembali ke Beranda",
          confirmButtonColor: "#22c55e", // Warna hijau modern
          background: "#ffffff",
          color: "#333333",
          timer: 2500,
          timerProgressBar: true,
          customClass: {
            popup: "rounded-xl shadow-lg",
            title: "text-lg font-semibold",
            confirmButton:
              "px-6 py-2 rounded-lg bg-green-500 hover:bg-green-600",
          },
        }).then((result) => {
          if (result.isConfirmed) {
            window.location.href = "/"; // Redirect ke halaman utama
          }
        });

        setFormData({ message: "", rating: 0 });
      }
    }
  };

  // Menampilkan loader selama proses pemuatan
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
        <div className="loader animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-opacity-70"></div>
      </div>
    );
  }

  return (
    <>
      <Header />
      <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:bg-gradient-to-br dark:from-gray-900 dark:to-gray-800">
        <div className="py-10 px-8 max-w-4xl mx-auto flex-grow">
          <h1 className="text-5xl font-bold text-center mb-8 text-gray-800 mt-14 dark:text-gray-100">
            Contact Us
          </h1>
          <p className="text-center text-lg text-gray-600 mb-12 dark:text-gray-300">
            We greatly value your feedback. Please send your message or
            testimonial below.
          </p>

          <form
            onSubmit={handleSubmit}
            className="space-y-8 bg-white p-10 rounded-3xl shadow-2xl border border-gray-200 dark:bg-gray-900 dark:border-gray-700 dark:text-gray-100 transition-all"
          >
            {/* Pesan */}
            <div className="space-y-3">
              <label
                htmlFor="message"
                className="block text-lg font-medium text-gray-700 dark:text-gray-300"
              >
                Pesan Anda
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                className="w-full p-4 border-2 border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100 dark:focus:ring-blue-400 transition-all"
                rows="5"
                placeholder="Tulis pesan Anda di sini..."
              />
              {errors.message && (
                <p className="text-red-500 text-sm">{errors.message}</p>
              )}
            </div>

            {/* Rating */}
            <div className="space-y-3">
              <label
                htmlFor="rating"
                className="block text-lg font-medium text-gray-700 dark:text-gray-300"
              >
                Berikan Rating
              </label>
              <div className="flex space-x-3 mt-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    type="button"
                    key={star}
                    className={`text-3xl transition-all duration-200 transform hover:scale-125 focus:outline-none ${
                      formData.rating >= star
                        ? "text-yellow-400 drop-shadow-md"
                        : "text-gray-300 dark:text-gray-600"
                    }`}
                    onClick={() => handleRatingChange(star)}
                  >
                    ★
                  </button>
                ))}
              </div>
              {errors.rating && (
                <p className="text-red-500 text-sm">{errors.rating}</p>
              )}
            </div>

            {/* Tombol Submit */}
            <div className="flex justify-center mt-6">
              <button
                type="submit"
                className="px-8 py-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold rounded-xl shadow-lg hover:from-blue-600 hover:to-indigo-700 focus:outline-none focus:ring-4 focus:ring-blue-300 transition-all transform hover:scale-105 dark:bg-gradient-to-r dark:from-blue-600 dark:to-indigo-700 dark:hover:from-blue-700 dark:hover:to-indigo-800"
              >
                Kirim Testimoni
              </button>
            </div>
          </form>
        </div>

        <div className="py-16 bg-white dark:bg-gray-800">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-semibold text-center mb-8 text-gray-800 dark:text-gray-100">
              Our Location
            </h2>
            <div className="relative pb-[56.25%] rounded-2xl overflow-hidden shadow-lg dark:shadow-2xl">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3965.8199462264847!2d107.17822927605911!3d-6.287382861543163!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e699b445d8375b1%3A0x2be0e0c5314813b1!2sPesantren%20SMP%20dan%20SMA%20Rabbaanii%20Islamic%20School!5e0!3m2!1sen!2sid!4v1733210702268!5m2!1sen!2sid"
                width="100%"
                height="100%"
                style={{
                  border: 0,
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </>
  );
};

export default ContactPage;
