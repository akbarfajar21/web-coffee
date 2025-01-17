import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MaintenancePage from "./pages/MaintenancePage"; // Import halaman maintenance
import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import ProductPage from "./pages/ProductPage";
import LoginPage from "./Auth/LoginPage";
import SettingPage from "./pages/SettingPage";
import ContactPage from "./pages/ContactPage";
import CartPage from "./components/CartPage";
import DetailProduct from "./pages/DetailProduct";
import NotFoundPage from "./pages/NotFoundPage";
import PaymentSuccess from "./pages/PaymentSuccess";
import HistoryPage from "./pages/HistoryPage";

const App = () => {
  const isMaintenance = true; // Ubah menjadi `false` saat pemeliharaan selesai

  return (
    <Router>
      <Routes>
        {/* Jika maintenance aktif, arahkan ke halaman MaintenancePage */}
        {isMaintenance ? (
          <Route path="*" element={<MaintenancePage />} />
        ) : (
          <>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/product" element={<ProductPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/settings" element={<SettingPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/product-detail/:id" element={<DetailProduct />} />
            <Route path="/payment-success" element={<PaymentSuccess />} />
            <Route path="/history" element={<HistoryPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </>
        )}
      </Routes>
    </Router>
  );
};

export default App;
