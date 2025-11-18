"use client";
import Image from "next/image";
import { useState } from "react";            // 🔹 TAMBAH
import { StarIcon } from "lucide-react";         // 🔹 TAMBAH (icon bintang)
import { StarHalf } from "lucide-react";
export default function CeritaPage() {
  const [rating, setRating] = useState(0);   // 🔹 STATE RATING

  return (
    <section className="relative flex flex-col items-center justify-center min-h-screen overflow-hidden pb-32">
      {/* Background gradasi */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-100 via-blue-200 to-blue-300"></div>

      {/* Tekstur garis samar */}
      <div className="absolute inset-0 opacity-20">
        <Image src="/images/tekturgaris.svg" alt="Tekstur garis" fill className="object-cover" />
      </div>

      {/* Judul */}
      <div className="relative z-10 text-center mb-10 px-6 pt-28">
        <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900">Ceritakan Momen Serumumu</h2>
        <p className="text-gray-600 text-sm md:text-base mt-2">
          Bagikan pengalaman bahagiamu bersama{" "}
          <span className="font-semibold text-blue-600">LamiGo</span> dan bantu wisatawan lain menemukan perjalanan terbaik.
        </p>
      </div>

      {/* Konten utama */}
      <div className="relative z-10 flex flex-col md:flex-row items-center justify-center w-full px-6 md:px-20 space-y-8 md:space-y-0 md:space-x-10">

        {/* FORM */}
        <div className="w-full md:w-1/2 flex flex-col items-center text-center space-y-6">

          <form className="w-full max-w-md space-y-4">

            <input type="text" placeholder="Nama" className="w-full p-3 rounded-lg border border-gray-300 bg-white focus:ring-2 focus:ring-blue-400" />

            <input type="text" placeholder="Status" className="w-full p-3 rounded-lg border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-400" />

            <textarea placeholder="Komentar" rows={4} className="w-full p-3 rounded-lg border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-400"></textarea>


{/* ⭐⭐⭐⭐⭐ RATING SECTION (CLEAN UI) */}
<div className="bg-white shadow-md rounded-xl p-5 mt-0 w-full border border-gray-200">

  <div className="flex gap-2 justify-center md:justify-start">
    {[1, 2, 3, 4, 5].map((value) => {
      const full = value <= rating;
      const half = rating + 0.5 === value;

      return (
        <div
          key={value}
          className="relative cursor-pointer transition-all hover:scale-110"
          onClick={() =>
            setRating(
              value === rating ? value - 0.5 : value === rating + 0.5 ? value : value
            )
          }
          onContextMenu={(e) => {
            e.preventDefault();
            setRating(value - 0.5);
          }}
        >
          {/* Base star */}
          <StarIcon size={32} className="text-gray-300" />

          {/* Full star */}
          {full && (
            <StarIcon
              size={32}
              className="absolute top-0 left-0 text-yellow-400 fill-yellow-400"
            />
          )}

          {/* Half star */}
          {half && (
            <StarIcon
              size={32}
              className="absolute top-0 left-0 text-yellow-400 fill-yellow-400"
              style={{ clipPath: "inset(0 50% 0 0)" }}
            />
          )}
        </div>
      );
    })}
  </div>

  <p className="text-xs text-gray-500 mt-2">
    {rating > 0
      ? ` Rating kamu: ${rating} / 5`
      : "Klik untuk rating • Klik kanan = setengah bintang"}
  </p>
</div>



            <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition">
              Kirim
            </button>
          </form>
        </div>

        {/* GAMBAR */}
        <div className="w-full md:w-1/2 flex justify-center relative">
          <Image src="/images/test.png" alt="Traveler" width={700} height={700} className="object-contain" />
        </div>

      </div>
    </section>
  );
}
