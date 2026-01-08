"use client";

import Link from "next/link";
import { useMemo, useState, useEffect } from "react";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";

type Ticket = {
  id: number;
  code: string;
  destinasi: string;
  tanggal: string;
  status: "Sudah Dibayar" | "Menunggu Konfirmasi" | "Dibatalkan";
};

export default function TiketPage() {
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const bodyData = {
          userId: 123, // sesuaikan
        };

        const res = await fetch("/api/tickets", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(bodyData),
        });

        if (!res.ok) throw new Error("Gagal mengambil tiket");

        const json = await res.json();
        setTickets(json.data || []);
      } catch (err) {
        console.error(err);
        setTickets([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return tickets
      .filter((t) =>
        statusFilter === "all" ? true : t.status === statusFilter
      )
      .filter(
        (t) =>
          !q ||
          t.destinasi.toLowerCase().includes(q) ||
          t.code.toLowerCase().includes(q) ||
          t.tanggal.includes(q)
      )
      .sort(
        (a, b) => new Date(a.tanggal).getTime() - new Date(b.tanggal).getTime()
      );
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
    if (status === "Sudah Dibayar") return "bg-green-50 text-green-700";
    if (status === "Menunggu Konfirmasi") return "bg-yellow-50 text-yellow-700";
    return "bg-red-50 text-red-700";
  };

  return (
    <>
      {/* MAIN CONTENT */}
      <div className="bg-gray-50 min-h-screen pt-28 pb-16">
        <div className="max-w-4xl mx-auto px-6">
          <h1 className="text-3xl font-semibold text-gray-900 mb-6">
            Tiket Saya
          </h1>

          {/* Controls */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Cari berdasarkan destinasi, kode, atau tanggal..."
              className="flex-1 p-3 rounded-xl border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-300 bg-white text-gray-900 placeholder-gray-400"
            />

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="p-3 rounded-xl border border-gray-300 bg-white text-gray-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-300"
            >
              <option value="all">Semua Status</option>
              <option value="Sudah Dibayar">Sudah Dibayar</option>
              <option value="Menunggu Konfirmasi">Menunggu Konfirmasi</option>
              <option value="Dibatalkan">Dibatalkan</option>
            </select>
          </div>

          {/* Ticket List */}
          <div className="space-y-6">
            {loading && (
              <div className="p-6 bg-white border border-gray-200 rounded-2xl text-center text-gray-500 shadow-sm">
                Memuat tiket...
              </div>
            )}

            {!loading && filtered.length === 0 && (
              <div className="p-6 bg-white border border-gray-200 rounded-2xl text-center text-gray-500 shadow-sm">
                Tidak ada tiket yang cocok.
              </div>
            )}

            {!loading &&
              filtered.map((t) => (
                <Link key={t.id} href={`/tiket/${t.id}`} className="block">
                  <article className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <h2 className="text-xl font-medium text-gray-900 truncate">
                        {t.destinasi}
                      </h2>
                      <div className="mt-2 flex flex-col sm:flex-row sm:items-center sm:gap-6 text-sm text-gray-500">
                        <time dateTime={t.tanggal}>
                          {formatDate(t.tanggal)}
                        </time>
                        <div className="truncate">
                          Kode:{" "}
                          <span className="font-medium text-gray-700">
                            {t.code}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="shrink-0 flex items-center gap-4 sm:flex-col sm:items-end">
                      <span
                        className={`inline-block px-4 py-1 text-sm font-semibold rounded-full ${statusBadge(
                          t.status
                        )}`}
                      >
                        {t.status}
                      </span>

                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 text-sky-500 hidden sm:block"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </div>
                  </article>
                </Link>
              ))}
          </div>
        </div>
      </div>
      <NavBar />
      <Footer />
    </>
  );
}
