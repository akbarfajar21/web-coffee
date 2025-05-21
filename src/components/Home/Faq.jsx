import React, { useState } from "react";
import { useSpring, animated } from "react-spring";
import { FaChevronDown } from "react-icons/fa";

const FAQ = () => {
  const [indexAktif, setIndexAktif] = useState(null);

  const toggleFAQ = (index) => {
    setIndexAktif(indexAktif === index ? null : index);
  };

  const faqs = [
    {
      question: "Apa itu CoffeeShopMe?",
      answer:
        "CoffeeShopMe adalah platform yang menawarkan berbagai jenis kopi terbaik dari seluruh negeri dengan kualitas premium.",
    },
    {
      question: "Bagaimana cara memesan kopi di CoffeeShopMe?",
      answer:
        "Anda dapat memesan kopi langsung melalui website kami dengan memilih produk yang diinginkan dan mengikuti langkah checkout.",
    },
    {
      question: "Apakah ada layanan pengiriman?",
      answer:
        "Ya, kami menyediakan layanan pengiriman ke seluruh wilayah dengan waktu pengiriman yang cepat dan aman.",
    },
    {
      question: "Metode pembayaran apa saja yang diterima?",
      answer:
        "Kami menerima berbagai metode pembayaran, termasuk kartu kredit, transfer bank, dan dompet digital seperti OVO dan GoPay.",
    },
    {
      question: "Apakah ada opsi pengembalian produk?",
      answer:
        "Ya, kami menyediakan opsi pengembalian produk jika produk Anda tidak sesuai dengan pesanan Anda.",
    },
  ];

  return (
    <div className="dark:bg-gray-900 py-10 px-4">
      <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-800 dark:text-white mb-8">
        Pertanyaan yang Sering Diajukan
      </h2>
      <div className="max-w-2xl mx-auto space-y-3">
        {faqs.map((faq, index) => {
          const props = useSpring({
            opacity: indexAktif === index ? 1 : 0,
            maxHeight: indexAktif === index ? 120 : 0,
            overflow: "hidden",
            config: { tension: 240, friction: 26 },
          });

          return (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-md px-4 py-3"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full flex justify-between items-center text-sm md:text-base font-medium text-gray-800 dark:text-white"
              >
                <span>{faq.question}</span>
                <FaChevronDown
                  className={`transform transition-transform duration-300 ${
                    indexAktif === index ? "rotate-180 text-orange-500" : ""
                  }`}
                />
              </button>
              <animated.div style={props}>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                  {faq.answer}
                </p>
              </animated.div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FAQ;
