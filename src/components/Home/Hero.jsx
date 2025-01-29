import React from "react";

const HeroSection = () => {
  return (
    <section className="relative text-gray-700 dark:text-white">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-50 dark:brightness-50 transition-all duration-500"
        style={{
          backgroundImage: "url('https://cdn.pixabay.com/photo/2020/07/18/16/29/coffee-5417663_1280.png')",
          backgroundAttachment: "fixed",
          backgroundSize: "cover",
          backgroundPosition: "center center",
        }}
      ></div>
      <div className="relative container mx-auto px-4 py-32 sm:py-48">
        <div className="text-center">
          <h1 className="text-5xl sm:text-6xl font-extrabold leading-tight mb-6 typewriter-text">
            Welcome to CoffeeShopMe
          </h1>
          <p className="text-xl sm:text-2xl mb-6 typewriter-text">
            Enjoy the finest coffee crafted just for you. Join us for an
            unforgettable coffee experience.
          </p>
          <div className="flex justify-center">
            <a
              href="/product"
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-8 rounded-full shadow-lg transform transition duration-300 ease-in-out hover:scale-105"
            >
              Explore Our Products
            </a>
          </div>
        </div>
      </div>
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
      `}</style>
    </section>
  );
};

export default HeroSection;
