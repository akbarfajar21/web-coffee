import React, { useEffect, useState } from "react";
import { supabase } from "../utils/SupaClient";
import Swal from "sweetalert2";
import Header from "../components/Header";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";

const SettingPage = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editData, setEditData] = useState({});
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const { data, error } = await supabase
          .from("profiles")
          .select("id, username, full_name, email, no_telepon, avatar_url")
          .eq("id", user.id)
          .single();

        if (error) {
          Swal.fire({
            title: "Error",
            text: "Failed to load profile data.",
            icon: "error",
            confirmButtonText: "OK",
          });
        } else {
          setProfile(data);
          setEditData(data);
        }
      }
      setLoading(false);
    };

    fetchProfile();
  }, []);

  const uploadAvatarToStorage = async (file) => {
    try {
      if (!file) {
        throw new Error("Avatar file not found.");
      }

      const fileName = `${profile.id}-${Date.now()}-${file.name}`;
      const { data, error } = await supabase.storage
        .from("avatars")
        .upload(`public/avatars/${fileName}`, file);

      if (error) {
        throw new Error("Failed to upload avatar to storage.");
      }

      const { data: urlData } = supabase.storage
        .from("avatars")
        .getPublicUrl(`public/avatars/${fileName}`);

      return urlData.publicUrl;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const handleUpdate = async () => {
    let interval;
    setUploading(true);
    setProgress(0);

    interval = setInterval(() => {
      setProgress((prevProgress) => {
        if (prevProgress >= 100) {
          clearInterval(interval);
          setUploading(false);
          setIsProcessing(true);
          return 100;
        }
        return prevProgress + 5;
      });
    }, 100);

    document.body.classList.add("overflow-hidden");

    try {
      if (!profile.id) {
        throw new Error("Profile ID not found.");
      }

      const { data, error } = await supabase
        .from("profiles")
        .update({
          username: editData.username,
          full_name: editData.full_name,
          email: editData.email,
          no_telepon: editData.no_telepon,
          avatar_url: editData.avatar_url,
        })
        .eq("id", profile.id)
        .select(); // ambil data terbaru yang diupdate

      if (error) {
        throw new Error(error.message);
      }

      // Update state lokal profile
      if (data && data.length > 0) {
        setProfile(data[0]); // update state global atau lokal dengan data baru
      }

      setTimeout(() => {
        setIsProcessing(false);
        toggleModal(); // <-- Tutup modal
        Swal.fire({
          title: "Success!",
          text: "Profile updated successfully.",
          icon: "success",
          showConfirmButton: false,
          timer: 1200,
          timerProgressBar: true,
        });
      }, 3000);
    } catch (error) {
      clearInterval(interval);
      setUploading(false);
      setIsProcessing(false);
      document.body.classList.remove("overflow-hidden");
      Swal.fire({
        title: "Error",
        text: error.message || "Failed to update profile.",
        icon: "error",
        confirmButtonText: "OK",
      });
    } finally {
      document.body.classList.remove("overflow-hidden");
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const toggleAvatarModal = () => {
    setIsAvatarModalOpen(!isAvatarModalOpen);
  };

  const handleAvatarSelect = async (event) => {
    try {
      const file = event.target.files[0];
      if (!file) throw new Error("No file selected.");

      setUploading(true);
      setProgress(0);

      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prev + 10;
        });
      }, 100);

      const avatarUrl = await uploadAvatarToStorage(file);

      // Update Supabase
      const { data, error } = await supabase
        .from("profiles")
        .update({ avatar_url: avatarUrl })
        .eq("id", profile.id)
        .select();

      if (error) throw new Error("Failed to update avatar in database.");
      if (data && data.length > 0) {
        setProfile(data[0]); // Update global/local state profile
      }

      // Tunggu progress selesai dulu
      setTimeout(() => {
        setUploading(false);
        setProgress(100);
        toggleAvatarModal(); // Tutup modal setelah loading
        Swal.fire({
          title: "Avatar Updated!",
          text: "Your profile picture has been updated.",
          icon: "success",
          timer: 1600,
          showConfirmButton: false,
        });
      }, 1200);
    } catch (error) {
      setUploading(false);
      Swal.fire({
        title: "Error",
        text: error.message || "Failed to update avatar.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  if (loading || isProcessing) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
        <Helmet>
          <title>CoffeeShopMe | Settings</title>
        </Helmet>
        <div className="relative flex items-center justify-center">
          <div className="absolute -top-8 flex space-x-2">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-2 h-6 bg-gray-400 opacity-50 rounded-full animate-steam"
                style={{ animationDelay: `${i * 0.2}s` }}
              ></div>
            ))}
          </div>

          <div className="relative w-20 h-16 bg-gradient-to-b from-orange-500 to-orange-700 rounded-t-full flex items-end justify-center shadow-lg glow-effect">
            <div className="absolute bottom-0 w-16 h-12 bg-white dark:bg-gray-800 rounded-t-full"></div>
          </div>

          <div className="absolute right-[-10px] top-[6px] w-5 h-5 border-4 border-orange-500 rounded-full"></div>
        </div>

        <p className="text-gray-600 dark:text-gray-300 mt-4 text-lg font-semibold animate-fade-in">
          Brewing your coffee...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <Header />
      <div className="mt-16 flex flex-1 items-center justify-center px-6 py-10 bg-gradient-to-b from-indigo-100 via-white to-indigo-200 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="bg-white dark:bg-gray-800 p-8 sm:p-10 rounded-3xl shadow-2xl w-full max-w-2xl backdrop-blur-sm">
          {/* Back Button */}
          <button
            onClick={handleBack}
            className="absolute top-6 left-6 text-gray-500 hover:text-indigo-500 transition dark:text-gray-300 dark:hover:text-indigo-400"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>

          {/* Heading */}
          <h1 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-10">
            Profile Settings
          </h1>

          {/* Profile Section */}
          <div className="grid md:grid-cols-2 gap-8 items-center">
            {/* Avatar */}
            <div className="flex flex-col items-center gap-4">
              <div className="relative w-32 h-32">
                <img
                  src={profile.avatar_url || "/default-avatar.png"}
                  alt="Avatar"
                  className="rounded-full w-full h-full object-cover border-4 border-indigo-500 shadow-md transition-transform hover:scale-105"
                />
                <button
                  onClick={toggleAvatarModal}
                  className="absolute bottom-0 right-0 bg-indigo-600 text-white p-2 rounded-full shadow-md hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-400 transition"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="w-5 h-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                </button>
              </div>
            </div>

            {/* Info */}
            <div className="space-y-5">
              {[
                { label: "Username", value: profile.username },
                { label: "Full Name", value: profile.full_name },
                { label: "Email", value: profile.email },
                { label: "Phone Number", value: profile.no_telepon },
              ].map((field, idx) => (
                <div key={idx} className="border-b pb-2">
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    {field.label}
                  </label>
                  <div className="text-base font-medium text-gray-900 dark:text-gray-200">
                    {field.value}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-10 text-center">
            <button
              onClick={toggleModal}
              className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold text-sm sm:text-base shadow-md hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-400 transition"
            >
              Edit Profile
            </button>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm transition-all">
          <div className="relative w-full max-w-sm mx-auto p-6 bg-white/80 dark:bg-gray-800/90 backdrop-blur-lg rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-700 animate-fadeIn">
            <button
              onClick={toggleModal}
              className="absolute top-4 right-4 text-gray-500 hover:text-red-500 transition-all dark:text-gray-300 dark:hover:text-red-400"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-5 h-5"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
            <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-6">
              Edit Profile
            </h2>
            <div className="space-y-4">
              {[
                {
                  label: "Username",
                  name: "username",
                  type: "text",
                  value: editData.username,
                },
                {
                  label: "Full Name",
                  name: "full_name",
                  type: "text",
                  value: editData.full_name,
                },
                {
                  label: "Email",
                  name: "email",
                  type: "email",
                  value: editData.email,
                },
                {
                  label: "Phone Number",
                  name: "no_telepon",
                  type: "text",
                  value: editData.no_telepon,
                },
              ].map((field, index) => (
                <div key={index}>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {field.label}
                  </label>
                  <input
                    type={field.type}
                    name={field.name}
                    value={field.value}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 rounded-xl bg-white/70 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-800 dark:text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                  />
                </div>
              ))}
            </div>

            <div className="mt-6 flex justify-center">
              <button
                onClick={handleUpdate}
                className="py-2 px-6 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-400 transition-all w-full sm:w-auto"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {uploading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-xs bg-white/80 dark:bg-gray-800/90 border border-gray-200 dark:border-gray-700 backdrop-blur-xl rounded-xl shadow-xl px-4 py-5 text-center relative">
            <div className="flex justify-center mb-3">
              <div className="h-7 w-7 border-[3px] border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
            </div>

            <h2 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
              Updating...
            </h2>

            <div className="w-full bg-gray-300 dark:bg-gray-700 h-1.5 rounded-full overflow-hidden shadow-inner">
              <div
                className="bg-indigo-600 dark:bg-indigo-400 h-1.5 transition-all duration-500 ease-in-out"
                style={{ width: `${progress}%` }}
              ></div>
            </div>

            <p className="mt-1.5 text-xs text-gray-600 dark:text-gray-300">
              {progress}%
            </p>
          </div>
        </div>
      )}

      {isAvatarModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-white/90 dark:bg-gray-800/90 border border-gray-200 dark:border-gray-700 backdrop-blur-lg rounded-2xl shadow-2xl p-6 max-w-md w-full animate-fadeIn transition-all duration-300">
            <h2 className="text-xl font-semibold text-center text-gray-900 dark:text-white mb-5 tracking-wide">
              Select Avatar Photo
            </h2>

            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Upload Image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleAvatarSelect}
              className="w-full file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-medium file:bg-indigo-100 file:text-indigo-700 hover:file:bg-indigo-200 dark:file:bg-indigo-500 dark:file:text-white dark:hover:file:bg-indigo-400 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm text-gray-700 dark:text-white"
            />

            {uploading && (
              <div className="w-full mt-4 space-y-2">
                <p className="text-xs text-gray-500 dark:text-gray-400 animate-pulse">
                  Uploading...
                </p>
                <div className="w-full h-2 bg-gray-300 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-indigo-500 via-indigo-400 to-indigo-600 rounded-full transition-all duration-300 ease-out"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              </div>
            )}

            <div className="mt-6 flex justify-end">
              <button
                onClick={toggleAvatarModal}
                className="px-5 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white text-sm font-medium rounded-lg shadow hover:bg-gray-300 dark:hover:bg-gray-600 transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingPage;
