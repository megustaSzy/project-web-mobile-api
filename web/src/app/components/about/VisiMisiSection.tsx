/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/helpers/api";
import { ValueItem, ValueType } from "@/types/value";
import { VisionType, VisionData } from "@/types/vision";
import { MissionType, MissionData } from "@/types/mission";

export default function VisionSection() {
  const [vision, setVision] = useState<VisionData | null>(null);
  const [mission, setMission] = useState<MissionData | null>(null);
  const [values, setValues] = useState<ValueItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [, setErrorMsg] = useState<string | null>(null);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "";

  const getData = async (): Promise<void> => {
    setLoading(true);
    setErrorMsg(null);

    try {
      const visionRes = await apiFetch<VisionType>("/api/about");
      if (!visionRes?.data) throw new Error("Format data visi tidak sesuai");
      setVision(visionRes.data);

      const missionRes = await apiFetch<MissionType>("/api/about");
      if (!missionRes?.data) throw new Error("Format data misi tidak sesuai");
      setMission(missionRes.data);

      const valueRes = await apiFetch<ValueType>("/api/about/value");
      if (!valueRes?.data?.items)
        throw new Error("Format data nilai utama tidak sesuai");
      setValues(valueRes.data.items);
    } catch (error) {
      const err = error instanceof Error ? error.message : "Terjadi kesalahan";
      setErrorMsg(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const getImageUrl = (url?: string): string => {
    if (!url) return "/images/default.svg";

    if (url.startsWith("http")) return url;

    // relative path dari BE
    return `${apiUrl.replace(/\/$/, "")}/${url.replace(/^\//, "")}`;
  };

  return (
    <section className="w-full py-20 bg-[linear-gradient(to_bottom,#bfd8f7,#ffffff,#bfd8f7)]">
      <div className="max-w-6xl mx-auto px-6 md:px-10">
        {/* VISI */}
        <div className="mb-16">
          {loading ? (
            <>
              <h2 className="text-4xl font-bold mb-6">Loading...</h2>
              <p className="text-gray-600">Mengambil data visi...</p>
            </>
          ) : (
            <>
              <h2 className="text-4xl font-bold mb-6">Visi</h2>
              <div className="bg-white shadow-md rounded-2xl p-6 md:p-8 border border-gray-100">
                <p className="text-gray-700 leading-relaxed">
                  {vision?.vision}
                </p>
              </div>
            </>
          )}
        </div>

        {/* MISI */}
        <div className="mb-20">
          {!loading && (
            <>
              <h2 className="text-4xl font-bold mb-6">Misi</h2>
              <div className="bg-white shadow-md rounded-2xl p-6 md:p-8 border border-gray-100 space-y-2">
                {mission?.mission.split(". ").map((m: string, i: number) => (
                  <p key={i} className="text-gray-700 leading-relaxed">
                    {m}
                  </p>
                ))}
              </div>
            </>
          )}
        </div>

        {/* NILAI UTAMA */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold">Nilai Utama LamiGo</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {values.map((item) => (
            <div
              key={item.id}
              className="bg-white shadow-md border border-gray-100 rounded-2xl p-6 flex items-start gap-4"
            >
              <img
                src={getImageUrl(item.imageUrl || undefined)}
                alt={item.header}
                className="w-20 h-20 object-contain"
              />

              <div>
                <h1 className="font-semibold text-lg">{item.header}</h1>
                <p className="text-lg">{item.name}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
