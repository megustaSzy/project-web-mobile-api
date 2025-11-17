"use client";

import Image from "next/image";
import { useState } from "react";
import Link from "next/link";

export default function DaftarFavorite() {
  const wisataData = [
    {
      name: "Kabupaten Pesawaran",
      desc: "Temukan berbagai wisata di Kabupaten Pesawaran",
      total: 15,
      img: "/images/favorite/19.png",
    },
    {
      name: "Kabupaten Lampung Selatan",
      desc: "Temukan berbagai wisata di Kabupaten Lampung Selatan",
      total: 9,
      img: "/images/favorite/20.png",
    },
    {
      name: "Kabupaten Tanggamus",
      desc: "Temukan berbagai wisata di Kabupaten Tanggamus",
      total: 8,
      img: "/images/favorite/24.png",
    },
    {
      name: "Kabupaten Lampung Barat",
      desc: "Temukan berbagai wisata di Kabupaten Lampung Barat",
      total: 8,
      img: "/images/favorite/21.png",
    },
    {
      name: "Kabupaten Way Kanan",
      desc: "Temukan berbagai wisata di Kabupaten Way Kanan",
      total: 2,
      img: "/images/favorite/23.png",
    },
    {
      name: "Kabupaten Pesisir Barat",
      desc: "Temukan berbagai wisata di Kabupaten Pesisir Barat",
      total: 3,
      img: "/images/favorite/22.png",
    },
    {
      name: "Kabupaten Tulang Bawang Barat",
      desc: "Temukan berbagai wisata di Kabupaten Tulang Bawang Barat",
      total: 2,
      img: "/images/favorite/26.png",
    },
    {
      name: "Kota Bandar Lampung",
      desc: "Temukan berbagai wisata di Kota Bandar Lampung",
      total: 4,
      img: "/images/favorite/25.png",
    },
    {
      name: "Kabupaten Lampung Tengah",
      desc: "Temukan berbagai wisata di Kabupaten Lampung Tengah",
      total: 1,
      img: "/images/favorite/27.png",
    },
    {
      name: "Destinasi Belum Terklarifikasi",
      desc: "Destinasi berada di perbatasan / belum jelas administratif",
      total: 4,
      img: "/images/favorite/28.png",
    },
  ];

  return (
    <section className="w-full min-h-screen bg-gradient-to-b from-[#a7c8e7] to-white px-6 py-20">
      <h1 className="text-center text-3xl font-semibold mb-10">
        Tujuan Wisata Favorit
      </h1>

      {/* CARD LIST */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {wisataData.map((item, i) => (
          <div
            key={i}
            className="bg-white rounded-2xl shadow-md px-5 py-6 flex gap-4 items-start"
          >
            {/* Gambar Kabupaten */}
            <Image
              src={item.img}
              alt={item.name}
              width={70}
              height={70}
              className="rounded-md object-cover"
            />

             <div className="flex flex-col gap-1">
              <h2 className="font-semibold text-gray-800">{item.name}</h2>
              <p className="text-sm text-gray-500">{item.desc}</p>

              <Link
                href={`/pesanantour?kabupaten=${encodeURIComponent(
                  item.name
                )}`}
                className="text-blue-500 font-medium text-sm hover:underline"
              >
                Lihat Detail
              </Link>
            </div>

            <div className="ml-auto text-end">
              <p className="text-2xl font-semibold text-gray-800">
                {item.total}
              </p>
              <p className="text-[11px] text-gray-500 -mt-1">Destinasi</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
