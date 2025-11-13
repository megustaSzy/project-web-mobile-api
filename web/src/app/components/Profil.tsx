"use client";
// import { useEffect, useState } from "react";
import React, { useState, useEffect } from "react";
export default function ProfilePage() {
  const [user, setUser] = useState({ name: "", email: "", avatar: "" });
  const [loading, setLoading] = useState(true);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    // Ambil data user dari API
    fetch("http://10.93.86.50:3001/api/auth/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(async (res) => {
        if (!res.ok) throw new Error("Gagal ambil profil");
        const data = await res.json();

        const avatarUrl = data.avatar
          ? data.avatar.startsWith("http")
            ? data.avatar
            : `http://10.93.86.50:3001/uploads/${data.avatar}`
          : "/images/profile.jpg";

        setUser({ name: data.name, email: data.email, avatar: avatarUrl });
      })
      .catch((err) => {
        console.error("Error:", err);
      })
      .finally(() => setLoading(false));
  }, []);

  // 🔹 Saat user pilih file
const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const selected = e.target.files?.[0];
  if (selected) {
    setFile(selected);
    setPreview(URL.createObjectURL(selected));
  }
};


  // 🔹 Upload ke backend
  const handleUpload = async () => {
    if (!file) return alert("Pilih gambar terlebih dahulu!");
    const token = localStorage.getItem("token");

    const formData = new FormData();
    formData.append("avatar", file);

    try {
      const res = await fetch("http://10.93.86.50:3001/api/auth/upload-avatar", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!res.ok) throw new Error("Gagal upload foto");
      const data = await res.json();

      const newAvatar = `http://10.93.86.50:3001/uploads/${data.filename}`;
      setUser({ ...user, avatar: newAvatar });
      setPreview(null);
      alert("Foto profil berhasil diperbarui!");
    } catch (err) {
      console.error(err);
      alert("Upload gagal");
    }
  };

  // 🔹 Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  if (loading) return <p className="text-center mt-10">Memuat profil...</p>;

  return (
    <div className="max-w-md mx-auto bg-white shadow-lg rounded-2xl p-6 mt-10 text-center">
      <div className="flex flex-col items-center">
        <img
          src={preview || user.avatar}
          alt="Foto Profil"
          className="w-28 h-28 rounded-full object-cover border mb-4"
        />
        <h2 className="text-xl font-semibold">{user.name}</h2>
        <p className="text-gray-600 mb-4">{user.email}</p>

        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="mb-2"
        />
        {preview && (
          <button
            onClick={handleUpload}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg mb-6 hover:bg-blue-600 transition"
          >
            Simpan Foto Profil
          </button>
        )}

        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
