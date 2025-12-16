"use client";

import React, { useState, useEffect } from "react";
import { MapPin, ChevronDown } from "lucide-react";
import { apiFetch } from "@/helpers/api";
import { ApiCategoryResponse, CategoryItem } from "@/types/category";
import { RegionApiResponse, Area, ReverseGeocodeResponse } from "@/types/region";

/* =======================
   COMPONENT
======================= */
export default function SearchCard() {
  const [location, setLocation] = useState("Mendeteksi lokasi...");
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [areas, setAreas] = useState<Area[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedArea, setSelectedArea] = useState("");

  // Arrow rotation
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isAreaOpen, setIsAreaOpen] = useState(false);

  /* =======================
     GEOLOCATION
  ======================= */
  useEffect(() => {
    if (typeof window === "undefined" || !navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;

        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          );

          const data: ReverseGeocodeResponse = await res.json();

          const city =
            data.address?.city ||
            data.address?.town ||
            data.address?.village ||
            "Lokasi tidak diketahui";

          const state = data.address?.state || "";

          setLocation(`${city}${state ? ", " + state : ""}`);
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
        const res = await fetch(
          "http://192.168.100.141:3001/api/region"
        );

        const json: RegionApiResponse = await res.json();

        if (json.status === 200 && json.data?.items) {
          const formatted: Area[] = json.data.items.map((item) => ({
            id: item.id,
            nama: item.name,
          }));

          setAreas(formatted);
        } else {
          setAreas([]);
        }
      } catch (error) {
        console.error("Gagal load daftar daerah:", error);
        setAreas([]);
      }
    }

    loadAreas();
  }, []);

  /* =======================
     RENDER
  ======================= */
  return (
    <div className="bg-white rounded-[22px] shadow-sm p-6 w-full max-w-5xl mx-auto border border-gray-200">
      {/* HEADER */}
      <div className="flex items-center justify-between border-b pb-3">
        <div>
          <p className="text-sm text-gray-400">Lokasi Kamu</p>
          <h2 className="text-xl font-semibold text-gray-800">
            {location}
          </h2>
        </div>
      </div>

      {/* FORM */}
      <div className="mt-5 grid grid-cols-1 md:grid-cols-5 gap-6 items-center">
        {/* KATEGORI */}
        <div className="md:col-span-2 flex flex-col">
          <label className="text-xs text-gray-400 mb-1">
            Kategori Wisata
          </label>

          <div
            className="flex items-center gap-2 border border-gray-300 rounded-full px-4 py-2 bg-white relative"
            onClick={() => setIsCategoryOpen((p) => !p)}
          >
            <MapPin className="text-gray-500 w-4 h-4" />

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              onBlur={() => setIsCategoryOpen(false)}
              className="text-gray-700 text-sm bg-transparent outline-none w-full appearance-none"
            >
              <option value="">Pilih Kategori</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id.toString()}>
                  {cat.name}
                </option>
              ))}
            </select>

            <ChevronDown
              className={`w-4 h-4 absolute right-4 text-gray-500 transition-transform ${
                isCategoryOpen ? "rotate-180" : ""
              }`}
            />
          </div>
        </div>

        {/* DAERAH */}
        <div className="md:col-span-2 flex flex-col">
          <label className="text-xs text-gray-400 mb-1">
            Daerah
          </label>

          <div
            className="flex items-center gap-2 border border-gray-300 rounded-full px-4 py-2 bg-white relative"
            onClick={() => setIsAreaOpen((p) => !p)}
          >
            <MapPin className="text-gray-500 w-4 h-4" />

            <select
              value={selectedArea}
              onChange={(e) => setSelectedArea(e.target.value)}
              onBlur={() => setIsAreaOpen(false)}
              className="text-gray-700 text-sm bg-transparent outline-none w-full appearance-none"
            >
              <option value="">Pilih Daerah</option>
              {areas.map((a) => (
                <option key={a.id} value={a.id.toString()}>
                  {a.nama}
                </option>
              ))}
            </select>

            <ChevronDown
              className={`w-4 h-4 absolute right-4 text-gray-500 transition-transform ${
                isAreaOpen ? "rotate-180" : ""
              }`}
            />
          </div>
        </div>

        {/* BUTTON */}
        <div className="flex flex-col justify-end">
          <label className="text-xs text-transparent mb-1">.</label>

          <button
            className="
              bg-blue-500 text-white
              px-5 py-2.5 rounded-full text-sm
              font-medium shadow-sm
              hover:bg-blue-600
              active:scale-95 transition-all
              w-full
            "
          >
            Search
          </button>
        </div>
      </div>
    </div>
  );
}
