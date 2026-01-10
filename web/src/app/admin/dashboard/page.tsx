"use client";

import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import StatsCard from "@/components/admin/StatsCard";
import { Counts, ChartItem, StatsResponse } from "@/types/count";

// URL API
const API_URL = process.env.NEXT_PUBLIC_API_URL;

async function fetchStats(): Promise<StatsResponse> {
  if (!API_URL) throw new Error("NEXT_PUBLIC_API_URL not defined");

  const res = await fetch(`${API_URL}/api/count`);
  if (!res.ok) throw new Error("Failed to fetch stats");

  const json: StatsResponse = await res.json();
  return json;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Counts>({
    totalUsers: 0,
    totalDestinations: 0,
    totalCategories: 0,
  });

  const [chartData, setChartData] = useState<ChartItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getStats = async () => {
      try {
        setLoading(true);
        const json = await fetchStats();

        if (json.status === 200) {
          setStats(json.data.counts);
          setChartData(json.data.chartData);
        } else {
          setError("Gagal memuat data dari server");
        }
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Terjadi kesalahan tidak diketahui");
        }
      } finally {
        setLoading(false);
      }
    };

    getStats();
  }, []);

  if (loading) {
    return <div className="p-8 text-gray-500">Memuat data dashboard…</div>;
  }

  if (error) {
    return <div className="p-8 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="p-8 bg-[#fafafa] min-h-screen">
      {/* HEADER */}
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">Dashboard</h1>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatsCard title="Total Destinasi" value={stats.totalDestinations} />
        <StatsCard title="Kategori Wisata" value={stats.totalCategories} />
        <StatsCard title="Total Pengguna" value={stats.totalUsers} />
      </div>

      {/* CHART */}
      <div className="mt-8 bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
        <h2 className="text-lg font-medium text-gray-800 mb-4">
          Statistik Wisata
        </h2>

        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <XAxis dataKey="name" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip />
              <Bar dataKey="value" fill="#4f46e5" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-gray-500">Tidak ada data untuk ditampilkan</p>
        )}
      </div>
    </div>
  );
}