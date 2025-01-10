import React, { useEffect, useState } from "react";
import { supabase } from "../utils/SupaClient";
import Swal from "sweetalert2";
import Header from "../components/Header";
import { useNavigate } from "react-router-dom"; // Import useNavigate

const SettingPage = () => {
  const [profile, setProfile] = useState({});
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false); // State untuk kontrol modal
  const [editData, setEditData] = useState({}); // State untuk menyimpan data yang sedang diedit
  const navigate = useNavigate(); // Initialize navigate

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
            text: "Gagal memuat data profil.",
            icon: "error",
            confirmButtonText: "OK",
          });
        } else {
          setProfile(data);
          setEditData(data); // Set data untuk edit
        }
      }
      setLoading(false);
    };

    fetchProfile();
  }, []);

  const handleUpdate = async () => {
    let interval;
    setUploading(true);
    setProgress(0);

    interval = setInterval(() => {
      setProgress((prevProgress) => {
        if (prevProgress >= 100) {
          clearInterval(interval);
          setUploading(false);
          Swal.fire({
            title: "Berhasil!",
            text: "Profil berhasil diperbarui.",
            icon: "success",
            showConfirmButton: false,
            timer: 1500,
            timerProgressBar: true,
          }).then(() => {
            window.location.reload();
          });
          return 100;
        }
        return prevProgress + 5;
      });
    }, 100);

    document.body.classList.add("overflow-hidden");

    try {
      if (!profile.id) {
        throw new Error("ID profil tidak ditemukan.");
      }

      const { error } = await supabase
        .from("profiles")
        .update({
          username: editData.username,
          full_name: editData.full_name,
          email: editData.email,
          no_telepon: editData.no_telepon,
        })
        .eq("id", profile.id);

      if (error) {
        throw new Error(error.message);
      }
    } catch (error) {
      clearInterval(interval);
      setUploading(false);
      document.body.classList.remove("overflow-hidden");
      Swal.fire({
        title: "Error",
        text: error.message || "Gagal memperbarui profil.",
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <div className="mt-14 flex flex-1 items-center justify-center p-4 bg-gradient-to-r from-indigo-100 via-indigo-50 to-indigo-200">
        <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-lg relative">
          <button
            onClick={handleBack}
            className="absolute top-4 left-4 text-gray-700 hover:text-indigo-600 transition duration-300"
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

          <h1 className="text-3xl font-semibold mb-6 text-center text-gray-800">
            Pengaturan Profil
          </h1>
          <div className="flex flex-col items-center space-y-6">
            <div className="relative">
              <img
                src={profile.avatar_url || "/default-avatar.png"}
                alt="Avatar"
                className="w-32 h-32 rounded-full object-cover border-4 border-indigo-500 shadow-lg"
              />
            </div>
            <div className="w-full space-y-4">
              <div>
                <label className="text-gray-700 font-semibold">Username</label>
                <div className="text-gray-500">{profile.username}</div>
              </div>
              <div>
                <label className="text-gray-700 font-semibold">Full Name</label>
                <div className="text-gray-500">{profile.full_name}</div>
              </div>
              <div>
                <label className="text-gray-700 font-semibold">Email</label>
                <div className="text-gray-500">{profile.email}</div>
              </div>
              <div>
                <label className="text-gray-700 font-semibold">
                  No Telepon
                </label>
                <div className="text-gray-500">{profile.no_telepon}</div>
              </div>
            </div>
            <button
              onClick={toggleModal}
              className="w-full mt-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition duration-300"
            >
              Edit Profil
            </button>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-md shadow-lg w-full max-w-lg">
            <h2 className="text-2xl font-semibold mb-4 text-center text-gray-800">
              Edit Profil
            </h2>
            <div className="space-y-4">
              <div>
                <label className="text-gray-700 font-semibold">Username</label>
                <input
                  type="text"
                  name="username"
                  value={editData.username}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="text-gray-700 font-semibold">Full Name</label>
                <input
                  type="text"
                  name="full_name"
                  value={editData.full_name}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="text-gray-700 font-semibold">Email</label>
                <input
                  type="email"
                  name="email"
                  value={editData.email}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="text-gray-700 font-semibold">
                  No Telepon
                </label>
                <input
                  type="text"
                  name="no_telepon"
                  value={editData.no_telepon}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
            </div>
            <div className="mt-6 flex justify-between">
              <button
                onClick={toggleModal}
                className="px-6 py-2 bg-gray-300 rounded-lg text-gray-700 hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
              >
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}

      {uploading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="w-full max-w-md p-6 bg-white rounded-md shadow-xl">
            <div className="h-2 bg-indigo-500 rounded-full">
              <div
                className="h-full bg-indigo-700 rounded-full"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="mt-4 text-center text-indigo-700 font-semibold">
              {progress === 100 ? "Uploading Complete!" : "Uploading..."}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingPage;
