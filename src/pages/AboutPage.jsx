import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { FaCheckCircle, FaGlobe, FaUsers } from "react-icons/fa";

const AboutPage = () => {
  return (
    <>
      <Header />

      <section className="py-20 bg-gray-50 dark:bg-gray-800 dark:text-gray-100">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div data-aos="fade-right">
            <h2 className="text-4xl font-extrabold text-amber-500 mb-6 dark:text-amber-400">
              Siapa Kami
            </h2>
            <p className="text-gray-600 leading-relaxed mb-6 text-lg md:text-xl dark:text-gray-400">
              Website kami berkomitmen untuk memberikan pengalaman kopi terbaik.
              Mulai dari pemilihan biji kopi berkualitas hingga menciptakan
              campuran yang sempurna, kami bersemangat untuk memberikan
              kebahagiaan di setiap cangkir.
            </p>
            <p className="text-gray-600 leading-relaxed text-lg md:text-xl dark:text-gray-400">
              Perjalanan kami dimulai dengan visi untuk berbagi cinta terhadap
              kopi dengan dunia, menciptakan ruang di mana para pecinta kopi
              bisa terhubung, belajar, dan menikmati momen bersama.
            </p>
          </div>
          <div data-aos="fade-left">
            <img
              src="https://www.impulsecoffees.com/cdn/shop/articles/health_benefits_of_drinking_coffee_on_a_empty_stomach.jpg?crop=center&height=1200&v=1720594811&width=1200"
              alt="Kopi"
              className="rounded-lg shadow-lg w-full h-auto object-cover hover:scale-105 transition-transform duration-500"
            />
          </div>
        </div>
      </section>

      <div className="relative w-full bg-gradient-to-r from-gray-100 via-white to-gray-100 h-16 -skew-y-2 dark:bg-gradient-to-r dark:from-gray-900 dark:via-gray-800 dark:to-gray-900"></div>

      <section className="py-20 bg-gradient-to-b from-gray-50 to-white dark:bg-gradient-to-b dark:from-gray-800 dark:to-gray-900">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-extrabold mb-6 text-amber-500 dark:text-amber-400">Misi Kami</h2>
          <p className="text-gray-600 leading-relaxed max-w-3xl mx-auto text-lg md:text-xl dark:text-gray-400">
            Untuk menginspirasi dan menghubungkan orang-orang melalui cinta
            terhadap kopi. Kami berusaha memberikan kualitas terbaik dan
            pengalaman yang unik, sambil membangun komunitas pecinta kopi yang
            berbagi semangat kami untuk kesempurnaan.
          </p>
        </div>
      </section>

      <div className="relative w-full bg-gradient-to-r from-white to-gray-50 h-16 skew-y-2 dark:bg-gradient-to-r dark:from-gray-900 dark:to-gray-800"></div>

      <section className="py-20 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-12 text-center">
          <div data-aos="zoom-in" className="group">
            <FaCheckCircle className="w-16 h-16 mx-auto text-amber-500 mb-6 group-hover:scale-110 transition-transform duration-300 dark:text-amber-400" />
            <h3 className="text-2xl font-bold text-gray-800 mb-4 dark:text-gray-100">
              Kualitas Tinggi
            </h3>
            <p className="text-gray-600 leading-relaxed text-sm sm:text-base md:text-lg dark:text-gray-400">
              Kami hanya menggunakan bahan terbaik untuk memastikan setiap
              cangkir sempurna.
            </p>
          </div>
          <div data-aos="zoom-in" data-aos-delay="100" className="group">
            <FaGlobe className="w-16 h-16 mx-auto text-amber-500 mb-6 group-hover:scale-110 transition-transform duration-300 dark:text-amber-400" />
            <h3 className="text-2xl font-bold text-gray-800 mb-4 dark:text-gray-100">
              Keberlanjutan
            </h3>
            <p className="text-gray-600 leading-relaxed text-sm sm:text-base md:text-lg dark:text-gray-400">
              Komitmen kami terhadap lingkungan mendorong kami untuk memilih
              sumber yang bertanggung jawab.
            </p>
          </div>
          <div data-aos="zoom-in" data-aos-delay="200" className="group">
            <FaUsers className="w-16 h-16 mx-auto text-amber-500 mb-6 group-hover:scale-110 transition-transform duration-300 dark:text-amber-400" />
            <h3 className="text-2xl font-bold text-gray-800 mb-4 dark:text-gray-100">Komunitas</h3>
            <p className="text-gray-600 leading-relaxed text-sm sm:text-base md:text-lg dark:text-gray-400">
              Membangun komunitas pecinta kopi adalah inti dari apa yang kami
              lakukan.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
};

export default AboutPage;
