"use client";

import Sidebar from "./components/Sidebar";
import TopBar from "./components/TopBar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen w-full bg-[#f5f6f8] flex text-slate-800">
      <Sidebar />

      <main className="flex-1 p-6 space-y-6">
        <TopBar />
        {children}
      </main>
    </div>
  );
}
