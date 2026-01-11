"use client";

import { useEffect, useState, useRef } from "react";
import { Menu, Sun, Moon, ChevronDown } from "lucide-react";
import { apiFetch } from "@/helpers/api";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

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
  const [profile, setProfile] = useState<ApiProfileResponse["data"] | null>(
    null
  );
  const [dark, setDark] = useState(false);
  const [open, setOpen] = useState(false);
  const [logoutOpen, setLogoutOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  // klik luar dropdown
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (!menuRef.current) return;
      if (!menuRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // fetch profile
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

  // logout logic (SAMA PERSIS)
  const handleLogout = async () => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      document.cookie = "accessToken=; path=/; max-age=0";
      document.cookie = "refreshToken=; path=/; max-age=0";
      document.cookie = "role=; path=/; max-age=0";

      localStorage.clear();
      sessionStorage.clear();

      window.location.href = "/login";
    }
  };

  return (
    <>
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
          {/* THEME */}
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

          {/* PROFILE */}
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

                <div className="py-1">
                  <button
                    onClick={() => {
                      setOpen(false);
                      window.location.href = "/admin/profile";
                    }}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-neutral-800"
                  >
                    Profile
                  </button>

                  <button
                    onClick={() => {
                      setOpen(false);
                      setLogoutOpen(true);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-neutral-800"
                  >
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* ALERT LOGOUT */}
      <AlertDialog open={logoutOpen} onOpenChange={setLogoutOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Konfirmasi Logout</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah kamu yakin ingin keluar dari akun admin?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-500 hover:bg-red-600"
              onClick={handleLogout}
            >
              Ya, Logout
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
