import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";

function AboutPage() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000); 
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
        <div className="relative flex items-center justify-center">
          <div className="absolute -top-8 flex space-x-2">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-2 h-6 bg-gray-400 opacity-50 rounded-full animate-steam"
                style={{ animationDelay: `${i * 0.2}s` }}
              ></div>
            ))}
          </div>

          <div className="relative w-20 h-16 bg-gradient-to-b from-orange-500 to-orange-700 rounded-t-full flex items-end justify-center shadow-lg glow-effect">
            <div className="absolute bottom-0 w-16 h-12 bg-white dark:bg-gray-800 rounded-t-full"></div>
          </div>

          <div className="absolute right-[-10px] top-[6px] w-5 h-5 border-4 border-orange-500 rounded-full"></div>
        </div>

        <p className="text-gray-600 dark:text-gray-300 mt-4 text-lg font-semibold animate-fade-in">
          Brewing your coffee...
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen dark:bg-gray-900 bg-gray-100">
      <Header />
      <main className="flex-grow mt-20 px-6 md:px-16 lg:px-24">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white text-center mb-12">
          About Us
        </h1>
  
        <section className="py-12 bg-white dark:bg-gray-800 rounded-3xl shadow-2xl px-8 md:px-12">
          <div className="flex flex-col md:flex-row items-center justify-center gap-12">
            <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed max-w-2xl">
              At <span className="font-semibold text-orange-600 dark:text-orange-400">CoffeeShopMe</span>, we believe
              that coffee is more than just a beverage—it's a way of life. Established in 2022, we are dedicated to
              serving the finest coffee with authentic flavors. Whether you’re looking for a cozy spot to relax, work, or
              catch up with friends, we are here to make your coffee moments special.
            </p>
            <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed max-w-2xl">
              Our journey began with a passion for great coffee and a dream to
              create a warm, welcoming space for coffee lovers. From the moment
              you step inside, our cozy ambiance and friendly staff will make
              you feel right at home.
            </p>
          </div>
        </section>
  
        <section className="py-16 px-6 md:py-20 bg-gradient-to-r mt-12 from-orange-500 to-yellow-400 dark:from-orange-700 dark:to-yellow-600 rounded-3xl shadow-2xl text-white text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold mb-6 leading-tight">Our Mission</h2>
            <p className="text-lg max-w-3xl mx-auto leading-relaxed">
              We are committed to providing a unique and unforgettable coffee
              experience. By using ethically sourced beans and creating a warm,
              inclusive community, we strive to inspire a deep appreciation for
              coffee culture.
            </p>
          </div>
        </section>
  
        <section className="mt-16">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white text-center mb-10">Our Gallery</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {["gallery1.webp", "gallery2.jpg", "gallery3.jpg", "gallery4.jpg"].map((src, index) => (
              <div
                key={index}
                data-aos={index % 2 === 0 ? "fade-up" : "fade-down"}
                className="rounded-xl overflow-hidden shadow-xl transform hover:scale-105 transition-all duration-300"
              >
                <img src={src} alt={`Gallery ${index + 1}`} className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </section>
  
        <section className="text-center mt-20">
          <h2 className="text-4xl font-extrabold dark:text-white mb-6">Join Our Coffee Community</h2>
          <p className="text-lg max-w-2xl mx-auto dark:text-gray-300 mb-8">
            Follow us on social media and be part of our journey. Share your
            coffee moments using <span className="font-semibold text-orange-500">#CoffeeShopMe</span>
            and connect with fellow coffee lovers.
          </p>
        </section>
      </main>
      <Footer />
    </div>
  );
  
}

export default AboutPage;
