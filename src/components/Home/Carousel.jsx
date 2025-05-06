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
    <div className="w-full max-w-7xl mx-auto mt-12 relative rounded-2xl overflow-hidden shadow-xl group">
      <img
        src={slides[currentIndex].image}
        alt={slides[currentIndex].title}
        className="w-full h-[400px] md:h-[400px] object-cover transition-all duration-1000 ease-in-out"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent text-white flex flex-col justify-end p-6 md:p-10">
        <h2 className="text-2xl md:text-4xl font-bold mb-2">
          {slides[currentIndex].title}
        </h2>
        <p className="text-sm md:text-lg">{slides[currentIndex].description}</p>
      </div>

      {/* Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/70 text-white p-2 rounded-full transition-all hidden group-hover:flex"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/70 text-white p-2 rounded-full transition-all hidden group-hover:flex"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Dots */}
      <div className="absolute bottom-4 w-full flex justify-center gap-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-3 h-3 rounded-full transition-all ${
              currentIndex === index ? "bg-white scale-110" : "bg-white/40"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default Carousel;
