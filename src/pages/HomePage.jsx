import React from "react";
import Header from "../components/Header";
import Hero from "../components/Home/Hero";
import TentangKami from "../components/Home/TentangKami";
import Testimoni from "../components/Home/Testimoni";
import FAQ from "../components/Home/Faq";
import Footer from "../components/Footer";
import Statistik from "../components/Home/Statistik";
import { Helmet } from "react-helmet";
import Carousel from "../components/Home/Carousel";

const HomePage = () => {
  return (
    <>
      <Helmet>
        <title>CoffeeShopMe | Home</title>
      </Helmet>
      <Header />
      <Hero />
      <TentangKami />
      <Carousel />
      <Testimoni />
      <Statistik />
      <FAQ />
      <Footer />
    </>
  );
};

export default HomePage;
