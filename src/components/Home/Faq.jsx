import React, { useState } from "react";
import { useSpring, animated } from "react-spring";
import { FaPlus, FaTimes } from "react-icons/fa"; // Menggunakan react-icons

const FAQ = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const faqs = [
    {
      question: "What is CoffeeShopMe?",
      answer:
        "CoffeeShopMe is a platform that offers a wide variety of the best coffee from all over the country with premium quality.",
    },
    {
      question: "How can I order coffee on CoffeeShopMe?",
      answer:
        "You can order coffee directly through our website by selecting the desired product and following the checkout steps.",
    },
    {
      question: "Do you offer delivery services?",
      answer:
        "Yes, we provide delivery services to all areas with fast and secure delivery times.",
    },
    {
      question: "What payment methods are accepted?",
      answer:
        "We accept various payment methods, including credit cards, bank transfers, and digital wallets like OVO and GoPay.",
    },
  ];

  return (
    <div className="faq-container dark:bg-gray-800 dark:text-gray-100 py-10">
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
                    <FaTimes className="w-6 h-6 text-gray-500 dark:text-gray-300" /> // Menggunakan FaTimes
                  ) : (
                    <FaPlus className="w-6 h-6 text-gray-500 dark:text-gray-300" /> // Menggunakan FaPlus
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
