"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import type { AboutType } from "@/types/about";

export default function HeroSection() {
  const [data, setData] = useState<AboutType | null>(null);

  const BASE_URL = process.env.NEXT_PUBLIC_API_URL as string;

  const getData = async () => {
    try {
      const res = await fetch(`${BASE_URL}/about/history`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-store", // biar gak ke-cache di Next.js
      });

      if (!res.ok) {
        throw new Error("Failed to fetch about data");
      }

      const json: AboutType = await res.json();
      setData(json);

    } catch (err) {
      console.error("Fetch Error:", err);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  // Pastikan image URL benar
  const imageURL = data?.image
    ? data.image.startsWith("http")
      ? data.image
      : `${BASE_URL}/uploads/about/${data.image}`
    : "/images/boute.jpg";

  return (
    <div className="relative w-full h-[420px] overflow-hidden shadow-lg rounded-b-none">
      {/* Background Image */}
      <Image
        src={imageURL}
        alt={data?.title ?? "Hero Image"}
        fill
        className="object-cover"
        priority
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40"></div>

      {/* Text Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white px-4">
        <h1 className="text-3xl font-semibold mb-2">
          {data?.title ?? "About Us"}
        </h1>

        <p className="max-w-xl text-sm opacity-90">
          {data?.description ??
            "Temukan destinasi terbaik, atur perjalanan impianmu, dan pesan tiket dengan mudah."}
        </p>
      </div>
    </div>
  );
}
