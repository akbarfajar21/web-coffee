import React from "react";
import { useNavigate } from "react-router-dom";

export default function PaymentSuccess() {
  const navigate = useNavigate();

  const handleRedirect = () => {
    navigate("/product");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-8 shadow-lg text-center">
        <h1 className="text-3xl font-bold text-green-500 mb-4">
          Pembayaran Berhasil 🎉
        </h1>
        <p className="text-gray-700 dark:text-gray-300 mb-6">
          Terima kasih telah berbelanja di Coffee Shop! Pesanan Anda sedang
          diproses.
        </p>
        <button
          onClick={handleRedirect}
          className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-3 rounded-lg hover:from-orange-600 hover:to-orange-700 shadow-lg"
        >
          Oke
        </button>
      </div>
    </div>
  );
}
