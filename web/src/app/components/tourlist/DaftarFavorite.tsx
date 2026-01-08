"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { apiFetch } from "@/helpers/api";
import { RegionApiResponse, RegionItem } from "@/types/region";

export default function DaftarFavorite() {
  const [regions, setRegions] = useState<RegionItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRegions = async () => {
      try {
        const res = await apiFetch<RegionApiResponse>("/api/region");
        setRegions(res.data.items);
      } catch (error) {
        console.error("Gagal mengambil data region:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRegions();
  }, []);

  return (
    <section className="w-full min-h-screen bg-linear-to-b from-[#a7c8e7] to-white px-6 py-20">
      <h1 className="text-center text-3xl font-semibold mb-10">
        Tujuan Wisata Favorit
      </h1>

      {loading ? (
        <p className="text-center text-gray-500">Memuat data...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {regions.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl shadow-md px-5 py-6 flex gap-4 items-start"
            >
              <Image
  src={item.imageUrl || "/images/fallback.png"}
  alt={item.name}
  width={70}
  height={70}
  className="rounded-md object-cover"
/>


              <div className="flex flex-col gap-1">
                <h2 className="font-semibold text-gray-800">{item.name}</h2>

                <p className="text-sm text-gray-500">
                  Temukan berbagai destinasi wisata di {item.name}
                </p>

                <Link
                  href={`/pesanantour?kabupaten=${encodeURIComponent(
                    item.name
                  )}`}
                  className="text-blue-500 font-medium text-sm hover:underline"
                >
                  Lihat Detail
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
