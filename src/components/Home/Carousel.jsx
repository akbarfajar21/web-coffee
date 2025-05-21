// Carousel.jsx
import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const slides = [
  {
    image:
      "https://images.pexels.com/photos/374885/pexels-photo-374885.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    title: "Rasakan Aroma Kopi Asli",
    description: "Kopi pilihan terbaik untuk memulai harimu.",
  },
  {
    image:
      "https://images.pexels.com/photos/27524208/pexels-photo-27524208/free-photo-of-a-cup-of-coffee-with-a-latte-art-on-it.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load",
    title: "Nyaman untuk Nongkrong",
    description: "Suasana hangat untuk belajar dan diskusi santai.",
  },
  {
    image:
      "https://images.pexels.com/photos/27902286/pexels-photo-27902286/free-photo-of-person-pouring-coffee.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load",
    title: "Promo Spesial Minggu Ini",
    description: "Diskon hingga 30% untuk menu favorit kamu!",
  },
];

const Carousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  useEffect(() => {
    const interval = setInterval(nextSlide, 2000);
    return () => clearInterval(interval);
  }, [currentIndex]);

  return (
    <div className="dark:bg-gray-900 bg-gray-50 py-6 px-3">
      <div className="relative w-full max-w-5xl mx-auto rounded-2xl overflow-hidden shadow-xl group transition-shadow duration-500">
        {/* Gambar slider */}
        <img
          src={slides[currentIndex].image}
          alt={slides[currentIndex].title}
          className="w-full h-[250px] md:h-[350px] object-cover transition-all duration-1000 ease-in-out scale-100 group-hover:scale-105"
        />

        {/* Overlay gradasi & konten */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent text-white flex flex-col justify-end px-5 md:px-10 py-6 backdrop-blur-sm">
          <h2 className="text-xl md:text-3xl font-bold drop-shadow-lg mb-2">
            {slides[currentIndex].title}
          </h2>
          <p className="text-sm md:text-base text-gray-200 max-w-xl drop-shadow-sm">
            {slides[currentIndex].description}
          </p>
        </div>

        {/* Panah Kiri */}
        <button
          onClick={prevSlide}
          className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white backdrop-blur-md p-2.5 rounded-full shadow-md transition-all duration-300"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {/* Panah Kanan */}
        <button
          onClick={nextSlide}
          className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white backdrop-blur-md p-2.5 rounded-full shadow-md transition-all duration-300"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Dots */}
        <div className="absolute bottom-4 w-full flex justify-center items-center gap-2.5">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-3.5 h-3.5 rounded-full border transition-all duration-300 ${
                currentIndex === index
                  ? "bg-white border-white scale-110 shadow"
                  : "bg-transparent border-white/40 hover:border-white"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Carousel;
