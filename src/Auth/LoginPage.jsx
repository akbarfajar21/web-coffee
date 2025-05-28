import React, { useEffect, useState } from "react";
import { supabase } from "../utils/SupaClient";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import ReCAPTCHA from "react-google-recaptcha";
import { Helmet } from "react-helmet";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [recaptchaToken, setRecaptchaToken] = useState(null);

  useEffect(() => {
    // Cek sesi login setelah halaman reload
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session) {
        navigate("/home");
      }
    };

    checkSession();

    // Listener untuk menangkap event login
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === "SIGNED_IN" && session) {
          navigate("/home");
        }
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [navigate]);

  // const handleGoogleLogin = async () => {
  //   setIsLoading(true);

  //   if (!recaptchaToken) {
  //     setIsLoading(false);
  //     Swal.fire({
  //       title: "Verifikasi Gagal",
  //       text: "Silakan selesaikan reCAPTCHA terlebih dahulu.",
  //       icon: "warning",
  //       iconColor: "#F59E0B",
  //       confirmButtonText: "OK",
  //       confirmButtonColor: "#F59E0B",
  //       background: "#FFFFFF",
  //       color: "#1F2937",
  //       customClass: {
  //         popup: "rounded-xl shadow-lg",
  //         title: "text-lg font-semibold",
  //         confirmButton: "px-6 py-2",
  //       },
  //     });
  //     return;
  //   }

  //   try {
  //     const { error } = await supabase.auth.signInWithOAuth({
  //       provider: "google",
  //       options: {
  //         redirectTo: `${window.location.origin}/home`,
  //       },
  //     });

  //     if (error) {
  //       Swal.fire({
  //         title: "Login Gagal!",
  //         text: "Terjadi masalah saat login dengan Google.",
  //         icon: "error",
  //         confirmButtonText: "OK",
  //         background: "#1E1E1E",
  //         color: "#FFF",
  //         confirmButtonColor: "#F87171",
  //       });
  //     }
  //   } catch (err) {
  //     console.error("Unhandled error during Google login:", err);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  const handleGoogleLogin = async () => {
    Swal.fire({
      title: "Fitur Sedang Dalam Perbaikan",
      text: "Maaf, saat ini login dengan Google sedang tidak tersedia. Silakan login menggunakan email dan password.",
      icon: "info",
      confirmButtonText: "OK",
      confirmButtonColor: "#3B82F6",
      background: "#F9FAFB",
      color: "#1F2937",
      width: "400px",
      customClass: {
        popup: "rounded-xl shadow-lg",
        title: "text-lg font-semibold",
        confirmButton: "px-6 py-2 font-medium",
      },
    });
  };

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (!recaptchaToken) {
      setIsLoading(false);
      Swal.fire({
        title: "Verifikasi Gagal",
        text: "Silakan selesaikan reCAPTCHA terlebih dahulu.",
        icon: "warning",
        iconColor: "#F59E0B",
        confirmButtonText: "OK",
        confirmButtonColor: "#F59E0B",
        background: "#FFFFFF",
        color: "#1F2937",
        customClass: {
          popup: "rounded-xl shadow-lg",
          title: "text-lg font-semibold",
          confirmButton: "px-6 py-2",
        },
      });
      return;
    }

    if (!email || !password) {
      setIsLoading(false);
      Swal.fire({
        title: "Oops!",
        text: "Email dan password wajib diisi.",
        icon: "warning",
        confirmButtonText: "OK",
        background: "#fef3c7",
        color: "#92400e",
        confirmButtonColor: "#F59E0B",
        buttonsStyling: true,
        customClass: {
          popup: "rounded-lg shadow-lg",
          confirmButton: "px-6 py-2 font-semibold text-white text-lg",
        },
        showClass: {
          popup: "swal2-show swal2-animate-popup",
        },
        hideClass: {
          popup: "swal2-hide swal2-animate-popup",
        },
      });

      return;
    }

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        Swal.fire({
          title: "Login Gagal!",
          text: "Email atau password salah.",
          icon: "error",
          confirmButtonText: "Coba Lagi",
          background: "#f9fafb",
          color: "#1f2937",
          confirmButtonColor: "#ef4444",
          buttonsStyling: true,
          customClass: {
            popup: "rounded-lg shadow-lg",
            confirmButton: "px-6 py-2 text-white font-semibold text-lg",
          },
          showClass: {
            popup: "swal2-show swal2-animate-popup",
          },
          hideClass: {
            popup: "swal2-hide swal2-animate-popup",
          },
        });
      } else {
        navigate("/home");
      }
    } catch (err) {
      Swal.fire({
        title: "Oops, Terjadi Kesalahan!",
        text: "Terjadi masalah tak terduga. Silakan coba lagi nanti.",
        icon: "warning",
        confirmButtonText: "OK",
        background: "#f3f4f6",
        color: "#1e293b",
        confirmButtonColor: "#4F46E5",
        buttonsStyling: true,
        customClass: {
          popup: "rounded-lg shadow-xl",
          confirmButton: "px-6 py-2 text-white font-semibold text-lg",
        },
        showClass: {
          popup: "swal2-show swal2-animate-popup",
        },
        hideClass: {
          popup: "swal2-hide swal2-animate-popup",
        },
      });
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
      {/* Overlay Transparan */}
      <div className="absolute inset-0 bg-black bg-opacity-40"></div>
      <Helmet>
        <title>CoffeeShopMe | Masuk</title>
      </Helmet>

      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex flex-col items-center justify-center z-50">
          <div className="relative flex items-center justify-center">
            <div className="absolute -top-6 flex space-x-2">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className={`w-2 h-${
                    6 + i
                  } bg-gray-400 opacity-50 rounded-full animate-steam`}
                  style={{ animationDelay: `${i * 0.2}s` }}
                ></div>
              ))}
            </div>
            <div className="relative bg-gradient-to-r from-orange-500 to-yellow-400 w-16 h-12 rounded-t-full flex items-end justify-center shadow-lg">
              <div className="absolute bottom-0 w-14 h-10 bg-white dark:bg-gray-800 rounded-t-full"></div>
            </div>
            <div className="absolute right-[-12px] top-[6px] w-6 h-6 border-4 border-orange-500 rounded-full"></div>
          </div>
          <p className="text-white mt-4 text-lg font-semibold">Memuat...</p>
          <style>
            {`
          @keyframes steam {
            0% { transform: translateY(0) scale(1); opacity: 1; }
            50% { opacity: 0.7; }
            100% { transform: translateY(-20px) scale(1.2); opacity: 0; }
          }

          .animate-steam {
            animation: steam 2s infinite ease-in-out;
          }
        `}
          </style>
        </div>
      )}

      <div className="relative max-w-sm w-full bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl shadow-2xl rounded-3xl p-6 transition-all">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-3">
          Selamat Datang
        </h2>
        <p className="text-sm text-black dark:text-gray-300 text-center mb-6">
          Masuk untuk melanjutkan ke akun Anda
        </p>

        <form onSubmit={handleEmailLogin} className="space-y-5">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm"
          />

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Kata Sandi"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-white transition"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-4 rounded-lg shadow-md transition-all text-sm"
          >
            Masuk
          </button>
        </form>

        <div className="flex items-center justify-between my-5">
          <hr className="w-full border-gray-300 dark:border-gray-600" />
          <span className="text-xs text-black dark:text-white px-3">atau</span>
          <hr className="w-full border-gray-300 dark:border-gray-600" />
        </div>

        <button
          onClick={handleGoogleLogin}
          className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-100 font-semibold py-2.5 px-4 rounded-lg shadow-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-all flex items-center justify-center space-x-2 text-sm"
        >
          <img src="/logo-google.png" alt="Google" className="w-5 h-5" />
          <span>Masuk dengan Google</span>
        </button>

        <div className="flex justify-center mt-5">
          <ReCAPTCHA
            sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}
            onChange={(token) => setRecaptchaToken(token)}
          />
        </div>

        <p className="text-sm text-gray-600 dark:text-gray-400 mt-5 text-center">
          Belum punya akun?{" "}
          <span
            onClick={() => navigate("/register")}
            className="text-blue-500 font-semibold cursor-pointer hover:underline"
          >
            Daftar sekarang
          </span>
        </p>
      </div>
    </section>
  );
};

export default Login;
