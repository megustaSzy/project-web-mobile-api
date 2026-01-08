"use client";
import Image from "next/image";

export default function HeroTourSection() {
  return (
    <div className="relative w-full h-107.5 overflow-hidden rounded-b-none shadow-lg">
      {/* Background Image */}
      <Image src="/images/image.png" alt="Hero" fill className="object-cover" />

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40"></div>

      {/* Text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white px-4">
        <h1 className="text-3xl font-semibold mb-2">Daftar Wisata </h1>
        <p className="max-w-xl text-sm opacity-90">
          Jelajahi berbagai destinasi wisata pilihan dari berbagai daerah dan
          temukan pengalaman liburan yang sesuai dengan keinginanmu.
        </p>
      </div>
    </div>
  );
}
