import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../utils/SupaClient";
import { Helmet } from "react-helmet";

const Register = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
    email: "",
    noTelepon: "",
    password: "",
    confirmPassword: "",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (field) => (e) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (formData.password !== formData.confirmPassword) {
      setErrorMessage("Kata sandi tidak cocok");
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
      });

      if (error) throw new Error(error.message);

      const user = data.user;
      if (!user) throw new Error("Data pengguna tidak diterima dari Supabase");

      const defaultAvatarUrl =
        "https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg";

      const { error: profileError } = await supabase.from("profiles").upsert({
        id: user.id,
        username: formData.username,
        full_name: formData.fullName,
        email: formData.email,
        no_telepon: formData.noTelepon,
        avatar_url: defaultAvatarUrl,
      });

      if (profileError)
        throw new Error("Terjadi kesalahan saat menyimpan profil pengguna.");

      await supabase.auth.signOut();
      setSuccessMessage(
        "Akun berhasil dibuat! Silakan masuk menggunakan akun baru Anda."
      );
      setTimeout(() => navigate("/login"), 1000);
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section
      className="relative flex items-center justify-center min-h-screen bg-cover bg-center p-6"
      style={{
        backgroundImage:
          "url('https://texascoffeeschool.com/wp-content/uploads/2021/10/DSC_0052-scaled.jpg')",
      }}
    >
      <div className="absolute inset-0 bg-black bg-opacity-40"></div>
      <Helmet>
        <title>CoffeeShopMe | Daftar</title>
      </Helmet>
      <div className="max-w-md w-full bg-white/90 dark:bg-[#121212]/90 backdrop-blur-xl shadow-2xl rounded-2xl p-6 sm:p-8 border border-gray-200 dark:border-gray-700">
        <h2 className="text-2xl font-extrabold text-center text-gray-900 dark:text-white">
          Buat Akun Baru
        </h2>
        <p className="text-gray-500 dark:text-gray-400 text-center text-sm mb-4">
          Buat akun untuk menikmati layanan terbaik kami
        </p>

        {errorMessage && (
          <div className="text-sm text-red-600 bg-red-100 dark:bg-red-900 dark:text-red-300 p-3 rounded-xl border border-red-500 shadow-md">
            {errorMessage}
          </div>
        )}
        {successMessage && (
          <div className="text-sm text-green-600 bg-green-100 dark:bg-green-900 dark:text-green-300 p-3 rounded-xl border border-green-500 shadow-md">
            {successMessage}
          </div>
        )}

        <form className="space-y-4 mt-4" onSubmit={handleSubmit}>
          {/* Semua input form tetap sama */}
          {/* Nama Lengkap */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Nama Lengkap
            </label>
            <input
              type="text"
              value={formData.fullName}
              onChange={handleChange("fullName")}
              className="w-full px-4 py-2 border rounded-xl bg-gray-50 dark:bg-[#1E1E1E] text-gray-900 dark:text-white text-sm"
              placeholder="Masukkan nama lengkap Anda"
              required
            />
          </div>

          {/* Username */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Nama Pengguna
            </label>
            <input
              type="text"
              value={formData.username}
              onChange={handleChange("username")}
              className="w-full px-4 py-2 border rounded-xl bg-gray-50 dark:bg-[#1E1E1E] text-gray-900 dark:text-white text-sm"
              placeholder="Masukkan nama pengguna"
              required
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Email
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={handleChange("email")}
              className="w-full px-4 py-2 border rounded-xl bg-gray-50 dark:bg-[#1E1E1E] text-gray-900 dark:text-white text-sm"
              placeholder="Masukkan email Anda"
              required
            />
          </div>

          {/* Nomor Telepon */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Nomor Telepon
            </label>
            <input
              type="tel"
              value={formData.noTelepon}
              onChange={handleChange("noTelepon")}
              className="w-full px-4 py-2 border rounded-xl bg-gray-50 dark:bg-[#1E1E1E] text-gray-900 dark:text-white text-sm"
              placeholder="Masukkan nomor telepon"
              required
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Kata Sandi
            </label>
            <input
              type="password"
              value={formData.password}
              onChange={handleChange("password")}
              className="w-full px-4 py-2 border rounded-xl bg-gray-50 dark:bg-[#1E1E1E] text-gray-900 dark:text-white text-sm"
              placeholder="Masukkan kata sandi"
              required
            />
          </div>

          {/* Konfirmasi Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Konfirmasi Kata Sandi
            </label>
            <input
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange("confirmPassword")}
              className="w-full px-4 py-2 border rounded-xl bg-gray-50 dark:bg-[#1E1E1E] text-gray-900 dark:text-white text-sm"
              placeholder="Konfirmasi kata sandi"
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-3 text-white text-sm font-semibold rounded-xl transition-all ${
              isLoading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-indigo-500 to-purple-600 hover:opacity-85"
            }`}
          >
            {isLoading ? "Mendaftarkan..." : "Buat Akun"}
          </button>
        </form>

        <div className="mt-4 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Sudah punya akun?{" "}
            <a
              href="/login"
              className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 font-semibold"
            >
              Masuk Sekarang
            </a>
          </p>
        </div>
      </div>
    </section>
  );
};

export default Register;
