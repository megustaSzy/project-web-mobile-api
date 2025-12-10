"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";

type Ticket = {
  id: number;
  code: string;
  destinasi: string;
  tanggal: string; // ISO yyyy-mm-dd
  status: "Sudah Dibayar" | "Menunggu Konfirmasi" | "Dibatalkan";
};

export default function TiketPage() {
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const [tickets] = useState<Ticket[]>([
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

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return tickets
      .filter((t) => (statusFilter === "all" ? true : t.status === statusFilter))
      .filter(
        (t) =>
          !q ||
          t.destinasi.toLowerCase().includes(q) ||
          t.code.toLowerCase().includes(q) ||
          t.tanggal.includes(q)
      )
      .sort((a, b) => new Date(a.tanggal).getTime() - new Date(b.tanggal).getTime());
  }, [tickets, query, statusFilter]);

  const formatDate = (iso: string) => {
    try {
      return new Date(iso).toLocaleDateString("id-ID", {
        weekday: "short",
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    } catch {
      return iso;
    }
  };

  const statusBadge = (status: Ticket["status"]) => {
    if (status === "Sudah Dibayar")
      return "bg-green-100 text-green-800";
    if (status === "Menunggu Konfirmasi")
      return "bg-yellow-100 text-yellow-800";
    return "bg-red-100 text-red-800";
  };

  return (
    <>
      {/* NAVBAR FULL WIDTH */}
      <NavBar />

      {/* MAIN CONTENT */}
      <div className="p-6 max-w-4xl mx-auto pt-24">
        <h1 className="text-2xl font-semibold mb-4">Tiket Saya</h1>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
          <div className="flex items-center gap-2 w-full sm:w-2/3">
            <label htmlFor="search" className="sr-only">Cari tiket</label>
            <input
              id="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Cari berdasarkan destinasi, kode, atau tanggal..."
              className="w-full p-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-sky-300"
              aria-label="Cari tiket"
            />
          </div>

          <div className="flex items-center gap-2">
            <label htmlFor="filter" className="text-sm text-gray-600">Filter:</label>
            <select
              id="filter"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="p-2 rounded border bg-white"
              aria-label="Filter status tiket"
            >
              <option value="all">Semua</option>
              <option value="Sudah Dibayar">Sudah Dibayar</option>
              <option value="Menunggu Konfirmasi">Menunggu Konfirmasi</option>
              <option value="Dibatalkan">Dibatalkan</option>
            </select>
          </div>
        </div>

        {/* List */}
        <div className="space-y-4">
          {filtered.length === 0 && (
            <div className="p-6 bg-white border rounded-xl text-center text-gray-600">
              Tidak ada tiket yang cocok.
            </div>
          )}

          {filtered.map((t) => (
            <Link
              key={t.id}
              href={`/tiket/${t.id}`}
              className="block"
              aria-label={`Buka detail tiket ${t.destinasi}`}
            >
              <article
                className="p-4 border rounded-xl bg-white shadow-sm hover:shadow-md transition flex flex-col sm:flex-row sm:items-center gap-4"
                role="button"
              >
                <div className="flex-1 min-w-0">
                  <h2 className="text-lg px-2 font-medium truncate">
                    {t.destinasi}
                  </h2>

                  <div className="mt-1 flex flex-col sm:flex-row sm:items-center sm:gap-4 text-sm text-gray-600">
                    <time dateTime={t.tanggal} className="flex items-center gap-2 px-2">
                      <span>{formatDate(t.tanggal)}</span>
                    </time>

                    <div className="flex items-center gap-3 mt-1 sm:mt-0">
                      <div className="text-xs text-gray-500">
                        Kode: <span className="font-medium">{t.code}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex-shrink-0 flex items-center gap-4 sm:flex-col sm:items-end">
                  <span
                    className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${statusBadge(
                      t.status
                    )}`}
                  >
                    {t.status}
                  </span>

                  <span className="hidden sm:inline-block">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-sky-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </span>
                </div>
              </article>
            </Link>
          ))}
        </div>
      </div>

      {/* FOOTER FULL WIDTH */}
      <Footer />
    </>
  );
}
