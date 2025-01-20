import React, { useEffect, useState } from "react";
import { supabase } from "../utils/SupaClient";
import Swal from "sweetalert2";
import Header from "../components/Header";
import { useNavigate } from "react-router-dom";

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
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <Header />
      <div className="mt-14 flex flex-1 items-center justify-center p-4 bg-gradient-to-r from-indigo-100 via-indigo-50 to-indigo-200 dark:from-indigo-900 dark:via-indigo-700 dark:to-indigo-800">
        <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-lg relative dark:bg-gray-700 dark:text-white">
          <button
            onClick={handleBack}
            className="absolute top-4 left-4 text-gray-700 hover:text-indigo-600 transition duration-300 dark:text-white dark:hover:text-indigo-400"
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

          <h1 className="text-3xl font-semibold mb-6 text-center text-gray-800 dark:text-gray-200">
            Profile Settings
          </h1>
          <div className="flex flex-col items-center space-y-6">
            <div className="relative">
              <img
                src={profile.avatar_url || "/default-avatar.png"}
                alt="Avatar"
                className="w-32 h-32 rounded-full object-cover border-4 border-indigo-500 shadow-lg"
              />
              <button
                onClick={toggleAvatarModal}
                className="absolute bottom-0 right-0 bg-indigo-600 text-white p-2 rounded-full hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-400"
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
                    d="M12 4v16m8-8H4"
                  />
                </svg>
              </button>
            </div>
            <div className="w-full space-y-4">
              <div>
                <label className="text-gray-700 font-semibold dark:text-gray-300">
                  Username
                </label>
                <div className="text-gray-500 dark:text-gray-400">
                  {profile.username}
                </div>
              </div>
              <div>
                <label className="text-gray-700 font-semibold dark:text-gray-300">
                  Full Name
                </label>
                <div className="text-gray-500 dark:text-gray-400">
                  {profile.full_name}
                </div>
              </div>
              <div>
                <label className="text-gray-700 font-semibold dark:text-gray-300">
                  Email
                </label>
                <div className="text-gray-500 dark:text-gray-400">
                  {profile.email}
                </div>
              </div>
              <div>
                <label className="text-gray-700 font-semibold dark:text-gray-300">
                  Phone Number
                </label>
                <div className="text-gray-500 dark:text-gray-400">
                  {profile.no_telepon}
                </div>
              </div>
            </div>
            <button
              onClick={toggleModal}
              className="w-full mt-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition duration-300 dark:bg-indigo-500 dark:hover:bg-indigo-400"
            >
              Edit Profile
            </button>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-gray-800 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-xl max-w-sm w-full">
            <h2 className="text-xl font-semibold dark:text-white text-center mb-6">
              Edit Profile
            </h2>
            <div className="space-y-4">
              <div>
                <label className="text-gray-700 dark:text-gray-300">
                  Username
                </label>
                <input
                  type="text"
                  name="username"
                  value={editData.username}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="text-gray-700 dark:text-gray-300">
                  Full Name
                </label>
                <input
                  type="text"
                  name="full_name"
                  value={editData.full_name}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="text-gray-700 dark:text-gray-300">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={editData.email}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="text-gray-700 dark:text-gray-300">
                  Phone Number
                </label>
                <input
                  type="text"
                  name="no_telepon"
                  value={editData.no_telepon}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                />
              </div>
            </div>
            <div className="mt-6 flex justify-between">
              <button
                onClick={handleUpdate}
                className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition duration-300"
              >
                Save
              </button>
              <button
                onClick={toggleModal}
                className="px-6 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500 transition duration-300"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {uploading && (
        <div className="fixed inset-0 z-50 bg-gray-800 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-xl max-w-sm w-full">
            <h2 className="text-xl font-semibold text-center mb-6 dark:text-white">
              Updating Profile...
            </h2>
            <div className="w-full bg-gray-200 h-2 rounded-full">
              <div
                className="bg-indigo-600 h-2 rounded-full"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        </div>
      )}

      {isAvatarModalOpen && (
        <div className="fixed inset-0 z-50 bg-gray-800 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-xl max-w-sm w-full">
            <h2 className="text-xl font-semibold text-center dark:text-white mb-6">
              Select Avatar Photo
            </h2>
            <input
              type="file"
              accept="image/*"
              onChange={handleAvatarSelect}
              className="dark:text-white w-full p-2 border border-gray-300 rounded-lg"
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
            <div className="mt-6 flex justify-between">
              <button
                onClick={toggleAvatarModal}
                className="px-6 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500 transition duration-300"
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
