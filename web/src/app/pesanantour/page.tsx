"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";
import Image from "next/image";
import { wisataByKabupaten } from "@/app/data/wisata";
import { MapPin } from "lucide-react";

const categories = ["Pantai", "Pulau", "Gunung", "Air Terjun", "Bukit"];

export default function PesananTourPage() {
  const params = useSearchParams();
  const router = useRouter();

  // 🔥 DEKLARASI DULU BARU DIPAKAI
  const selectedKabupaten = params.get("kabupaten") ?? "";

  const [selectedCategory, setSelectedCategory] = useState("Pantai");

  if (!selectedKabupaten) {
    return (
      <p className="text-center text-red-500 font-semibold py-20">
        ❗ Tidak ada kabupaten dipilih, kembali ke halaman sebelumnya.
      </p>
    );
  }

  // 🔥 HANYA ADA 1 FIND, BUKAN 2
  const kabupatenData = wisataByKabupaten.find((item) =>
    selectedKabupaten.toLowerCase().includes(item.kabupaten.toLowerCase())
  );

  if (!kabupatenData) {
    return (
      <p className="text-center text-red-500 font-semibold py-20">
        ❗ Tidak ada data wisata untuk: <b>{selectedKabupaten}</b>
      </p>
    );
  }

  const filteredDestinasi = kabupatenData.destinasi.filter(
    (d) => d.kategori.toLowerCase() === selectedCategory.toLowerCase()
  );

  return (
    <section className="min-h-screen px-6 py-16 bg-gradient-to-b from-[#a7c8e7] to-white">
      <h1 className="text-center text-3xl font-bold mb-10 text-gray-800">
        Tujuan Wisata Favorit di {kabupatenData.kabupaten}
      </h1>

      {/* FILTER BUTTON */}
      <div className="flex justify-center gap-3 mb-10 flex-wrap">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-6 py-2 rounded-full text-sm font-medium shadow-md transition ${
              selectedCategory === cat
                ? "bg-blue-500 text-white"
                : "bg-white hover:bg-blue-100"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* LIST DESTINASI */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7 max-w-7xl mx-auto">
        {filteredDestinasi.length === 0 ? (
          <p className="text-center text-gray-600 col-span-3">
            Tidak ada destinasi kategori <b>{selectedCategory}</b>
          </p>
        ) : (
          filteredDestinasi.map((dest, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-md overflow-hidden"
            >
              <Image
                src={`/images/${dest.image ?? "hero1.png"}`}
                alt={dest.name}
                width={400}
                height={240}
                className="w-full h-48 object-cover"
              />

              <div className="p-4 space-y-2">
                <h2 className="font-bold text-lg text-gray-800">{dest.name}</h2>

                <p className="flex items-center gap-1 text-gray-600 text-sm">
                  <MapPin size={16} /> {kabupatenData.kabupaten}
                </p>

                <p className="text-gray-600 text-sm">{dest.deskripsi ?? "-"}</p>

                <div className="flex justify-between items-center mt-3">
                  <button
                    className="bg-blue-500 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-600 transition"
                    onClick={() =>
                      router.push(`/pesan?nama=${encodeURIComponent(dest.name)}`)

                    }
                  >
                    Pesan Sekarang
                  </button>

                  <p className="font-semibold text-gray-800 text-sm">
                    Rp{dest.harga}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
