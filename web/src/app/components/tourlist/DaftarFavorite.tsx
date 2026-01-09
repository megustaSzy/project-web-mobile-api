"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { apiFetch } from "@/helpers/api";
import { RegionApiResponse, RegionItem } from "@/types/region";
import { DestinationsType, ApiDestinationsResponse } from "@/types/destination";
import { ArrowRight } from "lucide-react";

export default function DaftarFavorite() {
  const [regions, setRegions] = useState<RegionItem[]>([]);
  const [destinations, setDestinations] = useState<DestinationsType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const regionRes = await apiFetch<RegionApiResponse>("/api/region");
        setRegions(regionRes.data.items);

        const destRes = await apiFetch<ApiDestinationsResponse>(
          "/api/destinations"
        );
        setDestinations(
          destRes.data.items.map((item) => ({
            id: item.id,
            name: item.name,
            imageUrl: item.imageUrl,
            description: item.description ?? "",
            price: item.price,
            include: item.include,
            ketentuan: item.ketentuan,
            perhatian: item.perhatian,
            category: item.category,
            region: item.region,
          }))
        );
      } catch (error) {
        console.error("Gagal mengambil data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Hitung jumlah destinasi per region
  const regionCounts: Record<number, number> = {};
  destinations.forEach((dest) => {
    const regionId = dest.region.id;
    regionCounts[regionId] = (regionCounts[regionId] || 0) + 1;
  });

  return (
    <section className="w-full min-h-screen bg-linear-to-b from-[#a7c8e7] to-white px-6 py-20">
      <h1 className="text-center text-3xl font-semibold mb-10 font-poppins">
        Tujuan Wisata Favorit
      </h1>

      {loading ? (
        <p className="text-center text-gray-500 font-poppins">Memuat data...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {regions.map((item) => (
            <div
              key={item.id}
              className="relative bg-white rounded-xl shadow-md p-3 flex flex-col gap-1
             cursor-pointer transition-transform duration-300 ease-in-out
             hover:scale-105 hover:shadow-lg font-poppins"
            >
              <div className="flex justify-between items-center">
                {/* Logo / Image */}
                <Image
                  src={item.imageUrl || "/images/fallback.png"}
                  alt={item.name}
                  width={40}
                  height={40}
                  className="ml-4"
                />

                {/* Jumlah destinasi */}
                <div className="text-right">
                  <span className="text-lg font-bold text-yellow-500">
                    {regionCounts[item.id] ?? 0}
                  </span>
                  <div className="text-[10px] text-gray-400">Destinasi</div>
                </div>
              </div>

              {/* Judul */}
              <h2 className="font-semibold text-gray-900 text-lg mt-1 truncate">
                {item.name}
              </h2>

              {/* Deskripsi */}
              <p className="text-sm text-gray-600 mt-1">
                Temukan berbagai destinasi wisata di <br />
                <span className="text-sm text-gray-600">{item.name}</span>
              </p>

              {/* Link */}
              <div className="flex justify-end mt-1">
                <Link
                  href={`/detailtour?kabupaten=${encodeURIComponent(
                    item.name
                  )}`}
                  className="group inline-flex items-center gap-1 text-blue-500 font-medium text-sm hover:underline"
                >
                  Lihat Wisata
                  <ArrowRight
                    size={16}
                    className="transition-transform duration-200 group-hover:translate-x-1 hover:bg-blue-50"
                  />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
