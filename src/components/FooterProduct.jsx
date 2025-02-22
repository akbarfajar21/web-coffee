import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-8 mt-12">
      <div className="container mx-auto px-6 lg:px-12">
        {/* Bagian Atas - Navigasi dan Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center text-center md:text-left">
          {/* Logo & Hak Cipta */}
          <div>
            <h2 className="text-xl font-bold">CoffeeShopMe</h2>
            <p className="text-gray-400 mt-2">© 2024 CoffeeShopMe. All rights reserved.</p>
          </div>

          {/* Navigasi */}
          <div>
            <h3 className="text-lg font-semibold">Navigasi</h3>
            <ul className="mt-2 space-y-2">
              <li><a href="/" className="hover:text-orange-400 transition">Beranda</a></li>
              <li><a href="/produk" className="hover:text-orange-400 transition">Produk</a></li>
              <li><a href="/kontak" className="hover:text-orange-400 transition">Kontak</a></li>
            </ul>
          </div>

          {/* Sosial Media */}
          <div>
            <h3 className="text-lg font-semibold">Ikuti Kami</h3>
            <div className="flex justify-center md:justify-start mt-2 space-x-4">
              <a href="#" className="hover:text-orange-400 transition"><i className="fab fa-facebook text-xl"></i></a>
              <a href="#" className="hover:text-orange-400 transition"><i className="fab fa-instagram text-xl"></i></a>
              <a href="#" className="hover:text-orange-400 transition"><i className="fab fa-twitter text-xl"></i></a>
            </div>
          </div>
        </div>

        {/* Garis Pemisah */}
        <hr className="border-gray-700 my-6" />

        {/* Bagian Bawah - Metode Pembayaran */}
        <div className="text-center">
          <h3 className="text-lg font-semibold">Metode Pembayaran</h3>
          <div className="flex justify-center mt-4 space-x-4 flex-wrap">
            <img src="/images/visa.png" alt="Visa" className="h-10 w-auto" />
            <img src="/images/mastercard.png" alt="MasterCard" className="h-10 w-auto" />
            <img src="/images/gopay.png" alt="GoPay" className="h-10 w-auto" />
            <img src="/images/dana.png" alt="Dana" className="h-10 w-auto" />
            <img src="/images/qris.png" alt="QRIS" className="h-10 w-auto" />
            <img src="/images/bca.png" alt="BCA" className="h-10 w-auto" />
            <img src="/images/bni.png" alt="BNI" className="h-10 w-auto" />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
