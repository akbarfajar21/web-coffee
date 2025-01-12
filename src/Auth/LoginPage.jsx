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
        .select("id, email, role")
        .eq("id", user.id)
        .single();

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

  // Fungsi login dengan Figma
  const handleFigmaLogin = async () => {
    const { user, error } = await supabase.auth.signInWithOAuth({
      provider: "figma",
    });

    if (error) {
      Swal.fire({
        title: "Login Gagal!",
        text: "Terjadi masalah saat login dengan Figma.",
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
      }

      // Menampilkan username dan avatar
      Swal.fire({
        title: "Login Berhasil!",
        text: `Selamat datang, ${user.user_metadata.full_name}!`,
        imageUrl: user.user_metadata.picture,
        imageWidth: 100,
        imageHeight: 100,
        imageAlt: "Avatar",
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
          <button
            onClick={handleFigmaLogin}
            className="w-full bg-purple-600 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:bg-purple-700 transition-all flex items-center justify-center space-x-3 mt-4"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-6 h-6"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M12 2C13.3261 2 14.5979 2.52678 15.5355 3.46447C16.4732 4.40215 17 5.67392 17 7C17 8.32608 16.4732 9.59785 15.5355 10.5355C14.5979 11.4732 13.3261 12 12 12C10.6739 12 9.40215 11.4732 8.46447 10.5355C7.52678 9.59785 7 8.32608 7 7C7 5.67392 7.52678 4.40215 8.46447 3.46447C9.40215 2.52678 10.6739 2 12 2ZM12 14C13.3261 14 14.5979 14.5268 15.5355 15.4645C16.4732 16.4021 17 17.6739 17 19C17 20.3261 16.4732 21.5979 15.5355 22.5355C14.5979 23.4732 13.3261 24 12 24C10.6739 24 9.40215 23.4732 8.46447 22.5355C7.52678 21.5979 7 20.3261 7 19C7 17.6739 7.52678 16.4021 8.46447 15.4645C9.40215 14.5268 10.6739 14 12 14ZM19 2C20.3261 2 21.5979 2.52678 22.5355 3.46447C23.4732 4.40215 24 5.67392 24 7C24 8.32608 23.4732 9.59785 22.5355 10.5355C21.5979 11.4732 20.3261 12 19 12C17.6739 12 16.4021 11.4732 15.4645 10.5355C14.5268 9.59785 14 8.32608 14 7C14 5.67392 14.5268 4.40215 15.4645 3.46447C16.4021 2.52678 17.6739 2 19 2ZM5 2C6.32608 2 7.59785 2.52678 8.53553 3.46447C9.47322 4.40215 10 5.67392 10 7C10 8.32608 9.47322 9.59785 8.53553 10.5355C7.59785 11.4732 6.32608 12 5 12C3.67392 12 2.40215 11.4732 1.46447 10.5355C0.526784 9.59785 0 8.32608 0 7C0 5.67392 0.526784 4.40215 1.46447 3.46447C2.40215 2.52678 3.67392 2 5 2ZM5 14C6.32608 14 7.59785 14.5268 8.53553 15.4645C9.47322 16.4021 10 17.6739 10 19C10 20.3261 9.47322 21.5979 8.53553 22.5355C7.59785 23.4732 6.32608 24 5 24C3.67392 24 2.40215 23.4732 1.46447 22.5355C0.526784 21.5979 0 20.3261 0 19C0 17.6739 0.526784 16.4021 1.46447 15.4645C2.40215 14.5268 3.67392 14 5 14Z" />
            </svg>
            <span>Login dengan Figma</span>
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
