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
  ];

  return (
    <div className=" dark:bg-gray-800 py-16 px-6">
      <h2 className="text-4xl font-extrabold text-center text-gray-800 dark:text-white mb-12">
        FAQ
      </h2>
      <div className="max-w-3xl mx-auto space-y-4">
        {faqs.map((faq, index) => {
          const props = useSpring({
            opacity: indexAktif === index ? 1 : 0,
            maxHeight: indexAktif === index ? "150px" : "0px",
            transform: indexAktif === index ? "scaleY(1)" : "scaleY(0.9)",
            overflow: "hidden",
            config: { tension: 220, friction: 25 },
          });

          return (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-5 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-2xl"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full flex justify-between items-center text-lg font-semibold text-gray-800 dark:text-white focus:outline-none"
              >
                <span>{faq.question}</span>
                <FaChevronDown
                  className={`transition-transform duration-300 ${
                    indexAktif === index ? "rotate-180 text-orange-500" : ""
                  }`}
                />
              </button>
              <animated.div style={props}>
                <p className="mt-4 text-gray-600 dark:text-gray-300">
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
