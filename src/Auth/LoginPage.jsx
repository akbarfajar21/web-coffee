import React from "react";
import { supabase } from "../utils/SupaClient";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const Login = () => {
  const navigate = useNavigate();

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

    if (user) {
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("id, email, role")
        .eq("id", user.id)
        .single();

      if (profileError || !profileData) {
        const { error: insertError } = await supabase.from("profiles").upsert({
          id: user.id,
          username: user.user_metadata.full_name,
          avatar_url: user.user_metadata.picture,
          email: user.email,
          role: "user",
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
        navigate("/");
      });
    }
  };

  const handleGitHubLogin = async () => {
    const { user, error } = await supabase.auth.signInWithOAuth({
      provider: "github",
    });

    if (error) {
      Swal.fire({
        title: "Login Gagal!",
        text: "Terjadi masalah saat login dengan GitHub.",
        icon: "error",
        confirmButtonText: "OK",
      });
      return;
    }

    if (user) {
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("id, email, role")
        .eq("id", user.id)
        .single();

      if (profileError || !profileData) {
        const { error: insertError } = await supabase.from("profiles").upsert({
          id: user.id,
          username: user.user_metadata.full_name || user.user_metadata.user_name,
          avatar_url: user.user_metadata.avatar_url,
          email: user.email,
          role: "user",
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
        navigate("/");
      });
    }
  };

  return (
    <section className="flex items-center justify-center min-h-screen bg-gradient-to-tr from-indigo-700 via-blue-500 to-blue-600 p-6">
      <div className="max-w-4xl w-full bg-white shadow-xl rounded-2xl overflow-hidden flex flex-col md:flex-row">
        <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center items-center relative">
          <div
            onClick={() => navigate(-1)}
            className="absolute top-4 left-4 cursor-pointer text-gray-600 hover:text-gray-800 transition-all"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </div>
          <h2 className="text-4xl font-extrabold text-gray-800 text-center mb-6">
            Selamat Datang
          </h2>
          <p className="text-gray-600 text-center mb-6">
            Masuk untuk melanjutkan ke akun Anda!
          </p>
          <button
            onClick={handleGoogleLogin}
            className="w-full bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:bg-blue-700 transition-all flex items-center justify-center space-x-3"
          >
            <img src="/google-icon.svg" alt="Google" className="w-6 h-6" />
            <span>Login dengan Google</span>
          </button>
          <button
            onClick={handleGitHubLogin}
            className="w-full bg-gray-500 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:bg-gray-600 transition-all flex items-center justify-center space-x-3 mt-4"
          >
            <img src="/github-icon.png" alt="GitHub" className="w-6 h-6" />
            <span>Login dengan GitHub</span>
          </button>
        </div>
        <div className="hidden md:block w-1/2 bg-gray-100 p-6 flex justify-center items-center">
          <img
            src="/login.gif"
            alt="Login Illustration"
            className="rounded-lg shadow-lg object-cover w-full h-auto"
          />
        </div>
      </div>
    </section>
  );
};

export default Login;
