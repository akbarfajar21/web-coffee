import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";

function AboutPage() {
  const [isLoading, setIsLoading] = useState(true);

  // Simulasi loading selesai setelah beberapa waktu
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000); // Durasi 1 detik
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
        <div className="loader animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-opacity-70"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen dark:bg-gray-900">
      <Header />
      <main className="flex-grow mt-10 px-6 md:px-20">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 mt-10 dark:text-white text-center">
          About Us
        </h1>
        <section className="about py-12 rounded-lg">
          <div className="flex flex-col md:flex-row items-center justify-center gap-8">
            <p className="text-gray-700 dark:text-gray-300 text-base md:text-lg leading-relaxed max-w-2xl">
              At Coffee Shop Me, we believe that coffee is more than just a
              beverage—it's a way of life. Since our establishment in 2022, we
              have been committed to serving the finest cup of coffee with
              authentic and impressive flavors. This is a space to relax, enjoy
              coffee while creating memories with friends, or work in an
              environment that supports productivity.
            </p>
          </div>
        </section>

        <section className="gallery">
          <h2 className="text-3xl md:text-4xl font-semibold text-gray-800 dark:text-gray-100 mb-6 text-center">
            Our Gallery
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <img
              src="gallery1.webp"
              alt="Interior"
              className="rounded-lg shadow-md"
            />
            <img
              src="gallery2.jpg"
              alt="Coffee Event"
              className="rounded-lg shadow-md"
            />
            <img
              src="gallery3.jpg"
              alt="Coffee Menu"
              className="rounded-lg shadow-md"
            />
            <img
              src="gallery4.jpg"
              alt="Barista"
              className="rounded-lg shadow-md"
            />
          </div>
        </section>

        <section className="cta text-center mt-20">
          <h2 className="text-3xl md:text-4xl font-extrabold dark:text-white mb-6">
            Join Our Coffee Community
          </h2>
          <p className="text-base md:text-lg mb-8 max-w-2xl dark:text-white mx-auto">
            Follow us on social media and be a part of our journey. Share your
            coffee moments using #CoffeeShopMe and meet new friends who share
            the same love for coffee.
          </p>
        </section>
      </main>
      <Footer />
    </div>
  );
}

export default AboutPage;
