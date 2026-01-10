"use client";

import { useEffect, useState, useRef } from "react";
import { Menu, Sun, Moon, ChevronDown } from "lucide-react";
import { apiFetch } from "@/helpers/api";

export type ApiProfileResponse = {
  status: number;
  message: string;
  data: {
    id: number;
    name: string;
    email: string;
    role: string;
    avatar?: string | null;
  };
};

export default function TopBar({
  toggleSidebar,
}: {
  toggleSidebar: () => void;
}) {
  const [profile, setProfile] = useState<{
    id: number;
    name: string;
    email: string;
    role: string;
    avatar?: string | null;
  } | null>(null);

  const [dark, setDark] = useState(false);
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  // tutup dropdown ketika klik luar
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (!menuRef.current) return;
      if (!menuRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // ambil profil
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await apiFetch<ApiProfileResponse>("/api/users/profile");
        setProfile(res.data);
      } catch (err) {
        console.error("Gagal memuat profile:", err);
      }
    };

    fetchProfile();
  }, []);

  return (
    <header className="w-full bg-white dark:bg-[#0b0f19] shadow-sm px-6 py-4 flex justify-between items-center border-b dark:border-neutral-800">
      {/* LEFT */}
      <div className="flex items-center gap-3">
        <button
          onClick={toggleSidebar}
          className="text-gray-700 dark:text-gray-300"
        >
          <Menu size={22} />
        </button>

        <input
          type="search"
          placeholder="Search..."
          className="border dark:border-neutral-700 dark:bg-neutral-900 dark:text-gray-200 rounded-lg px-3 py-2 text-sm w-64"
        />
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-5">
        {/* THEME BUTTON */}
        <button
          onClick={() => {
            const newMode = !dark;
            setDark(newMode);
            document.documentElement.classList.toggle("dark", newMode);
            localStorage.setItem("theme", newMode ? "dark" : "light");
          }}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-800 transition text-gray-700 dark:text-gray-300"
        >
          {dark ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        {/* PROFILE DROPDOWN */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setOpen(!open)}
            className="flex items-center gap-3"
          >
            <div className="w-9 h-9 rounded-full bg-indigo-100 dark:bg-neutral-800 text-indigo-700 dark:text-indigo-300 flex items-center justify-center font-bold border dark:border-neutral-700">
              {profile ? profile.name[0].toUpperCase() : "U"}
            </div>

            <div className="hidden sm:flex flex-col items-start">
              <span className="text-sm font-semibold dark:text-gray-200">
                {profile?.name ?? "Loading..."}
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {profile?.role ?? ""}
              </span>
            </div>

            <ChevronDown
              size={16}
              className="text-gray-600 dark:text-gray-300"
            />
          </button>

          {/* DROPDOWN MENU */}
          {open && (
            <div className="absolute right-0 mt-3 w-56 bg-white dark:bg-neutral-900 shadow-lg rounded-lg border dark:border-neutral-700 py-2 z-50">
              <div className="px-4 py-3 border-b dark:border-neutral-800">
                <p className="text-sm font-medium dark:text-gray-200">
                  {profile?.name}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {profile?.role}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
