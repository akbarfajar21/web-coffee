import React from "react";

const HeroSection = () => {
  return (
    <section className="relative text-black dark:text-white">
      {/* Background Image with Overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-60 dark:brightness-50 transition-all duration-700 ease-in-out"
        style={{
          backgroundImage:
            "url('https://cdn.pixabay.com/photo/2020/07/18/16/29/coffee-5417663_1280.png')",
          backgroundAttachment: "fixed",
          backgroundSize: "cover",
          backgroundPosition: "center center",
        }}
      ></div>

      <div className="relative container mx-auto px-6 sm:px-12 py-32 sm:py-48">
        <div className="text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight mb-6 animate-fade-in">
            Welcome to <span className="text-orange-900 dark:text-orange-400">CoffeeShopMe</span>
          </h1>
          <p className="text-lg sm:text-xl mb-8 max-w-2xl mx-auto animate-slide-up">
            Savor the finest coffee, handcrafted just for you. Immerse yourself
            in an unforgettable coffee journey.
          </p>

          {/* Action Button */}
          <div className="flex justify-center">
            <a
              href="/product"
              className="bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white font-semibold py-3 px-10 rounded-full shadow-2xl transform transition duration-300 ease-in-out hover:scale-105"
            >
              Explore Our Products
            </a>
          </div>
        </div>
      </div>

      {/* Mobile-first Responsive Styling */}
      <style jsx>{`
        /* Mobile-first approach: background attachment scroll */
        @media (max-width: 640px) {
          .bg-cover {
            background-attachment: scroll;
          }
        }

        /* Medium screens: adjust background size and position */
        @media (max-width: 1024px) {
          .bg-cover {
            background-size: cover;
            background-position: center top;
          }
        }

        /* Large screens: maintain cover and center */
        @media (min-width: 1025px) {
          .bg-cover {
            background-size: cover;
            background-position: center center;
          }
        }

        /* Custom Animation for Fade-In */
        @keyframes fade-in {
          0% {
            opacity: 0;
            transform: translateY(20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 1s ease-out forwards;
        }

        /* Custom Animation for Slide-Up */
        @keyframes slide-up {
          0% {
            opacity: 0;
            transform: translateY(20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-slide-up {
          animation: slide-up 1s ease-out forwards;
        }
      `}</style>
    </section>
  );
};

export default HeroSection;
