import React from "react";

const AboutUs = () => {
  return (
    <div className="p-6  dark:bg-gray-800">
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
            About Us
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 text-center lg:text-left">
            We are a company focused on providing high-quality coffee from
            around the world. Our mission is to deliver the best coffee
            experience for every customer, with a variety of coffee options that
            can be enjoyed at any time. We believe that every cup of coffee
            tells a story that connects people, and we are committed to
            providing flavors that pamper the senses with every sip.
          </p>
          <p className="text-lg text-gray-600 dark:text-gray-300 mt-4 text-center lg:text-left">
            We are also committed to sustainability and strive to support local
            coffee farmers in different parts of the world. Every coffee product
            we offer is carefully selected to ensure exceptional quality and
            taste. Thank you for being a part of our coffee journey!
          </p>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
