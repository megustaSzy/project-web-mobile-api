"use client";
import { useState } from "react";
import Image from "next/image";
import { MapPin } from "lucide-react";

const categories = ["Pantai", "Pulau", "Gunung", "Air Terjun", "Bukit"];

const destinations = [
  {
    id: 1,
    name: "Rio The Beach",
    location: "Kalianda",
    image: "/images/hero1.jpg",
    desc: "Pantai Rio The Beach menghadirkan keindahan pasir putih dan ombak tenang, cocok untuk bersantai dan menikmati suasana laut.",
    price: 120000,
    category: "Pantai",
  },
  {
    id: 2,
    name: "Senaya Beach",
    location: "Kalianda",
    image: "/images/hero2.jpg",
    desc: "Senaya Beach menawarkan panorama laut biru dan angin sejuk, tempat ideal untuk bersantai dan menikmati keindahan alam.",
    price: 120000,
    category: "Pantai",
  },
  {
    id: 3,
    name: "Green Elty Krakatoa",
    location: "Kalianda",
    image: "/images/hero3.jpg",
    desc: "Green Elty Krakatoa menyajikan pemandangan laut yang menakjubkan dengan suasana tenang dan fasilitas nyaman untuk berlibur.",
    price: 120000,
    category: "Pantai",
  },
];

export default function DestinasiSection() {
  const [activeCategory, setActiveCategory] = useState("Pantai");
  const [clickedId, setClickedId] = useState(null);

  return (
    <section className="relative w-full bg-gradient-to-b from-[#a7c8e7] to-[#f2f6f9] overflow-hidden">
      {/* Background Gambar SVG */}
      <img
        src="/images/destinasi.svg"
        alt="Destinasi Background"
        className="absolute inset-0 w-full h-full object-cover opacity-1"
      />

      {/* Konten Utama */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 py-40 text-center">
        {/* Judul */}
        <h2 className="text-3xl md:text-4xl font-extrabold mb-8 text-gray-800">
          Tujuan Wisata Favorit
        </h2>

        {/* Kategori Filter */}
        <div className="flex justify-center flex-wrap gap-4 md:gap-8 mb-12">
          {categories.map((cat) => {
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-8 py-2 rounded-full border text-sm font-medium transition-all duration-300 ${
                  isActive
                    ? "bg-blue-500 border-blue-500 text-white shadow-md scale-105"
                    : "bg-white border-gray-300 text-gray-700 hover:bg-blue-100 hover:border-blue-400 hover:text-blue-600"
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Grid Kartu Destinasi */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {destinations
            .filter((d) => d.category === activeCategory)
            .map((d) => (
              <div
                key={d.id}
                className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all overflow-hidden"
              >
                {/* Gambar */}
                <div className="relative w-full h-48">
                  <Image
                    src={d.image}
                    alt={d.name}
                    fill
                    className="object-cover"
                  />
                </div>

                {/* Isi Kartu */}
                <div className="p-5 text-left">
                  <h3 className="text-lg font-semibold text-black mb-1">
                    {d.name}
                  </h3>
                  <div className="flex items-center gap-1 text-gray-500 text-sm mb-2">
                    <MapPin size={14} />
                    <span>{d.location}</span>
                  </div>
                  <p className="text-gray-600 text-sm mb-4">{d.desc}</p>

                  <div className="flex justify-between items-center">
                    <button
                      onClick={() =>
                        setClickedId(clickedId === d.id ? null : d.id)
                      }
                      className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                        clickedId === d.id
                          ? "bg-black text-white hover:bg-gray-900 scale-105"
                          : "bg-blue-600 text-white hover:bg-blue-700"
                      }`}
                    >
                      Pesan Sekarang
                    </button>
                    <p className="text-gray-800 font-medium text-sm">
                      Rp.{d.price.toLocaleString("id-ID")},-
                    </p>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </section>
  );
}
