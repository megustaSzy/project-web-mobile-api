"use client";

import { useEffect, useState } from "react";
import StatsCard from "./components/StatsCard";
import { ActivityItem, StatsResponse } from "@/types/dashboard";

export default function AdminDashboard() {
  const [stats, setStats] = useState<StatsResponse>({
    total_destinasi: 0,
    total_kategori: 0,
    total_pengguna: 0,
  });

  const [activities, setActivities] = useState<ActivityItem[]>([]);

  useEffect(() => {
    // Statistik
    fetch("/api/stats")
      .then((res) => res.json())
      .then((json: StatsResponse) => {
        setStats(json);
      });

    // Recent Activities
    fetch("/api/activities")
      .then((res) => res.json())
      .then((json: ActivityItem[]) => {
        setActivities(json);
      });
  }, []);

  return (
    <div className="p-6 space-y-6">

      {/* === STAT CARDS === */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatsCard title="Total Destinasi" value={stats.total_destinasi} />
        <StatsCard title="Kategori Wisata" value={stats.total_kategori} />
        <StatsCard title="Pengguna" value={stats.total_pengguna} />
      </div>

      {/* === CONTENT === */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* LEFT: RECENT ACTIVITIES */}
        <div className="md:col-span-2 bg-white shadow rounded-xl p-6">
          <h2 className="text-lg font-semibold mb-4">Recent Activities</h2>

          {activities.length === 0 ? (
            <p className="text-gray-500">No recent activity.</p>
          ) : (
            <ul className="space-y-2">
              {activities.map((item) => (
                <li
                  key={item.id}
                  className="p-3 border rounded-lg bg-gray-50 hover:bg-gray-100 transition"
                >
                  <p className="font-medium">{item.title}</p>
                  <p className="text-xs text-gray-500">{item.time}</p>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* RIGHT: QUICK ACTIONS */}
        <div className="bg-white shadow rounded-xl p-6">
          <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>

          <div className="space-y-3">
            <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition">
              Tambah Destinasi
            </button>

            <button className="w-full bg-gray-100 py-2 rounded-lg hover:bg-gray-200 transition">
              Kelola Kategori
            </button>

            <button className="w-full bg-gray-100 py-2 rounded-lg hover:bg-gray-200 transition">
              Kelola Pengguna
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
