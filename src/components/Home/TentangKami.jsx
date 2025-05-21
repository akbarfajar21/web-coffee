import React from "react";

const AboutUs = () => {
  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-5xl mx-auto flex flex-col-reverse lg:flex-row items-center gap-8">
        {/* Bagian Teks */}
        <div className="w-full lg:w-1/2 space-y-5">
          <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 leading-snug">
            Temukan <span className="text-orange-600">Cerita Kami</span>
          </h2>
          <p className="text-base text-gray-700 dark:text-gray-300 leading-relaxed">
            Kami berkomitmen untuk menghadirkan kopi terbaik dari seluruh dunia
            ke dalam cangkir Anda. Passion kami adalah menciptakan pengalaman
            kopi yang sempurna pada setiap tegukan, menghubungkan orang-orang
            lewat aroma dan rasa kopi premium.
          </p>
          <p className="text-base text-gray-700 dark:text-gray-300 leading-relaxed">
            Bertekad untuk berkelanjutan, kami mendukung petani kopi lokal dan
            memastikan setiap produk memenuhi standar kualitas tertinggi kami.
            Terima kasih telah menjadi bagian dari perjalanan kami!
          </p>
        </div>

        {/* Bagian Gambar */}
        <div className="w-full lg:w-1/2 flex justify-center">
          <img
            src="https://png.pngtree.com/png-vector/20240623/ourmid/pngtree-flying-cup-of-coffee-with-splash-and-png-image_12831547.png"
            alt="Tumpahan Kopi"
            className="w-full max-w-sm object-contain drop-shadow-md transition-transform duration-500 hover:scale-105"
          />
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
