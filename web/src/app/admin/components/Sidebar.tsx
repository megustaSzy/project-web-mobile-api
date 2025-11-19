"use client";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import Link from "next/link";

export default function Sidebar() {
  return (
    <aside className="w-64 h-screen bg-white border-r shadow-sm p-4 hidden md:flex flex-col">
      <h1 className="text-xl font-semibold mb-6">Studio Admin</h1>

      <Button className="w-full mb-4">+ Quick Create</Button>

      <div className="flex flex-col gap-1 text-sm">
        <span className="text-xs font-semibold text-slate-500 px-2">Kelola</span>

        <Link href="/admin">
  <Button variant="ghost" className="justify-start w-full">Beranda</Button>
</Link>

<Link href="/admin/manajment-pengguna">
  <Button variant="ghost" className="justify-start w-full">
    Manajement Pengguna
  </Button>
</Link>



       <Link href="/admin/manajment-destinasi">
  <Button variant="ghost" className="justify-start w-full">
    Manajement Destinasi
  </Button>
</Link>

            <Link href="/admin/kategori-wisata">
  <Button variant="ghost" className="justify-start w-full">
    Kategori Wisata
  </Button>
</Link>
             <Link href="/admin/kategori-kabupaten">
  <Button variant="ghost" className="justify-start w-full">
    Kategori Kabupaten
  </Button>
</Link>
        <Link href="/admin/tiket">
  <Button variant="ghost" className="justify-start w-full">
    Tiket
  </Button>
</Link>
      </div>

      <div className="mt-auto pt-4">
        <div className="flex items-center gap-3 p-2 border rounded-lg">
          <Avatar className="h-10 w-10">
            <AvatarImage src="/images/logo.png" />
            <AvatarFallback>LG</AvatarFallback>
          </Avatar>

          <div className="text-sm">
            <p className="font-medium">LamiGo</p>
            <p className="text-xs text-slate-500">LamiGo@Yahoo.com</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
