import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
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
import WelcomeModal from "./components/WelcomeModal";
import AOS from "aos";
import "aos/dist/aos.css";

const App = () => {
  const isMaintenance = false;
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);

  useEffect(() => {
    const hasSeenAlert = sessionStorage.getItem("hasSeenWelcomeAlert");

    if (!hasSeenAlert) {
      setShowWelcomeModal(true);
      sessionStorage.setItem("hasSeenWelcomeAlert", "true");
    }

    AOS.init({
      duration: 1000,
      easing: "ease-in-out",
    });
  }, []);

  return (
    <Router>
      <ScrollToTop />

      {showWelcomeModal && (
        <WelcomeModal onClose={() => setShowWelcomeModal(false)} />
      )}

      <Routes>
        {isMaintenance ? (
          <Route path="*" element={<MaintenancePage />} />
        ) : (
          <>
            <Route path="/" element={<Navigate to="/home" replace />} />

            <Route path="/home" element={<HomePage />} />
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
