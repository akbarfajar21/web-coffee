import React, { useEffect, useState } from "react";
import { supabase } from "../../utils/SupaClient";

const Testimoni = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        setLoading(true);
        setError(null);

        // Mengambil semua data testimoni yang statusnya true
        const { data, error: fetchError } = await supabase
          .from("testimoni")
          .select("message, rating, profiles(full_name, avatar_url)")
          .eq("status", true); // Filter status = true

        if (fetchError) throw fetchError;

        setTestimonials(data);
      } catch (err) {
        console.error("Error fetching testimonials:", err.message);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTestimonials();
  }, []);

  if (loading) {
    return <p className="text-center text-gray-500 dark:text-gray-300">Memuat testimoni...</p>;
  }

  if (error) {
    return (
      <p className="text-center text-red-500 dark:text-red-400">
        Terjadi kesalahan: {error}
      </p>
    );
  }

  return (
    <div className="py-8 px-4 w-full mx-auto dark:bg-gray-800">
      <h2 className="text-3xl font-bold text-center mb-6 dark:text-white">
        Testimoni Pengguna
      </h2>

      {testimonials.length === 0 ? (
        <div className="flex flex-col justify-center items-center text-center">
          <img
            src="/testimoni.gif"
            alt="Testimoni GIF"
            className="w-80 h-80 object-cover mb-4"
          />
          <h2 className="text-3xl font-semibold text-gray-600 dark:text-gray-300">
            Belum ada testimoni
          </h2>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="border border-gray-300 rounded-lg p-6 text-center shadow-lg dark:bg-gray-700 dark:border-gray-600"
            >
              <img
                src={testimonial.profiles.avatar_url}
                alt={`Avatar for ${testimonial.profiles.full_name}`}
                className="w-20 h-20 rounded-full mx-auto mb-4 object-cover"
              />
              <h3 className="text-lg font-semibold mb-2 dark:text-white">
                {testimonial.profiles.full_name}
              </h3>
              <p className="italic text-sm text-gray-600 dark:text-gray-300">
                "{testimonial.message}"
              </p>
              <div className="mt-2">
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
          ))}
        </div>
      )}
    </div>
  );
};

export default Testimoni;
