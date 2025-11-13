"use client";

import React, { useState, useEffect } from "react";

/**
 * ProfilePage
 * - ambil awal dari API (jika ada)
 * - tapi ketika user "Simpan Foto" => simpan ke localStorage (base64)
 * - update state lokal supaya navbar bisa baca dari localStorage
 */

export default function ProfilePage() {
  const [user, setUser] = useState<{ name: string; email: string; avatar: string }>({
    name: "",
    email: "",
    avatar: "/images/profile.jpg",
  });
  const [loading, setLoading] = useState(true);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  // Utility: konversi file -> base64 data URL
  const fileToDataUrl = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === "string") resolve(reader.result);
        else reject(new Error("Gagal konversi file"));
      };
      reader.onerror = () => reject(new Error("FileReader error"));
      reader.readAsDataURL(file);
    });

  useEffect(() => {
    const token = localStorage.getItem("token");

    // prioritas: jika user sudah menyimpan profil di localStorage -> gunakan itu
    const local = localStorage.getItem("profile");
    if (local) {
      try {
        const p = JSON.parse(local);
        setUser({
          name: p.name || "Pengguna",
          email: p.email || "",
          avatar: p.avatar || "/images/profile.jpg",
        });
        setLoading(false);
        return;
      } catch {
        // jatuhkan ke fetch API jika JSON corrupt
      }
    }

    // fallback: ambil dari API (jika ada token)
    if (!token) {
      setLoading(false);
      return;
    }

    fetch("http://10.93.86.50:3001/api/auth/me", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(async (res) => {
        if (!res.ok) throw new Error("Gagal mengambil profil");
        return res.json();
      })
      .then((data) => {
        const avatarUrl = data.avatar
          ? data.avatar.startsWith("http")
            ? data.avatar
            : `http://10.93.86.50:3001/uploads/${data.avatar}`
          : "/images/profile.jpg";

        setUser({
          name: data.name || "Pengguna",
          email: data.email || "",
          avatar: avatarUrl,
        });
      })
      .catch((err) => {
        console.error("Error ambil profil:", err);
      })
      .finally(() => setLoading(false));
  }, []);

  // Menangani perubahan input file
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;
    setFile(selected);
    setPreview(URL.createObjectURL(selected));
  };

  // Simpan profil (lokal): konversi file ke base64 dan simpan ke localStorage
  const handleSaveLocal = async () => {
    try {
      let avatarData = user.avatar; // default tetap avatar yang ada

      if (file) {
        // convert to base64 data URL
        avatarData = await fileToDataUrl(file);
      }

      // update state lokal
      const newProfile = {
        name: user.name || "Pengguna",
        email: user.email || "",
        avatar: avatarData,
      };
      setUser(newProfile);

      // simpan di localStorage sebagai JSON
      localStorage.setItem("profile", JSON.stringify(newProfile));

      // bersihkan preview/file setelah simpan
      setFile(null);
      setPreview(null);

      // beri notifikasi kecil
      alert("Profil disimpan secara lokal — perubahan langsung muncul di navigasi.");
    } catch (err) {
      console.error("Gagal menyimpan profil secara lokal:", err);
      alert("Terjadi kesalahan saat menyimpan profil (lokal).");
    }
  };

  // Opsional: edit nama inline (bisa kamu ganti dengan form)
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUser((prev) => ({ ...prev, name: e.target.value }));
  };

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    // opsional: hapus profile lokal juga jika mau
    // localStorage.removeItem("profile");
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

        {/* Nama (bisa diedit langsung) */}
        <input
          value={user.name}
          onChange={handleNameChange}
          className="w-full text-center border mb-2 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-200"
          placeholder="Nama Anda"
        />

        <p className="text-gray-500 text-sm mb-6">{user.email}</p>

        {/* Jika ada preview (file baru), tampilkan tombol Simpan Lokal */}
        {preview && (
          <button
            onClick={handleSaveLocal}
            className="w-full bg-blue-600 text-white py-2 rounded-lg mb-4 hover:bg-blue-700 transition-all"
          >
            Simpan Foto & Nama (Lokal)
          </button>
        )}

        {/* Juga sediakan tombol Simpan Nama tanpa upload foto */}
        {!preview && (
          <button
            onClick={handleSaveLocal}
            className="w-full bg-blue-500 text-white py-2 rounded-lg mb-4 hover:bg-blue-600 transition-all"
          >
            Simpan Nama (Lokal)
          </button>
        )}

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
