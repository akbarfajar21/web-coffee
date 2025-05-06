import React, { useEffect, useState } from "react";
import { supabase } from "../../utils/SupaClient";

const Testimonials = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch all testimonials with a status of true
        const { data, error: fetchError } = await supabase
          .from("testimoni")
          .select("message, rating, profiles(full_name, avatar_url)")
          .eq("status", true); // Filter by status = true

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
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="spinner-border animate-spin inline-block w-16 h-16 border-4 rounded-full border-t-4 border-gray-300 dark:border-t-gray-700"></div>
        <p className="text-center text-gray-500 dark:text-white dark:bg-gray-800 ml-4">
          Loading testimonials...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <p className="text-center text-red-500 dark:text-red-400">
        An error occurred: {error}
      </p>
    );
  }

  return (
    <div className="py-12 mt-12 px-6 w-full mx-auto bg-gray-50 dark:bg-gray-900">
      <h2 className="text-4xl font-extrabold text-center mb-10 text-gray-800 dark:text-white">
        What Our Customers Say
      </h2>

      {testimonials.length === 0 ? (
        <div className="flex flex-col justify-center items-center text-center">
          <img
            src="/testimoni.gif"
            alt="Testimonial GIF"
            className="w-72 h-72 object-cover mb-6 rounded-xl shadow-lg"
          />
          <h2 className="text-2xl font-semibold text-gray-600 dark:text-gray-300">
            No testimonials yet
          </h2>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-14">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="relative bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md border border-gray-200 dark:border-gray-700 transition-all duration-300 hover:scale-105"
            >
              {/* Avatar */}
              <div className="absolute -top-10 left-1/2 transform -translate-x-1/2">
                <img
                  src={testimonial.profiles.avatar_url}
                  alt={`Avatar of ${testimonial.profiles.full_name}`}
                  className="w-20 h-20 rounded-full object-cover border-4 border-white dark:border-gray-700 shadow-lg"
                />
              </div>

              <div className="mt-12 text-center">
                {/* Name */}
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                  {testimonial.profiles.full_name}
                </h3>

                {/* Testimonial Message */}
                <p className="italic text-sm text-gray-600 dark:text-gray-300 mt-2">
                  "{testimonial.message}"
                </p>

                {/* Star Rating */}
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
        </div>
      )}
    </div>
  );
};

export default Testimonials;
