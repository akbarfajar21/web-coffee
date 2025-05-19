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

  const handleGoogleLogin = async () => {
    setIsLoading(true);

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/home`,
        },
      });

      if (error) {
        Swal.fire({
          title: "Login Gagal!",
          text: "Terjadi masalah saat login dengan Google.",
          icon: "error",
          confirmButtonText: "OK",
          background: "#1E1E1E",
          color: "#FFF",
          confirmButtonColor: "#F87171",
        });
      }
    } catch (err) {
      console.error("Unhandled error during Google login:", err);
    } finally {
      setIsLoading(false);
    }
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

      <div className="relative max-w-md w-full bg-white/80 backdrop-blur-lg shadow-2xl rounded-2xl p-8">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-4">
          Selamat Datang 👋
        </h2>
        <p className="text-gray-600 text-center mb-6">
          Masuk untuk melanjutkan ke akun Anda!
        </p>

        <form onSubmit={handleEmailLogin} className="space-y-5">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
          />

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Kata Sandi"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-2/4 transform -translate-y-2/4 text-gray-500 hover:text-gray-700"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          <div className="flex justify-center">
            <ReCAPTCHA
              sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}
              onChange={(token) => setRecaptchaToken(token)}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg shadow-lg hover:bg-blue-700 transition-all duration-300"
          >
            Masuk
          </button>
        </form>

        <div className="flex items-center justify-between my-6">
          <hr className="w-full border-gray-300" />
          <span className="text-gray-400 px-4">atau</span>
          <hr className="w-full border-gray-300" />
        </div>

        <button
          onClick={handleGoogleLogin}
          className="w-full bg-indigo-700 text-white font-semibold py-3 px-6 rounded-lg shadow-lg hover:bg-indigo-800 transition-all duration-300 flex items-center justify-center space-x-3"
        >
          <img src="/logo-google.png" alt="Google" className="w-6 h-6" />
          <span>Masuk dengan Google</span>
        </button>

        <p className="text-gray-500 mt-4 text-center">
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
