"use client";

import Link from "next/link";
import { useState } from "react";

export default function TiketPage() {
  const [tickets] = useState([
    {
      id: 1,
      code: "TIK-20231101",
      destinasi: "Pantai Sari Ringgung",
      tanggal: "2025-11-20",
      status: "Sudah Dibayar",
    },
    {
      id: 2,
      code: "TIK-20231102",
      destinasi: "Puncak Mas",
      tanggal: "2025-12-01",
      status: "Menunggu Konfirmasi",
    },
  ]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-6">Tiket Saya</h1>

      <div className="space-y-4">
        {tickets.map((t) => (
          <Link key={t.id} href={`/tiket/${t.id}`}>
            <div className="p-4 border rounded-xl bg-white shadow hover:bg-gray-50 cursor-pointer">
              <h2 className="text-lg font-bold">{t.destinasi}</h2>
              <p className="text-sm text-gray-600">Tanggal: {t.tanggal}</p>
              <p className="text-sm">Kode Tiket: {t.code}</p>

              <span
                className={`inline-block mt-2 px-2 py-1 text-xs rounded ${
                  t.status === "Sudah Dibayar"
                    ? "bg-green-100 text-green-700"
                    : "bg-yellow-100 text-yellow-700"
                }`}
              >
                {t.status}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
