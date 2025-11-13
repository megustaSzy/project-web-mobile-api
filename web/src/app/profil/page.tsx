"use client";

import React, { useState, useEffect } from "react";

export default function ProfilePage() {
  const [user, setUser] = useState({ name: "", email: "", avatar: "" });
  const [loading, setLoading] = useState(true);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    // Ambil data user dari API profil
    fetch("http://10.93.86.50:3001/api/auth/profile", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(async (res) => {
        if (!res.ok) throw new Error("Gagal mengambil profil pengguna");
        const data = await res.json();

        const avatarUrl = data.avatar
          ? data.avatar.startsWith("http")
            ? data.avatar
            : `http://10.93.86.50:3001/uploads/${data.avatar}`
          : "/images/profile.jpg";

        setUser({
          name: data.name || "Pengguna Tanpa Nama",
          email: data.email || "Email tidak tersedia",
          avatar: avatarUrl,
        });
      })
      .catch((err) => console.error("Error:", err))
      .finally(() => setLoading(false));
  }, []);

  // Saat user pilih file
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
      setPreview(URL.createObjectURL(selected));
    }
  };

  // Upload foto ke server
  const handleUpload = async () => {
    if (!file) return alert("Pilih gambar terlebih dahulu!");
    const token = localStorage.getItem("token");

    const formData = new FormData();
    formData.append("avatar", file);

    try {
      const res = await fetch("http://10.93.86.50:3001/api/auth/upload-avatar", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (!res.ok) throw new Error("Gagal upload foto profil");
      const data = await res.json();

      const newAvatar = `http://10.93.86.50:3001/uploads/${data.filename}`;
      setUser((prev) => ({ ...prev, avatar: newAvatar }));
      setPreview(null);
      alert("Foto profil berhasil diperbarui!");
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan saat upload foto");
    }
  };

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
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
            src={preview || user.avatar}
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

        {/* Data Pengguna */}
        <h2 className="text-2xl font-semibold text-gray-800 mb-1">
          {user.name}
        </h2>
        <p className="text-gray-500 text-sm mb-6">{user.email}</p>

        {/* Tombol Simpan Foto */}
        {preview && (
          <button
            onClick={handleUpload}
            className="w-full bg-blue-600 text-white py-2 rounded-lg mb-4 hover:bg-blue-700 transition-all"
          >
            Simpan Foto Profil
          </button>
        )}

        {/* Tombol Logout */}
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
