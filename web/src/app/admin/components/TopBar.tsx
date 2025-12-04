/* eslint-disable @next/next/no-img-element */
// app/admin/components/TopBar.tsx
"use client";
export default function TopBar() {
  return (
    <header className="w-full bg-white shadow-sm px-6 py-4 flex justify-between items-center">
      <div>
        <h2 className="text-lg font-semibold text-gray-700">Admin Dashboard</h2>
        <p className="text-sm text-gray-400">Welcome back</p>
      </div>

      <div className="flex items-center gap-4">
        <input type="search" placeholder="Search..." className="hidden md:inline-block border rounded-lg px-3 py-2 text-sm" />
        <img src="/images/user-default.png" alt="User" className="w-9 h-9 rounded-full border" />
      </div>
    </header>
  );
}
