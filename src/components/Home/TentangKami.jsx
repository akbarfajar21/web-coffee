import React from "react";

const TentangKami = () => {
  return (
    <div className="p-6 bg-gray-100 dark:bg-gray-800">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between">
        <div className="w-full lg:w-1/2 lg:pr-8 mb-8 lg:mb-0">
          <img
            src="https://png.pngtree.com/png-vector/20240623/ourmid/pngtree-flying-cup-of-coffee-with-splash-and-png-image_12831547.png"
            alt="Coffee Splash"
            className="w-full h-auto object-contain animate-up-down"
          />
        </div>
        <div className="w-full lg:w-1/2">
          <h2 className="text-4xl font-bold text-gray-800 dark:text-gray-200 mb-4 text-center lg:text-left">
            Tentang Kami
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 text-center lg:text-left">
            Kami adalah perusahaan yang berfokus pada penyediaan kopi
            berkualitas tinggi dari seluruh dunia. Misi kami adalah memberikan
            pengalaman kopi terbaik untuk setiap pelanggan, dengan berbagai
            pilihan kopi yang dapat dinikmati kapan saja. Kami percaya bahwa
            setiap cangkir kopi adalah kisah yang menghubungkan orang, dan kami
            berkomitmen untuk memberikan rasa yang memanjakan indera setiap
            tegukan.
          </p>
          <p className="text-lg text-gray-600 dark:text-gray-300 mt-4 text-center lg:text-left">
            Kami juga berkomitmen untuk keberlanjutan dan berusaha untuk
            mendukung petani kopi lokal di berbagai belahan dunia. Setiap produk
            kopi yang kami tawarkan dipilih dengan cermat untuk memastikan
            kualitas dan cita rasa yang luar biasa. Terima kasih telah menjadi
            bagian dari perjalanan kopi kami!
          </p>
        </div>
      </div>
    </div>
  );
};

export default TentangKami;
