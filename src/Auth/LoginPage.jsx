import React, { useState } from "react";
import { supabase } from "../utils/SupaClient";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleLogin = async () => {
    try {
      const { user, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
      });

      if (error) {
        Swal.fire({
          title: "Login Gagal!",
          text: "Terjadi masalah saat login dengan Google.",
          icon: "error",
          confirmButtonText: "OK",
          background: "#1E1E1E",
          color: "#FFF",
          showClass: {
            popup: "animate__animated animate__fadeInDown",
          },
          hideClass: {
            popup: "animate__animated animate__fadeOutUp",
          },
          confirmButtonColor: "#F87171",
        });
        return;
      }

      if (user) {
        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("id, username, email, role")
          .eq("id", user.id)
          .single();

        let fullName;

        if (profileError || !profileData) {
          const { error: insertError } = await supabase
            .from("profiles")
            .upsert({
              id: user.id,
              username: user.user_metadata.full_name,
              avatar_url: user.user_metadata.picture,
              email: user.user_metadata.email,
              role: "user",
            });

          if (insertError) {
            Swal.fire({
              title: "Error",
              text: "Gagal menyimpan profil pengguna.",
              icon: "error",
              confirmButtonText: "OK",
              background: "#1E1E1E",
              color: "#FFF",
              confirmButtonColor: "#F87171",
            });
            return;
          }
          fullName = user.user_metadata.full_name;
        } else {
          fullName = profileData.username;
        }

        Swal.fire({
          title: "Login Berhasil! 🎉",
          text: `Selamat datang kembali, ${fullName}!`,
          iconHtml: "✅",
          confirmButtonText: "OK",
          background: "rgba(30, 30, 30, 0.9)",
          color: "#FFF",
          showClass: {
            popup: "animate__animated animate__fadeInUp animate__faster",
          },
          hideClass: {
            popup: "animate__animated animate__fadeOutDown animate__faster",
          },
          confirmButtonColor: "#4CAF50",
          customClass: {
            popup: "rounded-xl shadow-2xl backdrop-blur-md",
            confirmButton: "px-6 py-2 rounded-lg text-lg",
          },
        }).then(() => {
          navigate("/");
        });
      }
    } catch (err) {
      console.error("Unhandled error during Google login:", err);
    }
  };

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (!email || !password) {
      setIsLoading(false);
      Swal.fire({
        title: "⚠️ Oops!",
        text: "Email dan password wajib diisi.",
        iconHtml: "⚠️",
        confirmButtonText: "OK",
        background: "#FFFFFF",
        color: "#333",
        confirmButtonColor: "#F59E0B",
        showClass: {
          popup: "animate__animated animate__fadeInDown animate__faster",
        },
        hideClass: {
          popup: "animate__animated animate__fadeOutUp animate__faster",
        },
        customClass: {
          popup: "rounded-lg shadow-xl backdrop-blur-sm border border-gray-200",
          confirmButton: "px-6 py-2 rounded-lg text-lg",
        },
      });
      return;
    }

    try {
      const { data: user, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      setIsLoading(false);

      if (error) {
        Swal.fire({
          title: "❌ Login Gagal!",
          text: "Email atau password salah.",
          iconHtml: "❌",
          confirmButtonText: "Coba Lagi",
          background: "#FFFFFF",
          color: "#333",
          confirmButtonColor: "#EF4444",
          showClass: {
            popup: "animate__animated animate__shakeX",
          },
          customClass: {
            popup:
              "rounded-lg shadow-2xl backdrop-blur-sm border border-gray-200",
            confirmButton: "px-6 py-2 rounded-lg text-lg",
          },
        });
        return;
      }

      if (user) {
        navigate("/"); // Langsung redirect ke dashboard tanpa SweetAlert
      }
    } catch (err) {
      setIsLoading(false);
      Swal.fire({
        title: "⚠️ Oops, Terjadi Kesalahan!",
        text: "Terjadi masalah tak terduga. Silakan coba lagi nanti.",
        iconHtml: "❗",
        confirmButtonText: "OK",
        background: "#FFFFFF",
        color: "#333",
        confirmButtonColor: "#4F46E5",
        showClass: {
          popup: "animate__animated animate__fadeIn animate__faster",
        },
        hideClass: {
          popup: "animate__animated animate__fadeOut animate__faster",
        },
        customClass: {
          popup: "rounded-xl shadow-lg backdrop-blur-sm border border-gray-200",
          confirmButton: "px-6 py-2 rounded-lg text-lg font-semibold",
        },
      });
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

      {/* Loader */}
      {isLoading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="loader border-t-4 border-white w-16 h-16 rounded-full animate-spin"></div>
        </div>
      )}

      {/* Card Form */}
      <div className="relative max-w-md w-full bg-white/80 backdrop-blur-lg shadow-2xl rounded-2xl p-8">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-4">
          Selamat Datang 👋
        </h2>
        <p className="text-gray-600 text-center mb-6">
          Masuk untuk melanjutkan ke akun Anda!
        </p>

        {/* Form Login */}
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
              placeholder="Password"
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

          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg shadow-lg hover:bg-blue-700 transition-all duration-300"
          >
            Login dengan Email
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center justify-between my-6">
          <hr className="w-full border-gray-300" />
          <span className="text-gray-400 px-4">atau</span>
          <hr className="w-full border-gray-300" />
        </div>

        {/* Login Google */}
        <button
          onClick={handleGoogleLogin}
          className="w-full bg-indigo-700 text-white font-semibold py-3 px-6 rounded-lg shadow-lg hover:bg-indigo-800 transition-all duration-300 flex items-center justify-center space-x-3"
        >
          <img src="/logo-google.png" alt="Google" className="w-6 h-6" />
          <span>Login dengan Google</span>
        </button>

        {/* Register Link */}
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
