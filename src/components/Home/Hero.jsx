import React from "react";

const HeroSection = () => {
  return (
    <section className="relative text-white overflow-hidden">
      {/* Background Image with Blur Overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-fixed brightness-75"
        style={{
          backgroundImage:
            "url('https://cdn.pixabay.com/photo/2020/07/18/16/29/coffee-5417663_1280.png')",
        }}
      >
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>
      </div>

      {/* Hero Content */}
      <div className="relative container mx-auto px-6 sm:px-12 py-40 sm:py-52 flex flex-col items-center text-center">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight mb-6 animate-fade-in">
          Welcome to <span className="text-orange-400">CoffeeShopMe</span>
        </h1>
        <p className="text-lg sm:text-xl max-w-2xl mx-auto mb-8 animate-slide-up">
          Savor the finest coffee, handcrafted just for you. Immerse yourself in
          an unforgettable coffee journey.
        </p>

        {/* Action Button */}
        <a
          href="/product"
          className="bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white font-semibold py-3 px-10 rounded-full shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-orange-500/50"
        >
          Explore Our Products
        </a>
      </div>

      {/* Animasi & Styling */}
      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 1s ease-out forwards;
        }

        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-slide-up {
          animation: slide-up 1.2s ease-out forwards;
        }
      `}</style>
    </section>
  );
};

export default HeroSection;
