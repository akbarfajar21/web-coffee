import React from "react";
import { supabase } from "../utils/SupaClient";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const Login = () => {
  const navigate = useNavigate();

  // Fungsi login dengan Google
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
        .select("id, username, email, role")
        .eq("id", user.id)
        .single();

      let fullName;

      if (profileError || !profileData) {
        const { error: insertError } = await supabase.from("profiles").upsert({
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
  };

  // Fungsi login dengan GitHub
  const handleGithubLogin = async () => {
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
      // Ambil nama pengguna GitHub yang benar
      const githubUsername =
        user.user_metadata.full_name || user.user_metadata.username;

      // Ambil profil pengguna dari Supabase
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("id, email, role")
        .eq("id", user.id)
        .single();

      if (profileError || !profileData) {
        const { error: insertError } = await supabase.from("profiles").upsert({
          id: user.id,
          username: githubUsername,
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
      } else {
        const { error: updateError } = await supabase.from("profiles").upsert({
          id: user.id,
          username: githubUsername,
          avatar_url: user.user_metadata.picture,
          email: user.email,
        });

        if (updateError) {
          Swal.fire({
            title: "Error",
            text: "Gagal memperbarui profil pengguna.",
            icon: "error",
            confirmButtonText: "OK",
          });
        }
      }

      Swal.fire({
        title: "Login Berhasil!",
        text: `Selamat datang kembali, ${githubUsername}!\nEmail: ${user.email}`,
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
            className="w-full bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:bg-blue-700 transition-all flex items-center justify-center space-x-3 mb-4"
          >
            <img src="/google-icon.svg" alt="Google" className="w-6 h-6" />
            <span>Login dengan Google</span>
          </button>
          <button
            onClick={handleGithubLogin}
            className="w-full bg-gray-800 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:bg-gray-900 transition-all flex items-center justify-center space-x-3"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-6 h-6"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M12 0C5.372 0 0 5.372 0 12c0 5.302 3.438 9.8 8.207 11.397.6.11.82-.26.82-.58v-2.227c-3.338.728-4.038-1.6-4.038-1.6-.544-1.383-1.329-1.756-1.329-1.756-1.085-.741.082-.727.082-.727 1.201.085 1.833 1.268 1.833 1.268 1.065 1.814 2.809 1.29 3.494.988.108-.774.418-1.29.762-1.587-2.666-.307-5.467-1.34-5.467-5.94 0-1.31.468-2.378 1.237-3.215-.124-.307-.536-1.537.084-3.199 0 0 1.006-.322 3.296 1.224A11.479 11.479 0 0112 5.125c1.02 0 2.043.132 3.016.39 2.29-1.547 3.296-1.224 3.296-1.224.62 1.662.208 2.892.084 3.199.77.837 1.237 1.905 1.237 3.215 0 4.617-2.801 5.625-5.471 5.94.429.364.818 1.082.818 2.18v3.308c0 .318.22.693.82.582A11.947 11.947 0 0024 12c0-6.628-5.372-12-12-12z"
                clipRule="evenodd"
              />
            </svg>
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
