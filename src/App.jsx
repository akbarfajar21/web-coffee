import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MaintenancePage from "./pages/MaintenancePage";
import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import ProductPage from "./pages/ProductPage";
import LoginPage from "./Auth/LoginPage";
import SettingPage from "./pages/SettingPage";
import ContactPage from "./pages/ContactPage";
import CartPage from "./pages/CartPage";
import DetailProduct from "./pages/DetailProduct";
import NotFoundPage from "./pages/NotFoundPage";
import HistoryPage from "./pages/HistoryPage";
import ScrollToTop from "./components/ScrollToTop";
import Register from "./Auth/RegisterPage";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import AOS from "aos";
import "aos/dist/aos.css"; // Pastikan ini diimpor

const App = () => {
  const isMaintenance = false;

  useEffect(() => {
    AOS.init({
      duration: 1000, // Durasi animasi
      easing: "ease-in-out", // Efek easing
    });
  }, []);

  return (
    <Router>
      <ScrollToTop />
      <Routes>
        {isMaintenance ? (
          <Route path="*" element={<MaintenancePage />} />
        ) : (
          <>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/product" element={<ProductPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<Register />} />
            <Route path="/settings" element={<SettingPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/product-detail/:id" element={<DetailProduct />} />
            <Route path="/history" element={<HistoryPage />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/terms-of-service" element={<TermsOfService />} />
            <Route path="*" element={<NotFoundPage />} />
          </>
        )}
      </Routes>
    </Router>
  );
};

export default App;
