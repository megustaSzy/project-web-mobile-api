/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useEffect, useState } from "react";
import { apiFetch } from "@/helpers/api";
import { ValueItem, ValueType } from "@/types/value";
import { VisionType } from "@/types/vision";
import { MissionType } from "@/types/mission";
import { Skeleton } from "@/components/ui/skeleton";

function VisionSkeleton() {
  return (
    <>
      <Skeleton className="h-10 w-32 mb-6" />
      <div className="bg-white shadow-md rounded-2xl p-6 md:p-8 border border-gray-100 space-y-3">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-11/12" />
        <Skeleton className="h-4 w-10/12" />
      </div>
    </>
  );
}
function MissionSkeleton() {
  return (
    <>
      <Skeleton className="h-10 w-32 mb-6" />
      <div className="bg-white shadow-md rounded-2xl p-6 md:p-8 border border-gray-100 space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-4 w-full" />
        ))}
      </div>
    </>
  );
}
function ValueSkeleton() {
  return (
    <div className="bg-white shadow-md border border-gray-100 rounded-2xl p-6 flex items-start gap-4">
      <Skeleton className="w-20 h-20 rounded-md" />
      <div className="space-y-2 flex-1">
        <Skeleton className="h-5 w-1/2" />
        <Skeleton className="h-4 w-3/4" />
      </div>
    </div>
  );
}

export default function VisionSection() {
  const [data, setData] = useState<VisionType | null>(null);
  const [value, setValue] = useState<ValueItem[]>([]);
  const [mission, setMission] = useState<MissionType | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [, setErrorMsg] = useState<string | null>(null);

  async function getData(): Promise<void> {
    setLoading(true);
    setErrorMsg(null);

    try {
      // GET VISI MISI
      const result = await apiFetch<VisionType>("/api/about");
      if (!result?.data) throw new Error("Format data visi tidak sesuai.");
      setData(result);

      // GET MISI
      const missionResult = await apiFetch<MissionType>("/api/about");
      if (!missionResult?.data)
        throw new Error("Format data misi tidak sesuai.");
      setMission(missionResult);

      // GET NILAI UTAMA
      const valueResult = await apiFetch<ValueType>("/api/about/value");
      if (!valueResult?.data?.items) {
        throw new Error("Format data nilai utama tidak sesuai.");
      }
      setValue(valueResult.data.items);
    } catch (error) {
      const err = error instanceof Error ? error.message : "Terjadi kesalahan";
      setErrorMsg(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getData();
  }, []);

  return (
    <section className="w-full py-20 bg-[linear-gradient(to_bottom,#bfd8f7,#ffffff,#bfd8f7)]">
      <div className="max-w-6xl mx-auto px-6 md:px-10">
        {/* VISI */}
        <div className="mb-16">
          <div className="mb-16">
            {loading ? (
              <VisionSkeleton />
            ) : (
              <>
                <h2 className="text-4xl font-bold mb-6">Visi</h2>
                <div className="bg-white shadow-md rounded-2xl p-6 md:p-8 border border-gray-100">
                  <p className="text-gray-700 leading-relaxed">
                    {data?.data.vision}
                  </p>
                </div>
              </>
            )}
          </div>
        </div>

        {/* MISI */}
        <div className="mb-20">
          <div className="mb-20">
            {loading ? (
              <MissionSkeleton />
            ) : (
              <>
                <h2 className="text-4xl font-bold mb-6">Misi</h2>
                <div className="bg-white shadow-md rounded-2xl p-6 md:p-8 border border-gray-100 space-y-2">
                  {mission?.data.mission.split(". ").map((m, i) => (
                    <p key={i} className="text-gray-700 leading-relaxed">
                      {m}
                    </p>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
        {/* NILAI UTAMA */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold">Nilai Utama LamiGo</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => <ValueSkeleton key={i} />)
          ) : value.length === 0 ? (
            <ValueSkeleton />
          ) : (
            value.map((item) => {
              const apiUrl = process.env.NEXT_PUBLIC_API_URL || "";
              const imageSrc = item.imageUrl
                ? `${apiUrl.replace(/\/$/, "")}${item.imageUrl}`
                : "/images/default.svg";

              return (
                <div
                  key={item.id}
                  className="bg-white shadow-md border border-gray-100 rounded-2xl p-6 flex items-start gap-4"
                >
                  <img
                    src={imageSrc}
                    alt={item.header}
                    className="w-20 h-20 object-contain"
                  />

                  <div>
                    <h1 className="font-semibold text-lg">{item.header}</h1>
                    <p className="text-lg">{item.name}</p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </section>
  );
}
