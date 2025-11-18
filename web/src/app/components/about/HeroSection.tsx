"use client";
import Image from "next/image";

export default function HeroSection() {
  return (
    <div className="relative w-full h-[420px] overflow-hidden rounded-b-[0px] shadow-lg">
      {/* Background Image */}
      <Image 
        src="/images/boute.jpg  "
        alt="Hero"
        fill
        className="object-cover"
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40"></div>

      {/* Text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white px-4">
        <h1 className="text-3xl font-semibold mb-2">About Us</h1>
        <p className="max-w-xl text-sm opacity-90">
          Temukan destinasi terbaik, atur perjalanan impianmu, dan pesan tiket
          dengan mudah dalam satu aplikasi lengkap untuk semua kebutuhan liburan
        </p>
      </div>
    </div>
  );
}
