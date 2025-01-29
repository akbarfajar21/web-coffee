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
            });
            return;
          }
          fullName = user.user_metadata.full_name;
        } else {
          fullName = profileData.username;
        }

        Swal.fire({
          title: "Login Berhasil!",
          text: `Selamat datang kembali, ${fullName}!`,
          icon: "success",
          confirmButtonText: "OK",
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

    if (!email || !password) {
      Swal.fire({
        title: "Error!",
        text: "Email dan password wajib diisi.",
        icon: "warning",
        confirmButtonText: "OK",
      });
      return;
    }

    try {
      const { data: user, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        Swal.fire({
          title: "Login Gagal!",
          text: "Email atau password salah.",
          icon: "error",
          confirmButtonText: "OK",
        });
        return;
      }

      if (user) {
        navigate("/");
      }
    } catch (err) {
      console.error("Unhandled Error:", err);
      Swal.fire({
        title: "Error!",
        text: "Terjadi masalah tak terduga.",
        icon: "error",
        confirmButtonText: "OK",
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
      <div className="absolute inset-0 bg-black bg-opacity-40"></div>

      <div className="relative max-w-md w-full bg-black bg-opacity-70 backdrop-filter backdrop-blur-md rounded-2xl overflow-hidden p-8">
        <h2 className="text-4xl font-extrabold text-white text-center mb-6">
          Selamat Datang
        </h2>
        <p className="text-gray-300 text-center mb-6">
          Masuk untuk melanjutkan ke akun Anda!
        </p>
        <form onSubmit={handleEmailLogin} className="space-y-6">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-2 border rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
          />
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 border rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-2/4 transform -translate-y-2/4 text-gray-400 hover:text-white"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:bg-blue-700 transition-all"
          >
            Login dengan Email
          </button>
        </form>
        <div className="flex items-center justify-between my-6">
          <hr className="w-full border-gray-500" />
          <span className="text-gray-300 px-4">atau</span>
          <hr className="w-full border-gray-500" />
        </div>
        <button
          onClick={handleGoogleLogin}
          className="w-full bg-indigo-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:bg-indigo-800 transition-all flex items-center justify-center space-x-3"
        >
          <img src="/logo-google.png" alt="Google" className="w-6 h-6" />
          <span>Login dengan Google</span>
        </button>
        <p className="text-gray-400 mt-4 text-center">
          Belum mempunyai akun?{" "}
          <span
            onClick={() => navigate("/register")}
            className="text-blue-400 cursor-pointer hover:underline"
          >
            Register
          </span>
        </p>
      </div>
    </section>
  );
};

export default Login;
