/* eslint-disable @next/next/no-img-element */
"use client";
import { Menu } from "lucide-react";

export default function TopBar({ toggleSidebar }: { toggleSidebar: () => void }) {
  return (
    <header className="w-full bg-white shadow-sm px-6 py-4 flex justify-between items-center">
      <div className="flex items-center gap-3">
        <button onClick={toggleSidebar} className="text-gray-700">
          <Menu size={22} />
        </button>

        <input
          type="search"
          placeholder="Search..."
          className="border rounded-lg px-3 py-2 text-sm w-64"
        />
      </div>

      <div className="flex items-center gap-4">
        <img
          src="/images/user-default.png"
          alt="User"
          className="w-10 h-10 rounded-full border"
        />
      </div>
    </header>
  );
}
