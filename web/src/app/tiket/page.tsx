"use client";

import Link from "next/link";
import { useMemo, useState, useEffect } from "react";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import { apiFetch } from "@/helpers/api";

/* =======================
   TYPES
======================= */
export type Ticket = {
  id: number;
  ticketCode: string;
  destinationName: string;
  date: string;
  departureTime: string;
  returnTime: string;
  quantity: number;
  totalPrice: number;
  paymentStatus: "paid" | "pending" | "failed" | "expired";
  isPaid: boolean;
};

type OrdersMeResponse = {
  status: number;
  message: string;
  data: Ticket[];
};

/* =======================
   STATUS MAP (UI → BE)
======================= */
const statusMap: Record<string, Ticket["paymentStatus"]> = {
  "Sudah Dibayar": "paid",
  "Menunggu Konfirmasi": "pending",
  "Gagal": "failed",
  "Kedaluwarsa": "expired",
};

/* =======================
   PAGE
======================= */
export default function TiketPage() {
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);

  /* =======================
     FETCH DATA
  ======================= */
  useEffect(() => {
    const fetchTickets = async () => {
      try {
        setLoading(true);
        const res = await apiFetch<OrdersMeResponse>("/api/orders/me");
        setTickets(res.data);
      } catch (error) {
        console.error("❌ Gagal mengambil tiket:", error);
        setTickets([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, []);

  /* =======================
     FILTER + SEARCH
  ======================= */
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();

    return tickets
      .filter((t) =>
        statusFilter === "all"
          ? true
          : t.paymentStatus === statusMap[statusFilter]
      )
      .filter(
        (t) =>
          !q ||
          t.destinationName.toLowerCase().includes(q) ||
          t.ticketCode.toLowerCase().includes(q) ||
          t.date.includes(q)
      )
      .sort(
        (a, b) =>
          new Date(a.date).getTime() - new Date(b.date).getTime()
      );
  }, [tickets, query, statusFilter]);

  /* =======================
     HELPERS
  ======================= */
  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString("id-ID", {
      weekday: "short",
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  const statusBadge = (status: Ticket["paymentStatus"]) => {
    if (status === "paid") return "bg-green-50 text-green-700";
    if (status === "pending") return "bg-yellow-50 text-yellow-700";
    if (status === "failed") return "bg-red-50 text-red-700";
    return "bg-gray-100 text-gray-600";
  };

  const statusLabel = (status: Ticket["paymentStatus"]) => {
    if (status === "paid") return "Sudah Dibayar";
    if (status === "pending") return "Menunggu Konfirmasi";
    if (status === "failed") return "Gagal";
    return "Kedaluwarsa";
  };

  /* =======================
     RENDER
  ======================= */
  return (
    <>
      <NavBar />

      <div className="bg-gray-50 min-h-screen pt-28 pb-16">
        <div className="max-w-4xl mx-auto px-6">
          <h1 className="text-3xl font-semibold text-gray-900 mb-6">
            Tiket Saya
          </h1>

          {/* SEARCH & FILTER */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Cari destinasi, kode, atau tanggal..."
              className="flex-1 p-3 rounded-xl border border-gray-300 shadow-sm focus:ring-2 focus:ring-sky-300"
            />

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="p-3 rounded-xl border border-gray-300 shadow-sm"
            >
              <option value="all">Semua Status</option>
              <option value="Sudah Dibayar">Sudah Dibayar</option>
              <option value="Menunggu Konfirmasi">
                Menunggu Konfirmasi
              </option>
              <option value="Gagal">Gagal</option>
              <option value="Kedaluwarsa">Kedaluwarsa</option>
            </select>
          </div>

          {/* LIST */}
          <div className="space-y-6">
            {loading && (
              <div className="p-6 bg-white rounded-2xl text-center text-gray-500 shadow">
                Memuat tiket...
              </div>
            )}

            {!loading && filtered.length === 0 && (
              <div className="p-6 bg-white rounded-2xl text-center text-gray-500 shadow">
                Tidak ada tiket.
              </div>
            )}

            {!loading &&
              filtered.map((t) => (
                <Link key={t.id} href={`/tiket/${t.id}`}>
                  <article className="bg-white rounded-2xl p-6 shadow hover:shadow-lg transition flex justify-between items-center">
                    <div>
                      <h2 className="text-lg font-semibold">
                        {t.destinationName}
                      </h2>
                      <p className="text-sm text-gray-500">
                        {formatDate(t.date)} • Kode:{" "}
                        <span className="font-medium">
                          {t.ticketCode}
                        </span>
                      </p>
                    </div>

                    <span
                      className={`px-4 py-1 rounded-full text-sm font-semibold ${statusBadge(
                        t.paymentStatus
                      )}`}
                    >
                      {statusLabel(t.paymentStatus)}
                    </span>
                  </article>
                </Link>
              ))}
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}
