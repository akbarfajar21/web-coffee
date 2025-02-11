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
      <div className="max-w-lg w-full bg-white dark:bg-[#1E1E1E] shadow-xl rounded-2xl p-8 space-y-6 sm:p-10">
        <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white">
          Daftar Akun Baru
        </h2>
        <p className="text-gray-600 dark:text-gray-300 text-center text-sm">
          Buat akun untuk menikmati layanan terbaik kami
        </p>

        {/* Notifikasi Error / Success */}
        {errorMessage && (
          <div className="text-sm text-red-600 bg-red-100 dark:bg-red-900 dark:text-red-300 p-3 rounded-md">
            {errorMessage}
          </div>
        )}
        {successMessage && (
          <div className="text-sm text-green-600 bg-green-100 dark:bg-green-900 dark:text-green-300 p-3 rounded-md">
            {successMessage}
          </div>
        )}

        <form className="space-y-5" onSubmit={handleSubmit}>
          {[
            {
              label: "Nama Lengkap",
              type: "text",
              key: "fullName",
              placeholder: "Masukkan nama lengkap",
            },
            {
              label: "Username",
              type: "text",
              key: "username",
              placeholder: "Pilih username",
            },
            {
              label: "Email",
              type: "email",
              key: "email",
              placeholder: "Masukkan email",
            },
            {
              label: "Nomor Telepon",
              type: "tel",
              key: "noTelepon",
              placeholder: "Masukkan nomor telepon",
            },
            {
              label: "Kata Sandi",
              type: "password",
              key: "password",
              placeholder: "Masukkan kata sandi",
            },
            {
              label: "Konfirmasi Kata Sandi",
              type: "password",
              key: "confirmPassword",
              placeholder: "Masukkan ulang kata sandi",
            },
          ].map((field, index) => (
            <div key={index}>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {field.label}
              </label>
              <input
                type={field.type}
                value={formData[field.key]}
                onChange={(e) =>
                  setFormData({ ...formData, [field.key]: e.target.value })
                }
                required
                className="w-full mt-2 px-4 py-3 border dark:border-gray-600 rounded-xl shadow-sm bg-gray-50 dark:bg-[#2A2A2A] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                placeholder={field.placeholder}
              />
            </div>
          ))}

          {/* Tombol Register */}
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-3 text-white font-semibold rounded-xl shadow-md transition-all ${
              isLoading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-indigo-500 to-purple-600 hover:opacity-90"
            }`}
          >
            {isLoading ? "Mendaftarkan..." : "Buat Akun"}
          </button>
        </form>

        {/* Sudah Punya Akun */}
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Sudah punya akun?{" "}
            <a
              href="/login"
              className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-semibold"
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
