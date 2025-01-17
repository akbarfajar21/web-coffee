import React, { useState } from "react";
import { useSpring, animated } from "react-spring";
import "./FAQ.css"; // Import CSS file

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
    <div className="faq-container dark:bg-gray-800 dark:text-gray-100">
      <h2 className="faq-title text-white dark:text-white">FAQ</h2>
      <div className="max-w-7xl mx-auto px-4">
        {faqs.map((faq, index) => {
          const props = useSpring({
            opacity: activeIndex === index ? 1 : 0,
            maxHeight: activeIndex === index ? "200px" : "0px",
            overflow: "hidden",
          });

          return (
            <div key={index} className="faq-item bg-gray-200 dark:bg-gray-700 rounded-lg mb-4">
              <button
                onClick={() => toggleFAQ(index)}
                className="faq-button w-full text-left flex justify-between items-center py-4 px-6 text-lg font-semibold dark:bg-gray-600 dark:text-white dark:border-gray-600 rounded-lg"
              >
                <span>{faq.question}</span>
                <span>{activeIndex === index ? "x" : "+"}</span>
              </button>
              <animated.div style={props}>
                <p
                  className={`faq-answer p-4 rounded-lg text-sm dark:bg-gray-600 dark:text-white ${
                    activeIndex === index ? "faq-answer-open" : "faq-answer-closed"
                  }`}
                >
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
