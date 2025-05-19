import React, { useEffect, useState } from "react";
import { supabase } from "../../utils/SupaClient";
import { motion, AnimatePresence } from "framer-motion";

const Testimonials = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [testimonialsPerPage] = useState(4);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTestimonials = async (page) => {
    try {
      setLoading(true);
      setError(null);

      const start = (page - 1) * testimonialsPerPage;
      const end = start + testimonialsPerPage - 1;

      // Ambil jumlah total testimoni
      const { count, error: countError } = await supabase
        .from("testimoni")
        .select("*", { count: "exact", head: true })
        .eq("status", true);

      if (countError) throw countError;

      // Ambil data testimoni per halaman
      const { data, error: fetchError } = await supabase
        .from("testimoni")
        .select("message, rating, profiles(full_name, avatar_url)")
        .eq("status", true)
        .range(start, end);

      if (fetchError) throw fetchError;

      setTestimonials(data || []);
      setTotalPages(Math.ceil(count / testimonialsPerPage));
    } catch (err) {
      console.error("Kesalahan saat mengambil testimoni:", err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTestimonials(currentPage);
  }, [currentPage]);

  if (error) {
    return (
      <p className="text-center text-red-500 dark:text-red-400">
        Terjadi kesalahan: {error}
      </p>
    );
  }

  return (
    <div className="py-12 px-6 w-full mx-auto bg-gray-50 dark:bg-gray-900">
      <h2 className="text-4xl font-extrabold text-center mb-10 text-gray-800 dark:text-white">
        Apa Kata Pelanggan Kami
      </h2>

      {testimonials.length === 0 ? (
        <div className="flex flex-col justify-center items-center text-center">
          <img
            src="/testimoni.gif"
            alt="GIF Testimoni"
            className="w-72 h-72 object-cover mb-6 rounded-xl shadow-lg"
          />
          <h2 className="text-2xl font-semibold text-gray-600 dark:text-gray-300">
            Belum ada testimoni
          </h2>
        </div>
      ) : (
        <>
          <AnimatePresence mode="wait">
            <motion.div
              key={currentPage} // supaya animasi trigger saat page berubah
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-14"
            >
              {testimonials.map((testimonial, index) => (
                <div
                  key={index}
                  className="relative bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md border border-gray-200 dark:border-gray-700 transition-all duration-300 hover:scale-105"
                >
                  <div className="absolute -top-10 left-1/2 transform -translate-x-1/2">
                    <img
                      src={testimonial.profiles.avatar_url}
                      alt={`Avatar dari ${testimonial.profiles.full_name}`}
                      className="w-20 h-20 rounded-full object-cover border-4 border-white dark:border-gray-700 shadow-lg"
                    />
                  </div>
                  <div className="mt-12 text-center">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                      {testimonial.profiles.full_name}
                    </h3>
                    <p className="italic text-sm text-gray-600 dark:text-gray-300 mt-2">
                      "{testimonial.message}"
                    </p>
                    <div className="mt-3 flex justify-center space-x-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <span
                          key={star}
                          className={`text-xl ${
                            testimonial.rating >= star
                              ? "text-yellow-500"
                              : "text-gray-300"
                          }`}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          </AnimatePresence>

          {/* Render pagination hanya jika lebih dari 1 halaman */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-10 space-x-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-4 py-2 rounded-xl font-medium border transition-all duration-200 ${
                      page === currentPage
                        ? "bg-blue-600 text-white border-blue-600"
                        : "bg-white dark:bg-gray-800 text-gray-700 dark:text-white border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                    }`}
                  >
                    {page}
                  </button>
                )
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Testimonials;
