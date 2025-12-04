/* eslint-disable @next/next/no-img-element */
"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { MapPin } from "lucide-react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/helpers/api";
import { ApiDestinationsResponse, DestinationsType } from "@/types/destination";

export default function DestinasiSection() {
  const [data, setData] = useState<DestinationsType[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("");
  const router = useRouter();

  async function getData() {
    setLoading(true);
    try {
      const res = await apiFetch<ApiDestinationsResponse>("/api/destinations");

      console.log("RAW API /destinations:", res);

      const items = res?.data?.items ?? [];

      // Mapping destinasi
      const mapped: DestinationsType[] = items.map((it) => ({
        id: it.id,
        name: it.name ?? "Tanpa Nama",
        imageUrl: it.imageUrl ?? null,
        desc: it.description ?? "Tidak ada deskripsi",
        price: typeof it.price === "number" ? it.price : 0,
        category: it.category?.name ?? "Umum",
      }));

      setData(mapped);

      //  Ambil kategori unik
      const uniqueCategories = Array.from(
        new Set(items.map((it) => it.category?.name ?? "Umum"))
      );

      setCategories(uniqueCategories);

      // Set kategori awal
      if (uniqueCategories.length > 0) {
        setActiveCategory(uniqueCategories[0]);
      }
    } catch (err) {
      console.error("Gagal fetch destinations:", err);
      setData([]);
    } finally {
      setLoading(false);
    }
  }

  console.log("DATA DESTINASI:", `${process.env.NEXT_PUBLIC_API_URL}/${data[0]?.imageUrl}`);

  useEffect(() => {
    getData();
  }, []);

  return (
    <section className="relative w-full bg-linear-to-b from-[#a7c8e7] to-[#f2f6f9] overflow-hidden">
      <img
        src="/images/destinasi.svg"
        alt="Destinasi Background"
        className="absolute inset-0 w-full h-full object-cover opacity-2"
      />

      <div className="relative z-10 max-w-6xl mx-auto px-4 pt-[150px] pb-2.5 text-center">
        <h2 className="text-3xl md:text-4xl font-extrabold mb-8 text-gray-800">
          Tujuan Wisata Favorit
        </h2>

        {/* Kategori Dinamis */}
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

        {/* GRID */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {loading ? (
            <p className="text-center col-span-3 text-gray-600">Loading...</p>
          ) : (
            data
              .filter((d) => d.category === activeCategory)
              .map((d) => (
                <div
                  key={d.id}
                  className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all overflow-hidden"
                >
                  <div className="relative w-full h-48">
                    <img
                      src={d.imageUrl ? process.env.NEXT_PUBLIC_API_URL+d.imageUrl : "/images/default.jpg"}
                      alt={d.name}
                      className="object-cover w-full h-full"
                    />
                  </div>

                  {/* Isi */}
                  <div className="p-5 text-left">
                    <h3 className="text-lg font-semibold text-black mb-1">
                      {d.name}
                    </h3>

                    <div className="flex items-center gap-1 text-gray-500 text-sm mb-2">
                      <MapPin size={14} />
                      <span>{d.category}</span>
                    </div>

                    <p className="text-gray-600 text-sm mb-4">{d.desc}</p>

                    <div className="flex justify-between items-center">
                      <button
                        onClick={() => router.push(`/pesan?id=${d.id}`)}
                        className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-all duration-300"
                      >
                        Pesan Sekarang
                      </button>

                      <p className="text-gray-800 font-medium text-sm">
                        Rp.{Number(d.price).toLocaleString("id-ID")},-
                      </p>
                    </div>
                  </div>
                </div>
              ))
          )}
        </div>
      </div>
    </section>
  );
}
