"use client";



import Image from "next/image";
import { useEffect, useState } from "react";
import { apiGet } from "@/helpers/api";
import type { AboutType } from "@/types/about";

export default function HeroSection() {
  const [data, setData] = useState<AboutType | null>(null);

  useEffect(() => {
    apiGet<AboutType>("/about/history") // misal endpoint backend kamu /about
      .then((res) => setData(res))
      .catch((err) => console.error("Error load about:", err));
  }, []);

  return (
    <div className="relative w-full h-[420px] overflow-hidden rounded-b-none shadow-lg">

      {/* Background Image */}
      <Image
        src={data?.image ?? "/images/boute.jpg"}
        alt="Hero"
        fill
        className="object-cover"
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40"></div>

      {/* Text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white px-4">
        <h1 className="text-3xl font-semibold mb-2">
          {data?.title ?? "About Us"}
        </h1>

        <p className="max-w-xl text-sm opacity-90">
          {data?.description ??
            "Temukan destinasi terbaik, atur perjalanan impianmu, dan pesan tiket dengan mudah"}
        </p>
      </div>
    </div>
  );
}
