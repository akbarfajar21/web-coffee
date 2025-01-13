import React, { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { supabase } from "../utils/SupaClient";
import Swal from "sweetalert2";

const ContactPage = () => {
  const [formData, setFormData] = useState({
    message: "",
    rating: 0,
  });

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
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { data: user, error: userError } = await supabase.auth.getUser();

    if (userError) {
      Swal.fire({
        title: "Tidak Terautentikasi",
        text: "Anda perlu login untuk mengirim testimoni.",
        imageUrl: "/login.gif",
        imageWidth: 300,
        imageHeight: 300,
        imageAlt: "Login Required",
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
          title: "Terjadi kesalahan",
          text: "Terjadi kesalahan saat mengirim pesan.",
        });
      } else {
        Swal.fire({
          icon: "success",
          title: "Pesan Terkirim!",
          text: "Pesan Anda telah berhasil dikirim.",
        });

        setFormData({ message: "", rating: 0 });
      }
    }
  };

  return (
    <>
      <Header />
      <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:bg-gradient-to-br dark:from-gray-900 dark:to-gray-800">
        <div className="py-8 px-6 max-w-4xl mx-auto flex-grow">
          <h1 className="text-5xl font-bold text-center mb-8 text-gray-800 mt-14 dark:text-gray-100">
            Hubungi Kami
          </h1>
          <p className="text-center text-lg text-gray-600 mb-12 dark:text-gray-300">
            Kami sangat menghargai umpan balik Anda. Silakan kirimkan pesan atau
            testimoni Anda di bawah ini.
          </p>

          <form
            onSubmit={handleSubmit}
            className="space-y-6 bg-white p-10 rounded-3xl shadow-xl border border-gray-200 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
          >
            <div>
              <label
                htmlFor="message"
                className="block text-sm font-medium text-gray-700 mb-2 dark:text-gray-300"
              >
                Pesan
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                className="w-full p-4 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 dark:focus:ring-blue-500"
                rows="6"
                placeholder="Tulis pesan Anda di sini"
              />
            </div>
            <div>
              <label
                htmlFor="rating"
                className="block text-sm font-medium text-gray-700 mb-2 dark:text-gray-300"
              >
                Rating
              </label>
              <div className="flex space-x-2 mt-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    type="button"
                    key={star}
                    className={`text-2xl transition-transform transform hover:scale-110 focus:outline-none ${
                      formData.rating >= star
                        ? "text-yellow-500"
                        : "text-gray-300 dark:text-gray-500"
                    }`}
                    onClick={() => handleRatingChange(star)}
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>
            <div className="flex justify-center">
              <button
                type="submit"
                className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg shadow-lg hover:bg-blue-700 hover:shadow-xl transition-transform transform hover:scale-105 dark:bg-blue-500 dark:hover:bg-blue-600"
              >
                Kirim Pesan
              </button>
            </div>
          </form>
        </div>

        {/* Location Map */}
        <div className="py-12 bg-white dark:bg-gray-800">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-semibold text-center mb-8 text-gray-800 dark:text-gray-100">
              Lokasi Kami
            </h2>
            <div className="relative pb-[56.25%] rounded-xl overflow-hidden shadow-lg dark:shadow-2xl">
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
