// app/admin/components/Sidebar.tsx
"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Mountain, Tags, MapPin, Users, FileText, ShoppingCart, Settings } from "lucide-react";

export default function Sidebar() {
  const path = usePathname();
  const menu = [
    { title: "Dashboard", href: "/admin", icon: <LayoutDashboard size={16}/> },
    { title: "Destinasi", href: "/admin/destinasi", icon: <Mountain size={16}/> },
    { title: "Kategori Wisata", href: "/admin/kategori-wisata", icon: <Tags size={16}/> },
    { title: "Kategori Kabupaten", href: "/admin/kategori-kabupaten", icon: <MapPin size={16}/> },
    { title: "Pickup", href: "/admin/pickup-penjemputan", icon: <MapPin size={16}/> },
    { title: "Pemesanan", href: "/admin/pesanan", icon: <ShoppingCart size={16}/> },
    { title: "Pengguna", href: "/admin/manajement-pengguna", icon: <Users size={16}/> },
    { title: "Laporan", href: "/admin/laporan", icon: <FileText size={16}/> },
    { title: "Pengaturan", href: "/admin/pengaturan", icon: <Settings size={16}/> },
  ];

  return (
    <aside className="w-64 bg-blue-700 text-white p-5 shadow-lg">
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-bold">Admin Panel</h1>
        <p className="text-xs opacity-80">LamiGo</p>
      </div>

      <nav className="flex flex-col gap-2">
        {menu.map((m) => (
          <Link key={m.href} href={m.href} className={`flex items-center gap-3 px-3 py-2 rounded-lg transition ${path === m.href ? "bg-blue-500 shadow" : "hover:bg-blue-600"}`}>
            {m.icon}
            <span className="text-sm">{m.title}</span>
          </Link>
        ))}
      </nav>

      <div className="mt-auto">
        <button className="w-full bg-white text-blue-700 px-3 py-2 rounded-lg font-medium hover:opacity-90">Sign Out</button>
      </div>
    </aside>
  );
}
