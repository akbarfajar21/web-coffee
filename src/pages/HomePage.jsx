import React from "react";
import Header from "../components/Header";
import Hero from "../components/Home/Hero";
import Product from "../components/Home/Product";
import TentangKami from "../components/Home/TentangKami";
import Testimoni from "../components/Home/Testimoni";
import Footer from "../components/Footer";
import LiveChat from "../components/LiveChat"; // Import LiveChat

const HomePage = () => {
  return (
    <>
      <Header />
      <Hero />
      <TentangKami />
      <Product />
      <Testimoni />
      <LiveChat /> {/* Tambahkan LiveChat di sini */}
      <Footer />
    </>
  );
};

export default HomePage;
