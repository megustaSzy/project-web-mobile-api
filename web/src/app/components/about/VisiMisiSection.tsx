/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useEffect, useState } from "react";
import { apiGet } from "@/helpers/api";

type VisiMisiType = {
  visi: string;
  misi: string[];
};

export default function VisiMisiSection() {
  const [data, setData] = useState<VisiMisiType | null>(null);

  useEffect(() => {
    apiGet<VisiMisiType>("/about/visimisi").then(setData);
  }, []);

  return (
    <section className="w-full py-20 bg-[linear-gradient(to_bottom,#bfd8f7,#ffffff,#bfd8f7)]">
      <div className="max-w-6xl mx-auto px-6 md:px-10">
        
        {/* Visi */}
        <div className="mb-16">
          <h2 className="text-4xl font-bold mb-6">Visi</h2>
          <div className="bg-white shadow-md rounded-2xl p-6 md:p-8 border border-gray-100">
            <p className="text-gray-700 leading-relaxed">
              {data?.visi}
            </p>
          </div>
        </div>

        {/* Misi */}
        <div className="mb-20">
          <h2 className="text-4xl font-bold mb-6">Misi</h2>
          <div className="bg-white shadow-md rounded-2xl p-6 md:p-8 border border-gray-100 space-y-2">
            {data?.misi?.map((m, i) => (
              <p key={i} className="text-gray-700 leading-relaxed">
                {m}
              </p>
            ))}
          </div>
        </div>

        {/* Nilai Utama */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold">Nilai Utama LamiGo</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Inovatif */}
          <div className="bg-white shadow-md border border-gray-100 rounded-2xl p-6 flex items-start gap-4">
            <img src="/images/14.svg" alt="Inovatif" className="w-20 h-20" />
            <div>
              <h3 className="font-semibold text-lg">Inovatif</h3>
              <p className="text-gray-600 text-sm">
                Selalu berinovasi untuk menciptakan pengalaman wisata yang relevan dengan perkembangan zaman.
              </p>
            </div>
          </div>

          {/* Tanggung Jawab */}
          <div className="bg-white shadow-md border border-gray-100 rounded-2xl p-6 flex items-start gap-4">
            <img src="/images/15.svg" alt="Tanggung Jawab" className="w-20 h-20" />
            <div>
              <h3 className="font-semibold text-lg">Tanggung Jawab</h3>
              <p className="text-gray-600 text-sm">
                Berkomitmen menjaga kepercayaan pengguna dan mendukung pariwisata berkelanjutan.
              </p>
            </div>
          </div>

          {/* Kolaboratif */}
          <div className="bg-white shadow-md border border-gray-100 rounded-2xl p-6 flex items-start gap-4">
            <img src="/images/17.svg" alt="Kolaboratif" className="w-20 h-20" />
            <div>
              <h3 className="font-semibold text-lg">Kolaboratif</h3>
              <p className="text-gray-600 text-sm">
                Membangun kerja sama dengan berbagai pihak demi kemajuan wisata daerah.
              </p>
            </div>
          </div>

          {/* Cepat */}
          <div className="bg-white shadow-md border border-gray-100 rounded-2xl p-6 flex items-start gap-4">
            <img src="/images/18.svg" alt="Cepat" className="w-20 h-20" />
            <div>
              <h3 className="font-semibold text-lg">Cepat</h3>
              <p className="text-gray-600 text-sm">
                Memberikan layanan yang responsif dan efisien untuk setiap kebutuhan wisatawan.
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
