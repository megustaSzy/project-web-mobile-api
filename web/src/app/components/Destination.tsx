/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useEffect } from "react";
import { MapPin } from "lucide-react";
import { apiFetch } from "@/helpers/api";
import { ApiDestinationsResponse, DestinationsType } from "@/types/destination";
import { ApiCategoryResponse, CategoryItem } from "@/types/category";
import DestinationModal from "./DestinationModal";

/* =======================
   REGION TYPE
======================= */
type RegionItem = {
  id: number;
  name: string;
};

type ApiRegionResponse = {
  status: number;
  data: RegionItem[];
};

export default function DestinasiSection() {
  const [data, setData] = useState<DestinationsType[]>([]);
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [regions, setRegions] = useState<RegionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string>("");

  /* =======================
     MODAL STATE
  ======================= */
  const [openModal, setOpenModal] = useState(false);
  const [selectedData, setSelectedData] = useState<DestinationsType | null>(
    null
  );

  /* =======================
     LOAD CATEGORY
  ======================= */
  async function loadCategories() {
    try {
      const res = await apiFetch<ApiCategoryResponse>("/api/category");
      setCategories(res.data.items);

      if (res.data.items.length > 0) {
        setActiveCategory(res.data.items[0].name);
      }
    } catch (err) {
      console.error("Gagal fetch kategori:", err);
      setCategories([]);
    }
  }

  /* =======================
     LOAD REGION
  ======================= */
  async function loadRegions() {
    try {
      const res = await apiFetch<ApiRegionResponse>("/api/region/regencies/19");
      setRegions(res.data ?? []);
    } catch (err) {
      console.error("Gagal fetch region:", err);
      setRegions([]);
    }
  }

  /* =======================
     LOAD DESTINATIONS
  ======================= */ async function loadDestinations() {
    setLoading(true);
    try {
      const res = await apiFetch<ApiDestinationsResponse>("/api/destinations");

      const items = res.data.items;

      const mapped: DestinationsType[] = items.map((it) => ({
        id: it.id,
        name: it.name ?? "Tanpa Nama",
        imageUrl: it.imageUrl,
        description: it.description ?? "Deskripsi belum tersedia",
        price: it.price,
        include: it.include ?? [],
        ketentuan: it.ketentuan ?? [],
        perhatian: it.perhatian ?? [],
        category: {
          id: it.category.id,
          name: it.category.name,
        },
        region: it.region ?? "Tidak diketahui",
      }));

      setData(mapped);
    } catch (err) {
      console.error("Gagal fetch destinasi:", err);
      setData([]);
    } finally {
      setLoading(false);
    }
  }

  /* =======================
     EFFECT
  ======================= */
  useEffect(() => {
    loadCategories();
    loadRegions();
  }, []);

  useEffect(() => {
    if (regions.length > 0) {
      loadDestinations();
    }
  }, [regions]);

  /* =======================
     RENDER
  ======================= */
  return (
    <section className="relative w-full bg-linear-to-b from-[#a7c8e7] to-[#f2f6f9] overflow-hidden">
      <img
        src="/images/destinasi.svg"
        alt="Background"
        className="absolute inset-0 w-full h-full object-cover opacity-5"
      />

      <div className="relative z-10 max-w-6xl mx-auto px-4 pt-[150px] pb-10 text-center">
        <h2 className="text-3xl md:text-4xl font-extrabold mb-8 text-gray-800">
          Tujuan Wisata Favorit
        </h2>

        {/* =======================
            CATEGORY
        ======================= */}
        <div className="flex justify-center flex-wrap gap-4 mb-12">
          {categories.map((cat) => {
            const active = activeCategory === cat.name;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.name)}
                className={`px-6 py-2 rounded-full border text-sm font-medium transition ${
                  active
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-blue-50"
                }`}
              >
                {cat.name}
              </button>
            );
          })}
        </div>

        {/* =======================
            GRID
        ======================= */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {loading ? (
            <p className="col-span-3 text-gray-500">Loading...</p>
          ) : (
            data
              .filter((d) => d.category.name === activeCategory)
              .map((d) => (
                <div
                  key={d.id}
                  className="bg-white rounded-2xl shadow-md hover:shadow-xl transition overflow-hidden"
                >
                  <div className="h-48">
                    <img
                      src={
                        d.imageUrl
                          ? process.env.NEXT_PUBLIC_API_URL + d.imageUrl
                          : "/images/default.jpg"
                      }
                      alt={d.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="p-5 text-left">
                    <h3 className="font-semibold text-lg mb-1">{d.name}</h3>

                    <div className="flex items-center gap-1 text-sm text-gray-500 mb-3">
                      <MapPin size={14} />
                      <span>{d.region}</span>
                    </div>

                    <div className="flex justify-end">
                      <span
                        onClick={() => {
                          setSelectedData(d);
                          setOpenModal(true);
                        }}
                        className="text-blue-600 text-sm cursor-pointer hover:underline"
                      >
                        Detail
                      </span>
                    </div>
                  </div>
                </div>
              ))
          )}
        </div>
      </div>

      {/* =======================
          MODAL DETAIL
      ======================= */}
      <DestinationModal
        open={openModal}
        data={selectedData}
        onClose={() => setOpenModal(false)}
      />
    </section>
  );
}
