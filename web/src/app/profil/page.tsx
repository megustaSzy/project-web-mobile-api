"use client";

import React, { useState, useEffect } from "react";
import { apiFetch } from "@/helpers/api";

export type ApiProfileResponse = {
  status: number;
  message: string;
  data: {
    id: number;
    name: string;
    email: string;
    role: string;
    avatar?: string | null;
  };
};

type UserProfile = {
  name: string;
  email: string;
  role: string;
  avatar: string;
};

export default function ProfilePage() {
  const [user, setUser] = useState<UserProfile>({
    name: "",
    email: "",
    role: "",
    avatar: "/images/profile.jpg",
  });
  const [loading, setLoading] = useState(true);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

  const buildAvatarUrl = (avatar?: string | null) => {
    if (!avatar) return "/images/profile.jpg";
    return avatar.startsWith("http") ? avatar : `${API_URL}${avatar}`;
  };

  const fetchProfile = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const res: ApiProfileResponse = await apiFetch("/api/users/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = res.data;
      const profileData: UserProfile = {
        name: data.name || "Pengguna",
        email: data.email || "",
        role: data.role || "",
        avatar: buildAvatarUrl(data.avatar),
      };

      setUser(profileData);
      localStorage.setItem("profile", JSON.stringify(profileData));
    } catch (err) {
      console.error("Error fetch profile:", err);
      alert("Gagal memuat profil. Silakan login ulang.");
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (name: string, avatarFile?: File) => {
    const token = localStorage.getItem("token");
    if (!token) return alert("Silakan login terlebih dahulu.");

    try {
      const formData = new FormData();
      formData.append("name", name);
      if (avatarFile) formData.append("avatar", avatarFile);

      const res: ApiProfileResponse = await apiFetch("/api/users", {
        method: "PUT",
        body: formData,
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = res.data;
      const avatarUrl = buildAvatarUrl(data.avatar);

      const newProfile: UserProfile = {
        name: data.name || "Pengguna",
        email: data.email || "",
        role: data.role || "",
        avatar: avatarUrl,
      };

      setUser(newProfile);
      localStorage.setItem("profile", JSON.stringify(newProfile));
      setFile(null);
      setPreview(null);

      alert("Profil berhasil diperbarui!");
    } catch (err) {
      console.error("Error update profile:", err);
      alert("Gagal update profil. Silakan coba lagi.");
    }
  };

  useEffect(() => {
    const local = localStorage.getItem("profile");
    if (local) {
      try {
        const p: UserProfile = JSON.parse(local);
        setUser({
          name: p.name || "Pengguna",
          email: p.email || "",
          role: p.role || "",
          avatar: buildAvatarUrl(p.avatar),
        });
        setLoading(false);
        return;
      } catch {}
    }
    fetchProfile();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;
    setFile(selected);
    setPreview(URL.createObjectURL(selected));
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUser((prev) => ({ ...prev, name: e.target.value }));
  };

  const handleSave = () => updateProfile(user.name, file ?? undefined);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("profile");
    window.location.href = "/login";
  };

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-gray-600 animate-pulse">Memuat profil...</p>
      </div>
    );

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 px-4">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md text-center">
        {/* Foto Profil */}
        <div className="relative mb-6">
          <img
            src={preview ?? user.avatar}
            alt="Foto Profil"
            className="w-32 h-32 rounded-full object-cover border-4 border-blue-100 mx-auto shadow-sm"
          />
          <label className="absolute bottom-0 right-[35%] bg-blue-500 hover:bg-blue-600 text-white rounded-full p-2 cursor-pointer transition">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
            ✎
          </label>
        </div>

        {/* Nama */}
        <input
          value={user.name}
          onChange={handleNameChange}
          className="w-full text-center border mb-2 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-200"
          placeholder="Nama Anda"
        />

        {/* Email */}
        <p className="text-gray-500 text-sm mb-1">{user.email}</p>
        {/* Role */}
        <p className="text-gray-400 text-xs mb-6">{user.role}</p>

        {/* Tombol Simpan */}
        <button
          onClick={handleSave}
          className="w-full bg-blue-600 text-white py-2 rounded-lg mb-4 hover:bg-blue-700 transition-all"
        >
          Simpan Perubahan
        </button>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition-all"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
