/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { apiFetch } from "@/helpers/api";

export type ChooseUsItem = {
  id: number;
  number: string;
  header: string;
  name: string;
  imageUrl: string;
};

type ApiResponse<T> = {
  status: number;
  message: string;
  data: T;
};

export default function ChooseUs() {
  const [items, setItems] = useState<ChooseUsItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBanner = async () => {
      try {
        const res = await apiFetch<
          ChooseUsItem[] | ApiResponse<ChooseUsItem[]>
        >("/api/banner");

        //  Normalisasi response (aman untuk semua bentuk)
        const normalizedData: ChooseUsItem[] = Array.isArray(res)
          ? res
          : res.data;

        setItems(normalizedData);
      } catch (error) {
        console.error("Gagal mengambil data banner", error);
        setItems([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBanner();
  }, []);

  return (
    <section className="relative bg-gray-100 bg-[url('/images/peta.svg')] bg-linear-to-b from-[#f8fafc] to-white py-20 overflow-hidden bg-no-repeat bg-center bg-cover">
      <div className="absolute inset-0 bg-linear-to-b from-[#f2f6f9] to-white/90 z-0" />

      <div className="relative z-10">
        <h2 className="text-center text-3xl md:text-4xl font-extrabold text-gray-900 mb-3">
          Mengapa <span className="text-blue-600">Memilih</span> Kami
        </h2>

        <p className="text-center text-sm text-gray-500 mb-10">
          Layanan profesional, harga bersahabat, dan perjalanan penuh kenangan
          bersama <span className="font-semibold text-blue-500">LamiGo</span>
        </p>

        <div className="max-w-7xl mx-auto px-6 md:px-10 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div className="flex justify-center">
            <Image
              src="/images/5.png"
              alt="Liburan"
              width={400}
              height={400}
              className="drop-shadow-xl"
            />
          </div>

          <div className="space-y-4">
            {loading && <p className="text-gray-500 text-sm">Memuat data...</p>}

            {!loading && items.length === 0 && (
              <p className="text-gray-400 text-sm">Data belum tersedia</p>
            )}

            {!loading &&
              items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center bg-white rounded-2xl shadow-sm p-4 border border-gray-100 hover:shadow-md transition"
                >
                  <img
                    src={item.imageUrl}
                    alt={item.header}
                    className="w-12 h-12 mr-4 object-contain"
                  />

                  <div>
                    <h3 className="text-xl font-bold text-gray-900">
                      {item.number}
                    </h3>

                    <p className="text-gray-800 text-sm leading-tight">
                      <span className="font-semibold block">{item.header}</span>
                      <span>{item.name}</span>
                    </p>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </section>
  );
}
