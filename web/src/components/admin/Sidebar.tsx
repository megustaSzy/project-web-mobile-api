"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard,
  Mountain,
  Tags,
  MapPin,
  Users,
  FileText,
  ShoppingCart,
  MessageSquareQuote,
} from "lucide-react";

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

export default function Sidebar({ isOpen }: { isOpen: boolean }) {
  const pathname = usePathname();
  const [logoutOpen, setLogoutOpen] = useState(false);

  const menu = [
    { title: "Dashboard", href: "/admin/dashboard", icon: <LayoutDashboard size={16} /> },
    {
      title: "Destinasi",
      href: "/admin/destinasi",
      icon: <Mountain size={16} />,
    },
    {
      title: "Kategori Wisata",
      href: "/admin/kategori-wisata",
      icon: <Tags size={16} />,
    },
    {
      title: "Kategori Kabupaten",
      href: "/admin/kategori-kabupaten",
      icon: <MapPin size={16} />,
    },
    {
      title: "Pickup",
      href: "/admin/pickup-penjemputan",
      icon: <MapPin size={16} />,
    },
    {
      title: "Pemesanan",
      href: "/admin/pesanan",
      icon: <ShoppingCart size={16} />,
    },
    {
      title: "Pengguna",
      href: "/admin/manajemen-pengguna",
      icon: <Users size={16} />,
    },
    {
      title: "Laporan",
      href: "/admin/laporan",
      icon: <FileText size={16} />,
    },
    {
      title: "Pengelola Testimoni",
      href: "/admin/testimoni",
      icon: <MessageSquareQuote size={16} />,
    },
  ];

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
      <aside
        className={`
          fixed left-0 top-0 h-full z-40 
          bg-blue-700 text-white p-5 shadow-lg w-64
          transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          flex flex-col
        `}
      >
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold">Admin Panel</h1>
          <p className="text-xs opacity-80">LamiGo</p>
        </div>

        <nav className="flex-1 flex flex-col gap-2">
          {menu.map((m) => (
            <Link
              key={m.href}
              href={m.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg transition ${
                pathname === m.href ? "bg-blue-500 shadow" : "hover:bg-blue-600"
              }`}
            >
              {m.icon}
              <span className="text-sm">{m.title}</span>
            </Link>
          ))}
        </nav>

        <div className="mt-auto">
          <button
            onClick={() => setLogoutOpen(true)}
            className="w-full bg-red-500 text-white px-3 py-2 rounded-lg font-medium hover:opacity-90"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* ALERT DIALOG LOGOUT */}
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
