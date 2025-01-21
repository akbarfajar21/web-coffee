import React, { useState } from "react";
import { supabase } from "../utils/SupaClient";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

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
    console.log("Proses login dimulai");

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
        Swal.fire({
          title: "Login Berhasil!",
          text: "Selamat datang kembali!",
          icon: "success",
          confirmButtonText: "OK",
        }).then(() => {
          navigate("/");
        });
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
    <section className="flex items-center justify-center min-h-screen bg-gradient-to-tr from-indigo-700 via-blue-500 to-blue-600 p-6">
      <div className="max-w-md w-full bg-white shadow-xl rounded-2xl overflow-hidden p-8">
        <h2 className="text-4xl font-extrabold text-gray-800 text-center mb-6">
          Selamat Datang
        </h2>
        <p className="text-gray-600 text-center mb-6">
          Masuk untuk melanjutkan ke akun Anda!
        </p>
        <form onSubmit={handleEmailLogin} className="space-y-6">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:bg-blue-700 transition-all"
          >
            Login dengan Email
          </button>
        </form>
        <div className="flex items-center justify-between my-6">
          <hr className="w-full border-gray-300" />
          <span className="text-gray-500 px-4">atau</span>
          <hr className="w-full border-gray-300" />
        </div>
        <button
          onClick={handleGoogleLogin}
          className="w-full bg-indigo-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:bg-blue-700 transition-all flex items-center justify-center space-x-3"
        >
          <img src="/logo-google.png" alt="Google" className="w-6 h-6" />
          <span>Login dengan Google</span>
        </button>
        <p className="text-gray-500 mt-4 text-center">
          Belum mempunyai akun?{" "}
          <span
            onClick={() => navigate("/register")}
            className="text-blue-600 cursor-pointer hover:underline"
          >
            Register
          </span>
        </p>
      </div>
    </section>
  );
};

export default Login;
