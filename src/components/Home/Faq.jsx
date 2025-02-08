import React, { useState } from "react";
import { useSpring, animated } from "react-spring";
import { FaChevronDown } from "react-icons/fa";

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
    <div className=" dark:bg-gray-800 py-16 px-6">
      <h2 className="text-4xl font-extrabold text-center text-gray-800 dark:text-white mb-12">
        Frequently Asked Questions
      </h2>
      <div className="max-w-3xl mx-auto space-y-4">
        {faqs.map((faq, index) => {
          const props = useSpring({
            opacity: activeIndex === index ? 1 : 0,
            maxHeight: activeIndex === index ? "150px" : "0px",
            transform: activeIndex === index ? "scaleY(1)" : "scaleY(0.9)",
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
                    activeIndex === index ? "rotate-180 text-orange-500" : ""
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
