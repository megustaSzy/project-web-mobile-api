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
    <section className="w-full py-24 bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-6xl mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-extrabold mb-8 text-gray-800">
          Tujuan Wisata Favorit
        </h2>

       {/* Kategori Filter */}
<div className="flex justify-center flex-wrap gap-3 mb-12">
  {categories.map((cat) => {
    const isActive = activeCategory === cat;
    return (
      <button
        key={cat}
        onClick={() => setActiveCategory(cat)}
        className={`px-5 py-2 rounded-full border text-sm font-medium transition-all duration-300
          ${
            isActive
              ? "bg-blue-600 border-blue-600 text-white shadow-md scale-105"
              : "bg-white border-gray-300 text-gray-700 hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50"
          }`}
      >
        {cat}
      </button>
    );
  })}
</div>


             {/* Daftar Kartu */}
        <div className="grid gap-6 md:grid-cols-3">
          {destinations
            .filter((d) => d.category === activeCategory)
            .map((d) => (
              <div
                key={d.id}
                className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all overflow-hidden"
              >
                <div className="relative w-full h-48">
                  <Image src={d.image} alt={d.name} fill className="object-cover" />
                </div>

                <div className="p-5 text-left">
                  <h3 className="text-lg font-semibold text-black mb-1">{d.name}</h3>
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
