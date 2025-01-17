import React from "react";
import Header from "../components/Header";
import Hero from "../components/Home/Hero";
import TentangKami from "../components/Home/TentangKami";
import Testimoni from "../components/Home/Testimoni";
import Footer from "../components/Footer";
import LiveChat from "../components/LiveChat";
import FAQ from "../components/FAQ/Faq";

const HomePage = () => {
  return (
    <>
      <Header />
      <Hero />
      <TentangKami />
      <Testimoni />
      <FAQ />
      <LiveChat />
      <Footer />
    </>
  );
};

export default HomePage;
