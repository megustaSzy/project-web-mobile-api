"use client";

import React, { useState, useEffect } from "react";
import { MapPin, ChevronDown } from "lucide-react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/helpers/api";
import { ApiCategoryResponse, CategoryItem } from "@/types/category";
import {
  RegionApiResponse,
  Area,
  ReverseGeocodeResponse,
} from "@/types/ChardRegion";

export default function SearchCard() {
  const router = useRouter();

  const [location, setLocation] = useState("Mendeteksi lokasi...");
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [areas, setAreas] = useState<Area[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedArea, setSelectedArea] = useState("");

  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isAreaOpen, setIsAreaOpen] = useState(false);

  /* =======================
     GEOLOCATION
  ======================= */
  useEffect(() => {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;

        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          );

          const data: ReverseGeocodeResponse = await res.json();

          const kecamatan =
            data.address?.city_district ||
            data.address?.suburb ||
            data.address?.village ||
            "Lokasi tidak diketahui";

          const kabupaten =
            data.address?.county || data.address?.city || "";

          const provinsi = data.address?.state || "";

          setLocation(
            `${kecamatan}${kabupaten ? ", " + kabupaten : ""}${
              provinsi ? ", " + provinsi : ""
            }`
          );
        } catch {
          setLocation("Gagal mendeteksi lokasi");
        }
      },
      () => setLocation("Izin lokasi ditolak")
    );
  }, []);

  /* =======================
     LOAD CATEGORIES
  ======================= */
  useEffect(() => {
    async function loadCategories() {
      try {
        const res = await apiFetch<ApiCategoryResponse>("/api/category");
        setCategories(res.data.items);
      } catch (err) {
        console.error("Gagal load kategori:", err);
      }
    }

    loadCategories();
  }, []);

  /* =======================
     LOAD REGIONS
  ======================= */
  useEffect(() => {
    async function loadAreas() {
      try {
        const res = await apiFetch<RegionApiResponse>("/api/region");

        if (res.status === 200 && res.data?.items) {
          setAreas(
            res.data.items.map((item) => ({
              id: item.id,
              nama: item.name,
            }))
          );
        }
      } catch (err) {
        console.error("Gagal load daerah:", err);
      }
    }

    loadAreas();
  }, []);

  /* =======================
     HANDLE SEARCH
  ======================= */
  const handleSearch = () => {
    if (!selectedCategory && !selectedArea) {
      alert("Silakan pilih kategori atau daerah");
      return;
    }

    const params = new URLSearchParams();

    if (selectedCategory) params.append("category", selectedCategory);
    if (selectedArea) params.append("area", selectedArea);

    router.push(`/search?${params.toString()}`);
  };

  /* =======================
     RENDER
  ======================= */
  return (
    <div className="bg-white rounded-[22px] shadow-sm p-6 w-full max-w-5xl mx-auto border border-gray-200">
      {/* HEADER */}
      <div className="border-b pb-3">
        <p className="text-sm text-gray-400">Lokasi Kamu</p>
        <h2 className="text-xl font-semibold text-gray-800">
          {location}
        </h2>
      </div>

      {/* FORM */}
      <div className="mt-5 grid grid-cols-1 md:grid-cols-5 gap-6 items-center">

        {/* KATEGORI */}
        <div className="md:col-span-2">
          <label className="text-xs text-gray-400 mb-1 block">
            Kategori Wisata
          </label>

          <div
            className="relative flex items-center gap-3 rounded-full border border-gray-200 bg-white px-4 py-3
                       hover:border-gray-300 focus-within:border-blue-500
                       focus-within:ring-2 focus-within:ring-blue-100 transition"
            onClick={() => setIsCategoryOpen((p) => !p)}
          >
            <MapPin className="w-4 h-4 text-gray-400 shrink-0" />

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              onBlur={() => setIsCategoryOpen(false)}
              className="w-full bg-transparent text-sm text-gray-800 outline-none appearance-none cursor-pointer pr-6"
            >
              <option value="">Pilih Kategori</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>

            <ChevronDown
              className={`absolute right-4 w-4 h-4 text-gray-400 pointer-events-none transition-transform duration-200 ${
                isCategoryOpen ? "rotate-180" : ""
              }`}
            />
          </div>
        </div>

        {/* DAERAH */}
        <div className="md:col-span-2">
          <label className="text-xs text-gray-400 mb-1 block">
            Daerah
          </label>

          <div
            className="relative flex items-center gap-3 rounded-full border border-gray-200 bg-white px-4 py-3
                       hover:border-gray-300 focus-within:border-blue-500
                       focus-within:ring-2 focus-within:ring-blue-100 transition"
            onClick={() => setIsAreaOpen((p) => !p)}
          >
            <MapPin className="w-4 h-4 text-gray-400 shrink-0" />

            <select
              value={selectedArea}
              onChange={(e) => setSelectedArea(e.target.value)}
              onBlur={() => setIsAreaOpen(false)}
              className="w-full bg-transparent text-sm text-gray-800 outline-none appearance-none cursor-pointer pr-6"
            >
              <option value="">Pilih Daerah</option>
              {areas.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.nama}
                </option>
              ))}
            </select>

            <ChevronDown
              className={`absolute right-4 w-4 h-4 text-gray-400 pointer-events-none transition-transform duration-200 ${
                isAreaOpen ? "rotate-180" : ""
              }`}
            />
          </div>
        </div>

        {/* BUTTON */}
        <button
          onClick={handleSearch}
          className="bg-blue-500 text-white rounded-full py-3 text-sm font-medium
                     hover:bg-blue-600 transition"
        >
          Search
        </button>
      </div>
    </div>
  );
}
