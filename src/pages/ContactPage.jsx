import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { supabase } from "../utils/SupaClient";
import Swal from "sweetalert2";
import { Helmet } from "react-helmet";

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

    // Hitung jumlah kata dengan split berdasarkan spasi dan filter kata kosong
    const words = value.trim().split(/\s+/);

    if (words.length <= 10) {
      setFormData({
        ...formData,
        [name]: value,
      });
      setErrors({
        ...errors,
        message: "",
      });
    } else {
      setErrors({
        ...errors,
        message: "Pesan maksimal 10 kata saja.",
      });
    }
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
    const words = formData.message.trim().split(/\s+/);

    if (words.length < 5) {
      newErrors.message = "Pesan harus terdiri dari minimal 5 kata.";
    } else if (words.length > 10) {
      newErrors.message = "Pesan maksimal 10 kata saja.";
    }
    if (formData.rating === 0) {
      newErrors.rating = "Silakan pilih rating.";
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
        imageUrl: "/login.gif",
        imageWidth: 250,
        imageHeight: 250,
        imageAlt: "Login Required",
        confirmButtonColor: "#2563eb",
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
          html: `
          <p>Terima kasih telah memberikan testimoni. Berikut adalah proses selanjutnya:</p>
          <ol class="space-y-4 mt-4 text-left">
            <li><strong>1. Masuk ke Admin:</strong> Testimoni kamu akan masuk ke sistem kami.</li>
            <li><strong>2. Diverifikasi Manual:</strong> Kami tinjau dan pastikan testimoni sesuai.</li>
            <li><strong>3. Dipublikasikan:</strong> Jika lolos, akan tampil di homepage!</li>
          </ol>
        `,
          confirmButtonText: "Kembali ke Beranda",
          confirmButtonColor: "#22c55e", // Warna hijau modern
          background: "#ffffff",
          color: "#333333",
          customClass: {
            popup: "rounded-xl shadow-lg",
            title: "text-lg font-semibold",
            confirmButton:
              "px-6 py-2 rounded-lg bg-green-500 hover:bg-green-600",
          },
        }).then((result) => {
          if (result.isConfirmed) {
            window.location.href = "/home"; // Redirect ke halaman utama
          }
        });

        setFormData({ message: "", rating: 0 });
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
        <Helmet>
          <title>CoffeeShopMe | Contact</title>
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

  return (
    <>
      <Header />
      <div className="flex flex-col min-h-screen bg-gradient-to-br to-indigo-100 dark:bg-gradient-to-br dark:from-gray-900 dark:to-gray-800">
        <div className="py-6 px-6 max-w-3xl mx-auto flex-grow">
          <h1 className="text-3xl md:text-4xl font-bold text-center mb-6 text-gray-800 mt-14 dark:text-gray-100">
            Hubungi Kami
          </h1>
          <p className="text-center text-base md:text-lg text-gray-600 mb-8 dark:text-gray-300">
            Kami sangat menghargai masukan Anda. Silakan kirim pesan atau
            testimoni Anda di bawah ini.
          </p>

          <form
            onSubmit={handleSubmit}
            className="space-y-6 bg-white p-6 md:p-8 rounded-2xl shadow-md border border-gray-200 dark:bg-gray-900 dark:border-gray-700 dark:text-gray-100 transition-all"
          >
            <div className="space-y-2">
              <label
                htmlFor="message"
                className="block text-base md:text-lg font-medium text-gray-700 dark:text-gray-300"
              >
                Pesan Anda
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                className="w-full p-3 md:p-4 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100 dark:focus:ring-blue-400 transition-all"
                rows="4"
                placeholder="Tulis testimoni Anda di sini..."
              />
              <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 mt-1">
                {formData.message.trim().split(/\s+/).filter(Boolean).length} /
                10 kata
              </p>
              {errors.message && (
                <p className="text-red-500 text-xs md:text-sm">
                  {errors.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label
                htmlFor="rating"
                className="block text-base md:text-lg font-medium text-gray-700 dark:text-gray-300"
              >
                Berikan Penilaian
              </label>
              <div className="flex space-x-2 mt-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    type="button"
                    key={star}
                    className={`text-2xl md:text-3xl transition-all duration-200 transform hover:scale-110 focus:outline-none ${
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
                <p className="text-red-500 text-xs md:text-sm">
                  {errors.rating}
                </p>
              )}
            </div>

            <div className="flex justify-center mt-4">
              <button
                type="submit"
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold rounded-lg shadow-md hover:from-blue-600 hover:to-indigo-700 focus:outline-none focus:ring-4 focus:ring-blue-300 transition-all transform hover:scale-105 dark:bg-gradient-to-r dark:from-blue-600 dark:to-indigo-700 dark:hover:from-blue-700 dark:hover:to-indigo-800"
              >
                Kirim Testimoni
              </button>
            </div>
          </form>
        </div>

        <div className="py-10 bg-white dark:bg-gray-800">
          <div className="max-w-5xl mx-auto px-4 md:px-6">
            <h2 className="text-2xl md:text-3xl font-semibold text-center mb-8 text-gray-800 dark:text-gray-100">
              Lokasi Kami
            </h2>
            <div className="flex flex-col md:flex-row gap-6 md:gap-8">
              <div className="md:w-1/2 space-y-6">
                <div className="border-l-4 border-blue-500 pl-3">
                  <blockquote className="italic text-base md:text-lg text-gray-700 dark:text-gray-300">
                    "Kami percaya bahwa setiap tegukan kopi menyimpan cerita,
                    dan setiap pelanggan layak untuk didengar."
                  </blockquote>
                  <p className="mt-1 text-xs md:text-sm text-gray-500 dark:text-gray-400">
                    — CoffeeShopMe
                  </p>
                </div>

                <div className="border-l-4 border-green-500 pl-3">
                  <h3 className="text-lg md:text-xl font-semibold text-gray-800 dark:text-gray-100">
                    Hubungi Kami
                  </h3>
                  <p className="mt-1 text-xs md:text-sm text-gray-500 dark:text-gray-400">
                    Kami senang mendengar dari Anda! Untuk pertanyaan atau
                    informasi lebih lanjut, jangan ragu untuk menghubungi kami
                    melalui kontak pada footer website kami.
                  </p>
                </div>

                <div className="border-l-4 border-purple-500 pl-3">
                  <h3 className="text-lg md:text-xl font-semibold text-gray-800 dark:text-gray-100">
                    Ayo Bergabung dengan Kami!
                  </h3>
                  <p className="mt-1 text-xs md:text-sm text-gray-500 dark:text-gray-400">
                    Tertarik menjadi bagian dari tim CoffeeShopMe? Kami membuka
                    kesempatan bagi barista, kasir, dan staf kreatif. Kirimkan
                    CV dan portofolio Anda melalui email kami yang tertera di
                    footer.
                  </p>
                </div>

                <div className="space-y-3 mt-6">
                  <h3 className="text-lg md:text-xl font-semibold text-gray-800 dark:text-gray-100">
                    Galeri Suasana CoffeeShopMe
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    <img
                      src="https://media.istockphoto.com/id/1428594094/photo/empty-coffee-shop-interior-with-wooden-tables-coffee-maker-pastries-and-pendant-lights.jpg?s=612x612&w=0&k=20&c=dMqeYCJDs3BeBP_jv93qHRISDt-54895SPoVc6_oJt4="
                      alt="Interior CoffeeShopMe"
                      className="w-full h-full object-cover rounded-lg"
                    />
                    <img
                      src="gallery2.jpg"
                      alt="Kopi CoffeeShopMe"
                      className="w-full h-full object-cover rounded-lg"
                    />
                    <img
                      src="https://asset.kompas.com/crops/S8dfqn6WJCQ3kWaPxeroDa6KxEg=/0x76:4032x2764/750x500/data/photo/2021/09/11/613c98c27631e.jpg"
                      alt="Pelanggan CoffeeShopMe"
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </div>
                </div>
              </div>

              <div className="md:w-1/2 relative pb-[56.25%] rounded-xl overflow-hidden shadow-md dark:shadow-lg">
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
        </div>

        <Footer />
      </div>
    </>
  );
};

export default ContactPage;
