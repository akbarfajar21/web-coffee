import React from "react";

const AboutUs = () => {
  return (
    <div className="p-10 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-6xl mx-auto flex flex-col-reverse lg:flex-row items-center gap-10">
        {/* Text Section */}
        <div className="w-full lg:w-1/2 space-y-6">
          <h2 className="text-4xl font-extrabold text-gray-800 dark:text-gray-100 leading-tight">
            Discover <span className="text-orange-600">Our Story</span>
          </h2>
          <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
            We are dedicated to bringing the finest coffee from around the globe
            to your cup. Our passion is to craft a perfect coffee experience
            that resonates with every sip, connecting people through the aroma
            and taste of premium coffee.
          </p>
          <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
            Committed to sustainability, we support local coffee farmers and
            ensure each product meets our highest quality standards. Thank you
            for being a part of our journey!
          </p>
        </div>

        {/* Image Section */}
        <div className="w-full lg:w-1/2 flex justify-center">
          <img
            src="https://png.pngtree.com/png-vector/20240623/ourmid/pngtree-flying-cup-of-coffee-with-splash-and-png-image_12831547.png"
            alt="Coffee Splash"
            className="w-full max-w-md object-contain drop-shadow-lg transition-transform duration-500 hover:scale-105"
          />
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
