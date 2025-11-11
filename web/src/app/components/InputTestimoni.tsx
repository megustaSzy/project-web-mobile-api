"use client";
import Image from "next/image";

export default function CeritaPage() {
  return (
    <section className="relative flex flex-col items-center justify-center min-h-screen overflow-hidden">
      {/* Background gradasi */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-100 via-blue-200 to-blue-300"></div>

      {/* Tekstur garis samar */}
      <div className="absolute inset-0 opacity-20">
        <Image
          src="/images/tekturgaris.svg"
          alt="Tekstur garis"
          fill
          className="object-cover"
        />
      </div>

      {/* Judul & deskripsi di tengah atas */}
      <div className="relative z-10 text-center mb-10 px-6">
        <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900">
          Ceritakan Momen Serumumu
        </h2>
        <p className="text-gray-600 text-sm md:text-base mt-2">
          Bagikan pengalaman bahagiamu bersama{" "}
          <span className="font-semibold text-blue-600">LamiGo</span> dan bantu
          wisatawan lain menemukan perjalanan terbaik.
        </p>
      </div>

      {/* Konten utama (form kiri & gambar kanan) */}
      <div className="relative z-10 flex flex-col md:flex-row items-center justify-center w-full px-6 md:px-20 space-y-8 md:space-y-0 md:space-x-10">
        {/* Kiri: Form */}
        <div className="w-full md:w-1/2 flex flex-col items-center text-center space-y-6">
          <form className="w-full max-w-md space-y-4">
            <input
              type="text"
              placeholder="Nama"
              className="w-full p-3 rounded-lg border border-gray-300 bg-white focus:ring-2 focus:ring-blue-400"
            />
            <input
              type="text"
              placeholder="Pekerjaan"
              className="w-full p-3 rounded-lg border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <textarea
              placeholder="Komentar"
              rows={4}
              className="w-full p-3 rounded-lg border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-400"
            ></textarea>
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition"
            >
              Kirim
            </button>
          </form>
        </div>

        {/* Kanan: Gambar orang */}
        <div className="w-full md:w-1/2 flex justify-center relative">
          <Image
            src="/images/test.png"
            alt="Traveler"
            width={400}
            height={400}
            className="object-contain"
          />
        </div>
      </div>
    </section>
  );
}
