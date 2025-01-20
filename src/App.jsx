import React from "react";
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

const App = () => {
  const isMaintenance = false;

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
            <Route path="*" element={<NotFoundPage />} />
          </>
        )}
      </Routes>
    </Router>
  );
};

export default App;
