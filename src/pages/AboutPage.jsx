import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Helmet } from "react-helmet";

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
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-800">
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
          Memuat...
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen dark:bg-gray-800">
      <Helmet>
        <title>CoffeeShopMe | Tentang Kami</title>
      </Helmet>
      <Header />
      <main className="flex-grow mt-16 px-4 md:px-10 lg:px-16">
        <h1 className="text-3xl md:text-4xl mt-5 font-extrabold text-gray-900 dark:text-white text-center mb-10">
          Tentang Kami
        </h1>

        <section className="py-12 bg-white dark:bg-gray-800 rounded-2xl shadow-md px-6 md:px-10">
          <div className="flex flex-col md:flex-row items-center justify-center gap-8">
            <p className="text-gray-700 dark:text-gray-300 text-base leading-relaxed max-w-3xl">
              Di{" "}
              <span className="font-semibold text-orange-600 dark:text-orange-400">
                CoffeeShopMe
              </span>
              , kami percaya bahwa kopi lebih dari sekadar minuman—kopi adalah
              cara hidup. Didirikan pada tahun 2022, kami berdedikasi untuk
              menyajikan kopi terbaik dengan rasa yang autentik. Baik Anda
              sedang mencari tempat nyaman untuk bersantai, bekerja, atau
              bertemu teman, kami ada untuk membuat momen kopi Anda istimewa.
            </p>
            <p className="text-gray-700 dark:text-gray-300 text-base leading-relaxed max-w-3xl mt-4 md:mt-0">
              Perjalanan kami dimulai dengan hasrat untuk kopi yang luar biasa
              dan impian untuk menciptakan tempat yang hangat dan ramah bagi
              para pecinta kopi. Dari saat Anda memasuki kedai kami, suasana
              yang nyaman dan staf yang ramah akan membuat Anda merasa seperti
              di rumah.
            </p>
          </div>
        </section>

        {/* Nilai-Nilai Kami */}
        <section className="py-12 mt-12 bg-gray-50 dark:bg-gray-900 rounded-2xl shadow-md px-6 md:px-10">
          <h2 className="text-3xl font-extrabold text-center text-gray-900 dark:text-white mb-8">
            Nilai-Nilai Kami
          </h2>
          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <h3 className="text-xl font-semibold text-orange-600 dark:text-orange-400 mb-2">
                Kualitas Terbaik
              </h3>
              <p className="text-gray-700 dark:text-gray-300 text-sm">
                Kami hanya menggunakan biji kopi pilihan yang diproses dengan
                cermat untuk menghasilkan rasa kopi yang autentik dan memuaskan.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-orange-600 dark:text-orange-400 mb-2">
                Keberlanjutan
              </h3>
              <p className="text-gray-700 dark:text-gray-300 text-sm">
                Kami mendukung praktik pertanian kopi yang ramah lingkungan dan
                berkontribusi pada kesejahteraan petani lokal.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-orange-600 dark:text-orange-400 mb-2">
                Komunitas
              </h3>
              <p className="text-gray-700 dark:text-gray-300 text-sm">
                Membangun hubungan hangat dan inklusif dengan pelanggan dan
                pecinta kopi melalui berbagai kegiatan komunitas.
              </p>
            </div>
          </div>
        </section>

        {/* Misi Kami */}
        <section className="py-12 px-6 md:py-16 bg-gradient-to-r mt-12 from-orange-500 to-yellow-400 dark:from-orange-700 dark:to-yellow-600 rounded-2xl shadow-md text-white text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-extrabold mb-4 leading-tight">
              Misi Kami
            </h2>
            <p className="text-base max-w-3xl mx-auto leading-relaxed">
              Kami berkomitmen untuk memberikan pengalaman kopi yang unik dan
              tak terlupakan. Dengan menggunakan biji kopi yang bersumber secara
              etis dan menciptakan komunitas yang hangat dan inklusif, kami
              berusaha untuk menginspirasi apresiasi mendalam terhadap budaya
              kopi.
            </p>
          </div>
        </section>

        {/* Timeline Section */}
        <section className="mt-20 px-6">
          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white text-center mb-8">
            Perjalanan Kami
          </h2>
          <div className="relative border-l-4 border-orange-500 dark:border-orange-400 pl-5 max-w-3xl mx-auto">
            {[
              {
                year: "2022",
                desc: "CoffeeShopMe didirikan dengan impian untuk mendefinisikan ulang budaya kopi lokal.",
              },
              {
                year: "2023",
                desc: "Membuka kedai pertama kami dan meluncurkan campuran kopi andalan kami.",
              },
              {
                year: "2024",
                desc: "Membangun kehadiran online yang kuat dan memperluas komunitas kopi kami.",
              },
            ].map((event, index) => (
              <div key={index} className="mb-8">
                <h3 className="text-lg font-semibold text-orange-600 dark:text-orange-400">
                  {event.year}
                </h3>
                <p className="text-gray-700 dark:text-gray-300 text-sm">
                  {event.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Galeri Kami */}
        <section className="mt-14">
          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white text-center mb-8">
            Galeri Kami
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {[
              "gallery1.webp",
              "gallery2.jpg",
              "gallery3.jpg",
              "gallery4.jpg",
            ].map((src, index) => (
              <div
                key={index}
                data-aos={index % 2 === 0 ? "fade-up" : "fade-down"}
                className="rounded-lg overflow-hidden shadow-md transform hover:scale-105 transition duration-300"
              >
                <img
                  src={src}
                  alt={`Galeri ${index + 1}`}
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
            ))}
          </div>
        </section>

        <section className="text-center mt-16 px-6">
          <h2 className="text-3xl font-extrabold dark:text-white mb-5">
            Bergabung dengan Komunitas Kopi Kami
          </h2>
          <p className="text-base max-w-2xl mx-auto dark:text-gray-300 mb-6">
            Ikuti kami di media sosial dan jadilah bagian dari perjalanan kami.
            Bagikan momen kopi Anda menggunakan{" "}
            <span className="font-semibold text-orange-500">#CoffeeShopMe</span>
            dan terhubung dengan sesama pecinta kopi.
          </p>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default AboutPage;
