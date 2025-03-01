import React, { useEffect, useState } from "react";
import { supabase } from "../utils/SupaClient";
import Swal from "sweetalert2";
import Header from "../components/Header";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";

const SettingPage = () => {
  const [profile, setProfile] = useState({});
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

      const { error } = await supabase
        .from("profiles")
        .update({
          username: editData.username,
          full_name: editData.full_name,
          email: editData.email,
          no_telepon: editData.no_telepon,
          avatar_url: editData.avatar_url,
        })
        .eq("id", profile.id);

      if (error) {
        throw new Error(error.message);
      }

      setTimeout(() => {
        setIsProcessing(false);
        Swal.fire({
          title: "Success!",
          text: "Profile updated successfully.",
          icon: "success",
          showConfirmButton: false,
          timer: 1200,
          timerProgressBar: true,
        }).then(() => {
          setTimeout(() => {
            window.location.reload();
          }, 1500);
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
      if (!file) {
        throw new Error("No file selected.");
      }

      setUploading(true);
      setProgress(0);

      let interval = setInterval(() => {
        setProgress((prevProgress) => {
          if (prevProgress >= 100) {
            clearInterval(interval);
            setUploading(false);
            return 100;
          }
          return prevProgress + 10;
        });
      }, 100);

      const avatarUrl = await uploadAvatarToStorage(file);

      setEditData((prevData) => ({
        ...prevData,
        avatar_url: avatarUrl,
      }));
      setProfile((prevProfile) => ({
        ...prevProfile,
        avatar_url: avatarUrl,
      }));

      const { error } = await supabase
        .from("profiles")
        .update({ avatar_url: avatarUrl })
        .eq("id", profile.id);

      if (error) {
        throw new Error("Failed to update avatar in database.");
      }

      setIsAvatarModalOpen(false);

      Swal.fire({
        title: "Profile picture updated successfully...",
        timer: 2000,
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      }).then(() => {
        window.location.reload();
      });
    } catch (error) {
      setUploading(false);
      Swal.fire({
        title: "Error",
        text: error.message || "An error occurred while updating avatar.",
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
      <div className="mt-16 flex flex-1 items-center justify-center p-6 bg-gradient-to-b from-indigo-100 via-white to-indigo-200 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md relative dark:bg-gray-800 dark:text-white">
          {/* Tombol Back */}
          <button
            onClick={handleBack}
            className="absolute top-4 left-4 text-gray-600 hover:text-indigo-500 transition-all dark:text-gray-300 dark:hover:text-indigo-400"
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

          {/* Judul */}
          <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-center text-gray-900 dark:text-gray-200">
            Profile Settings
          </h1>

          {/* Avatar */}
          <div className="flex flex-col items-center space-y-4">
            <div className="relative w-28 h-28 sm:w-32 sm:h-32">
              <img
                src={profile.avatar_url || "/default-avatar.png"}
                alt="Avatar"
                className="w-full h-full rounded-full object-cover border-4 border-indigo-500 shadow-md transition-all hover:scale-105"
              />
              <button
                onClick={toggleAvatarModal}
                className="absolute bottom-0 right-0 bg-indigo-600 text-white p-2 rounded-full shadow-md hover:bg-indigo-700 transition-all dark:bg-indigo-500 dark:hover:bg-indigo-400"
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

            {/* Data Profile */}
            <div className="w-full space-y-4">
              {[
                { label: "Username", value: profile.username },
                { label: "Full Name", value: profile.full_name },
                { label: "Email", value: profile.email },
                { label: "Phone Number", value: profile.no_telepon },
              ].map((field, index) => (
                <div key={index} className="border-b pb-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    {field.label}
                  </label>
                  <div className="text-gray-800 dark:text-gray-400 font-medium">
                    {field.value}
                  </div>
                </div>
              ))}
            </div>

            {/* Tombol Edit */}
            <button
              onClick={toggleModal}
              className="w-full mt-4 py-3 bg-indigo-600 text-white rounded-lg font-semibold text-sm sm:text-base shadow-md hover:bg-indigo-700 transition-all dark:bg-indigo-500 dark:hover:bg-indigo-400"
            >
              Edit Profile
            </button>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-gray-900 bg-opacity-50 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-2xl max-w-xs w-full relative">
            {/* Tombol Close (X) */}
            <button
              onClick={toggleModal}
              className="absolute top-3 right-3 text-gray-500 hover:text-red-500 transition-all dark:text-gray-300 dark:hover:text-red-400"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-4 h-4"
              >
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>

            {/* Header */}
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white text-center mb-4">
              Edit Profile
            </h2>

            {/* Form */}
            <div className="space-y-3">
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
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {field.label}
                  </label>
                  <input
                    type={field.type}
                    name={field.name}
                    value={field.value}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>
              ))}
            </div>

            {/* Tombol Aksi */}
            <div className="mt-4 flex items-center justify-between space-x-2">
              <button
                onClick={handleUpdate}
                className="w-1/2 py-2 bg-indigo-600 text-white text-sm font-semibold rounded-md shadow-md hover:bg-indigo-700 transition-all dark:bg-indigo-500 dark:hover:bg-indigo-400"
              >
                Save
              </button>
              <button
                onClick={toggleModal}
                className="w-1/2 py-2 bg-gray-300 text-gray-700 text-sm font-semibold rounded-md shadow-md hover:bg-gray-400 transition-all dark:bg-gray-600 dark:hover:bg-gray-500 dark:text-white"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {uploading && (
        <div className="fixed inset-0 z-50 bg-gray-900 bg-opacity-50 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow-xl max-w-xs w-full text-center">
            {/* Judul */}
            <h2 className="text-sm font-medium text-gray-900 dark:text-white mb-4">
              Updating Profile...
            </h2>

            {/* Progress Bar */}
            <div className="w-full bg-gray-200 dark:bg-gray-700 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-indigo-600 dark:bg-indigo-400 h-1.5 rounded-full transition-all ease-in-out"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        </div>
      )}

      {isAvatarModalOpen && (
        <div className="fixed inset-0 z-50 bg-gray-800 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-2xl max-w-sm w-full">
            <h2 className="text-xl font-bold text-center dark:text-white mb-6">
              Select Avatar Photo
            </h2>
            <input
              type="file"
              accept="image/*"
              onChange={handleAvatarSelect}
              className="dark:text-white w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600"
            />
            {uploading && (
              <div className="w-full mt-4">
                <div className="text-gray-700 dark:text-gray-300 mb-2">
                  Uploading...
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                  <div
                    className="bg-indigo-600 h-2.5 rounded-full"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              </div>
            )}
            <div className="mt-6 flex justify-end">
              <button
                onClick={toggleAvatarModal}
                className="px-6 py-2.5 bg-gray-400 text-white rounded-lg hover:bg-gray-500 transition duration-300"
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
