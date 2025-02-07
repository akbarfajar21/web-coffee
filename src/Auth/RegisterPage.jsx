import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../utils/SupaClient";

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (formData.password !== formData.confirmPassword) {
      setErrorMessage("Passwords do not match");
      return;
    }

    setIsLoading(true);
    try {
      // Step 1: Sign up user
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
      });

      if (error) {
        throw new Error(error.message);
      }
      const user = data.user;

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

      if (profileError) {
        throw new Error("Error saving user profile.");
      }

      setSuccessMessage(
        "Success! Your account has been successfully registered. We'll redirect you to the login page shortly."
      );

      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="flex items-center justify-center min-h-screen bg-gradient-to-br from-teal-400 via-blue-500 to-purple-600 px-4 sm:px-6 lg:px-8">
      <div className="max-w-lg w-full bg-white shadow-2xl rounded-2xl p-8 space-y-6 sm:p-10">
        <h2 className="text-3xl font-bold text-center text-gray-900">
          Daftar Akun Baru
        </h2>
        <p className="text-gray-600 text-center text-sm">
          Buat akun untuk menikmati layanan terbaik kami
        </p>

        {errorMessage && (
          <div className="text-sm text-red-600 bg-red-100 p-3 rounded-md">
            {errorMessage}
          </div>
        )}
        {successMessage && (
          <div className="text-sm text-green-600 bg-green-100 p-3 rounded-md">
            {successMessage}
          </div>
        )}

        <form className="space-y-5" onSubmit={handleSubmit}>
          {/* Input Full Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Nama Lengkap
            </label>
            <input
              type="text"
              value={formData.fullName}
              onChange={(e) =>
                setFormData({ ...formData, fullName: e.target.value })
              }
              required
              className="w-full mt-2 px-4 py-3 border rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              placeholder="Masukkan nama lengkap"
            />
          </div>

          {/* Input Username */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Username
            </label>
            <input
              type="text"
              value={formData.username}
              onChange={(e) =>
                setFormData({ ...formData, username: e.target.value })
              }
              required
              className="w-full mt-2 px-4 py-3 border rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              placeholder="Pilih username"
            />
          </div>

          {/* Input Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              required
              className="w-full mt-2 px-4 py-3 border rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              placeholder="Masukkan email"
            />
          </div>

          {/* Input No Telepon */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Nomor Telepon
            </label>
            <input
              type="tel"
              value={formData.noTelepon}
              onChange={(e) =>
                setFormData({ ...formData, noTelepon: e.target.value })
              }
              required
              className="w-full mt-2 px-4 py-3 border rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              placeholder="Masukkan nomor telepon"
            />
          </div>

          {/* Input Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Kata Sandi
            </label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              required
              className="w-full mt-2 px-4 py-3 border rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              placeholder="Masukkan kata sandi"
            />
          </div>

          {/* Input Konfirmasi Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Konfirmasi Kata Sandi
            </label>
            <input
              type="password"
              value={formData.confirmPassword}
              onChange={(e) =>
                setFormData({ ...formData, confirmPassword: e.target.value })
              }
              required
              className="w-full mt-2 px-4 py-3 border rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              placeholder="Masukkan ulang kata sandi"
            />
          </div>

          {/* Tombol Register */}
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-3 text-white font-semibold rounded-xl shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all ${
              isLoading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-700"
            }`}
          >
            {isLoading ? "Mendaftarkan..." : "Buat Akun"}
          </button>
        </form>

        {/* Sudah Punya Akun */}
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">
            Sudah punya akun?{" "}
            <a
              href="/login"
              className="text-indigo-600 hover:text-indigo-700 font-semibold"
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
