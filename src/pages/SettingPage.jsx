import React, { useEffect, useState } from "react";
import { supabase } from "../utils/SupaClient";
import Swal from "sweetalert2";
import Header from "../components/Header";
import ProfileEditableField from "../components/ProfileEditableField";

const SettingPage = () => {
  const [profile, setProfile] = useState({});
  const [loading, setLoading] = useState(true);

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
        }
      }
      setLoading(false);
    };

    fetchProfile();
  }, []);

  const handleUpdate = async (field, value) => {
    if (field === "avatar_url") {
      const file = value;
      const fileName = `${profile.id}-${Date.now()}`; 
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("avatars") 
        .upload(fileName, file);

      if (uploadError) {
        Swal.fire({
          title: "Error",
          text: "Gagal mengunggah foto.",
          icon: "error",
          confirmButtonText: "OK",
        });
        return;
      }
      const { data: publicUrlData } = supabase.storage
        .from("avatars")
        .getPublicUrl(fileName);

      if (publicUrlData) {
        value = publicUrlData.publicUrl; 
      } else {
        Swal.fire({
          title: "Error",
          text: "Gagal mendapatkan URL foto.",
          icon: "error",
          confirmButtonText: "OK",
        });
        return;
      }
    }
    const { error } = await supabase
      .from("profiles")
      .update({ [field]: value })
      .eq("id", profile.id);

    if (error) {
      Swal.fire({
        title: "Error",
        text: `Gagal memperbarui ${field}.`,
        icon: "error",
        confirmButtonText: "OK",
      });
    } else {
      Swal.fire({
        title: "Berhasil!",
        text: `${field} berhasil diperbarui.`,
        icon: "success",
        confirmButtonText: "OK",
      }).then(() => {
        window.location.reload();
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex flex-1 items-center justify-center bg-gray-100">
        <div className="bg-white p-6 rounded shadow-md w-full max-w-lg">
          <h1 className="text-2xl font-bold mb-6 text-center">
            Pengaturan Profil
          </h1>
          <div className="flex flex-col items-center space-y-4">
            <div className="relative">
              <img
                src={profile.avatar_url || "/default-avatar.png"}
                alt="Avatar"
                className="w-24 h-24 rounded-full object-cover border shadow"
              />
              <label
                htmlFor="avatar"
                className="absolute bottom-0 right-0 bg-indigo-500 p-2 rounded-full cursor-pointer hover:bg-indigo-600"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="white"
                  className="w-4 h-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.232 5.232l3.536 3.536M16.88 3.88a3 3 0 114.24 4.24l-9.192 9.192a4.5 4.5 0 01-1.591 1.04l-3.338 1.112 1.112-3.338a4.5 4.5 0 011.04-1.592l9.192-9.192z"
                  />
                </svg>
              </label>
              <input
                type="file"
                id="avatar"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleUpdate("avatar_url", e.target.files[0])}
              />
            </div>
            <div className="w-full">
              <ProfileEditableField
                label="Username"
                value={profile.username}
                onSave={(value) => handleUpdate("username", value)}
              />
              <ProfileEditableField
                label="Full Name"
                value={profile.full_name}
                onSave={(value) => handleUpdate("full_name", value)}
              />
              <ProfileEditableField
                label="Email"
                value={profile.email}
                onSave={(value) => handleUpdate("email", value)}
              />
              <ProfileEditableField
                label="No Telepon"
                value={profile.no_telepon}
                onSave={(value) => handleUpdate("no_telepon", value)}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingPage;
