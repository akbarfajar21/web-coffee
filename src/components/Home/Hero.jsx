import React from "react";

const HeroSection = () => {
  return (
    <section className="relative text-gray-700 dark:text-white">
      <div
        className="absolute inset-0 bg-cover bg-bottom opacity-50 bg-fixed dark:brightness-50"
        style={{ backgroundImage: "url('/coffee-background.jpg')" }}
      ></div>
      <div className="relative container mx-auto px-4 py-32 sm:py-48">
        <div className="text-center">
          <h1 className="text-5xl sm:text-6xl font-extrabold leading-tight mb-6 typewriter-text">
            Selamat Datang di CoffeeShopMe
          </h1>
          <p className="text-xl sm:text-2xl mb-6 typewriter-text">
            Nikmati kopi terbaik yang disiapkan khusus untuk Anda. Bergabunglah
            dengan kami untuk pengalaman kopi yang tak terlupakan.
          </p>
          <div className="flex justify-center">
            <a
              href="/product"
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-8 rounded-full shadow-lg transform transition duration-300 ease-in-out hover:scale-105"
            >
              Jelajahi Produk Kami
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
