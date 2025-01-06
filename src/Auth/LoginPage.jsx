import React, { useState } from "react";
import { supabase } from "../utils/SupaClient";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  // Login dengan Google
  const handleGoogleLogin = async () => {
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

    // Jika login berhasil menggunakan Google
    if (user) {
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("id, email, role")
        .eq("id", user.id)
        .single();

      if (profileError || !profileData) {
        // Jika profil tidak ada, insert profil baru
        const { error: insertError } = await supabase.from("profiles").upsert({
          id: user.id,
          username: user.user_metadata.full_name, // Nama lengkap dari Google
          avatar_url: user.user_metadata.picture, // Foto profil dari Google
          email: user.email, // Email dari akun Google
          role: "user", // Set default role user jika tidak ada
        });

        if (insertError) {
          Swal.fire({
            title: "Error",
            text: "Gagal menyimpan profil pengguna.",
            icon: "error",
            confirmButtonText: "OK",
          });
        }
      }

      Swal.fire({
        title: "Login Berhasil!",
        text: "Selamat datang kembali!",
        icon: "success",
        confirmButtonText: "OK",
      }).then(() => {
        // Jika role admin, arahkan ke dashboard, jika tidak ke homepage
        if (profileData.role === "admin") {
          navigate("/dashboard");
        } else {
          navigate("/");
        }
      });
    }
  };

  // Login menggunakan email dan password
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });

      if (error) {
        Swal.fire({
          title: "Login Gagal!",
          text: "Periksa kembali email dan password Anda.",
          icon: "error",
          confirmButtonText: "OK",
        });
      } else if (data) {
        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("id, email, role")
          .eq("id", data.user.id)
          .single();

        if (profileError) {
          Swal.fire({
            title: "Error",
            text: "Gagal mendapatkan profil pengguna.",
            icon: "error",
            confirmButtonText: "OK",
          });
        } else if (profileData) {
          // Periksa apakah email sudah diupdate jika berbeda
          if (profileData.email !== data.user.email) {
            const { error: updateError } = await supabase
              .from("profiles")
              .update({ email: data.user.email })
              .eq("id", data.user.id);

            if (updateError) {
              Swal.fire({
                title: "Error",
                text: "Gagal memperbarui email pengguna.",
                icon: "error",
                confirmButtonText: "OK",
              });
            }
          }

          Swal.fire({
            title: "Login Berhasil!",
            text: "Selamat datang kembali!",
            icon: "success",
            confirmButtonText: "OK",
          }).then(() => {
            // Arahkan pengguna berdasarkan role setelah login berhasil
            if (profileData.role === "admin") {
              navigate("/dashboard"); // Halaman admin
            } else {
              navigate("/"); // Halaman pengguna biasa
            }
          });
        }
      }
    } catch (error) {
      console.log(error);
      Swal.fire({
        title: "Terjadi kesalahan!",
        text: "Silakan coba lagi nanti.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  return (
    <section className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="max-w-5xl w-full bg-white shadow-md rounded-lg overflow-hidden flex">
        <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
          <h2 className="text-3xl font-semibold mb-6 text-center">Login Page</h2>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                name="email"
                id="email"
                required
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
              <input
                type="password"
                name="password"
                id="password"
                required
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2 px-4 bg-indigo-600 text-white font-semibold rounded-md shadow hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Login Now
            </button>
          </form>
          <div className="flex items-center justify-center mt-6">
            <button
              onClick={handleGoogleLogin}
              className="w-full py-2 px-4 bg-indigo-500 text-white font-semibold rounded-md shadow hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 flex items-center justify-center"
            >
              <img src="/google-icon.svg" alt="Google" className="w-6 h-6 mr-2" />
              Login with Google
            </button>
          </div>
        </div>
        <div className="hidden md:block w-1/2 bg-gray-200">
          <img src="/login.gif" alt="Login Illustration" className="object-cover h-full w-full" />
        </div>
      </div>
    </section>
  );
};

export default Login;
