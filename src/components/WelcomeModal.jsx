import React from "react";
import { motion } from "framer-motion";

const WelcomeModal = ({ onClose }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60  z-50">
      <motion.div
        initial={{ opacity: 0, y: -30, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -30, scale: 0.9 }}
        transition={{ duration: 0.4, ease: "easeInOut" }}
        className="bg-gradient-to-br from-white to-gray-100 dark:from-gray-800 dark:to-gray-900 p-8 rounded-3xl shadow-2xl max-w-lg w-full text-center relative border border-gray-200 dark:border-gray-700"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 dark:text-gray-400 hover:scale-110 transition-transform duration-300"
        >
          ✖
        </button>

        {/* Heading */}
        <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">
          Selamat Datang di{" "}
          <span className="text-orange-500">CoffeeShopMe</span>! ☕✨
        </h2>

        {/* Deskripsi */}
        <p className="text-gray-600 dark:text-gray-300 mt-4 text-lg leading-relaxed">
          Nikmati kopi terbaik dan rasakan pengalaman belanja yang lebih nyaman
          & menyenangkan.
        </p>

        {/* Tombol Aksi */}
        <button
          onClick={onClose}
          className="mt-6 px-6 py-3 bg-orange-500 text-white text-lg font-semibold rounded-full shadow-md hover:bg-orange-600 transition-all duration-300 hover:shadow-lg"
        >
          Mulai Menjelajah
        </button>
      </motion.div>
    </div>
  );
};

export default WelcomeModal;
