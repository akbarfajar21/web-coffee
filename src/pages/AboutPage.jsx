import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";

function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen  dark:bg-gray-900">
      <Header />
      <main className="flex-grow mt-10 px-6 md:px-20">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 mt-10 dark:text-white text-center">
          About Us
        </h1>
        <section className="about py-12 rounded-lg  ">
          <div className="flex flex-col md:flex-row items-center justify-center gap-8">
            <p className="text-gray-700 dark:text-gray-300 text-base md:text-lg leading-relaxed max-w-2xl">
              Di Coffee Shop Me, kami percaya bahwa kopi lebih dari sekadar
              minuman—ini adalah cara hidup. Sejak didirikan pada tahun 2022,
              kami berkomitmen untuk menyajikan secangkir kopi terbaik dengan
              cita rasa yang otentik dan mengesankan. Tempat ini adalah ruang
              untuk bersantai, menikmati kopi sambil menciptakan kenangan
              bersama teman-teman, atau bekerja dengan suasana yang mendukung
              produktivitas.
            </p>
          </div>
        </section>

        <section className="gallery ">
          <h2 className="text-3xl md:text-4xl font-semibold text-gray-800 dark:text-gray-100 mb-6 text-center">
            Galeri Kami
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <img
              src="gallery1.webp"
              alt="Interior"
              className="rounded-lg shadow-md"
            />
            <img
              src="gallery2.jpg"
              alt="Acara Kopi"
              className="rounded-lg shadow-md"
            />
            <img
              src="gallery3.jpg"
              alt="Menu Kopi"
              className="rounded-lg shadow-md"
            />
            <img
              src="gallery4.jpg"
              alt="Barista"
              className="rounded-lg shadow-md"
            />
          </div>
        </section>

        <section className="cta text-center mt-20">
          <h2 className="text-3xl md:text-4xl font-extrabold dark:text-white mb-6">
            Bergabunglah dengan Komunitas Kopi Kami
          </h2>
          <p className="text-base md:text-lg mb-8 max-w-2xl dark:text-white mx-auto">
            Ikuti kami di media sosial dan jadilah bagian dari perjalanan kami.
            Bagikan momen kopi Anda dengan menggunakan #CoffeeShopMe dan temui
            teman-teman baru yang memiliki kecintaan yang sama terhadap kopi.
          </p>
        </section>
      </main>
      <Footer />
    </div>
  );
}

export default AboutPage;
