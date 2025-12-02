"use client";
import Image from "next/image";
import { useEffect, useState } from "react";

type SejarahType = {
  title: string;
  content: string;
};

export default function SejarahSection() {
  const [data, setData] = useState<SejarahType | null>(null);

  async function getData() {
    const url = `${process.env.NEXT_PUBLIC_API_URL}/about/history`;

    try {
      const response = await fetch(url, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }

      const result: SejarahType = await response.json();
      setData(result);
    } catch (error) {
      console.error("API ERROR:", error);
    }
  }

  useEffect(() => {
    getData();
  }, []);

  return (
    <section className="relative flex flex-col items-center justify-center overflow-hidden py-20">
      {/* Background gradasi */}
      <div className="absolute inset-0 bg-linear-to-br from-blue-100 via-blue-200 to-blue-300"></div>

      {/* Tekstur garis samar */}
      <div className="absolute inset-0 opacity-20">
        <Image
          src="/images/tekturgaris.svg"
          alt="Tekstur garis"
          fill
          className="object-cover"
        />
      </div>

      {/* Konten utama */}
      <div className="relative z-10 flex flex-col md:flex-row items-center justify-center w-full px-6 md:px-20 gap-10">
        
        {/* Kiri: Teks */}
        <div className="md:w-1/2 max-w-lg">
          <h2 className="text-3xl font-bold mb-4">
            {data?.title ?? "Loading..."}
          </h2>

          <p className="text-gray-700 leading-relaxed whitespace-pre-line">
            {data?.content ?? "Sedang memuat sejarah LamiGo..."}
          </p>
        </div>

        {/* Kanan: Gambar */}
        <div className="md:w-1/2 flex justify-center">
          <div className="w-full max-w-[450px]">
            <Image
              src="/images/16.svg"
              alt="Traveler"
              width={700}
              height={700}
              className="object-contain w-full h-auto"
            />
          </div>
        </div>

      </div>
    </section>
  );
}
