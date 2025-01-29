import React from "react";
import Header from "../components/Header";
import Hero from "../components/Home/Hero";
import TentangKami from "../components/Home/TentangKami";
import Testimoni from "../components/Home/Testimoni";
import LiveChat from "../components/LiveChat";
import FAQ from "../components/Home/Faq";
import Footer from "../components/Footer";
import Statistik from "../components/Home/Statistik"; // Import komponen Statistik

const HomePage = () => {
  return (
    <>
      <Header />
      <Hero />
      <TentangKami />
      <Testimoni />
      <Statistik />
      <FAQ />
      <LiveChat />
      <Footer />
    </>
  );
};

export default HomePage;
