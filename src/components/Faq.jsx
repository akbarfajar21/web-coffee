import React, { useState } from "react";
import { useSpring, animated } from "react-spring";
import { PlusIcon, XMarkIcon } from "@heroicons/react/24/solid";

const FAQ = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const faqs = [
    {
      question: "Apa itu CoffeeShopMe?",
      answer:
        "CoffeeShopMe adalah platform yang menyediakan berbagai pilihan kopi terbaik dari seluruh negeri dengan kualitas premium.",
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
    <div className="faq-container  dark:bg-gray-800 dark:text-gray-100 py-10">
      <h2 className="faq-title text-2xl font-bold text-center text-black dark:text-white mb-8">
        FAQ
      </h2>
      <div className="max-w-6xl mx-auto px-4">
        {faqs.map((faq, index) => {
          const props = useSpring({
            opacity: activeIndex === index ? 1 : 0,
            maxHeight: activeIndex === index ? "200px" : "0px",
            overflow: "hidden",
            config: { tension: 300, friction: 30 },
          });

          return (
            <div
              key={index}
              className="faq-item bg-white dark:bg-gray-700 rounded-lg shadow-md mb-4"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="faq-button w-full flex justify-between items-center py-5 px-6 text-lg font-semibold text-gray-800 dark:text-white focus:outline-none"
              >
                <span>{faq.question}</span>
                <div className="flex items-center justify-center w-8 h-8">
                  {activeIndex === index ? (
                    <XMarkIcon className="w-6 h-6 text-gray-500 dark:text-gray-300" />
                  ) : (
                    <PlusIcon className="w-6 h-6 text-gray-500 dark:text-gray-300" />
                  )}
                </div>
              </button>
              <animated.div style={props}>
                <p className="faq-answer px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
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
