"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function Page() {
    const router = useRouter();
  const destinations = [
    {
      id: 1,
      name: "Pantai Sari Ringgung",
      description: "Pantai pasir putih dengan spot foto menara masjid terapung.",
      kabupaten: "Pesawaran",
      kategori: "Pantai",
      harga: "Rp25.000",
      image: "/images/destinasi1.jpeg",
    },
    {
      id: 2,
      name: "Puncak Mas",
      description: "Tempat wisata perbukitan dengan city view dan spot foto kekinian.",
      kabupaten: "Bandar Lampung",
      kategori: "Bukit",
      harga: "Rp20.000",
      image: "/images/destinasi2.jpeg",
    },
    {
      id: 3,
      name: "Air Terjun Way Lalaan",
      description: "Air terjun alami yang berada di kaki Gunung Rajabasa.",
      kabupaten: "Lampung Selatan",
      kategori: "Air Terjun",
      harga: "Rp10.000",
      image: "/images/destinasi3.jpeg",
    },
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Manajement Destinasi</h1>

            <Button className="px-4 py-2" onClick={() => router.push("/admin/destinasi/tambah")}>
      + Tambah Destinasi
    </Button>
      </div>

      <div className="bg-white border rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-slate-50 text-left">
              <th className="py-3 px-4 font-medium">Destinasi</th>
              <th className="py-3 px-4 font-medium">Deskripsi</th>
              <th className="py-3 px-4 font-medium">Kabupaten</th>
              <th className="py-3 px-4 font-medium">Kategori</th>
              <th className="py-3 px-4 font-medium">Harga</th>
              <th className="py-3 px-4 font-medium text-center">Aksi</th>
            </tr>
          </thead>

          <tbody>
            {destinations.map((item) => (
              <tr key={item.id} className="border-b hover:bg-slate-50 transition">
                {/* DESTINASI + FOTO */}
                <td className="py-3 px-4 flex items-center gap-3">
                  <Image
                    src={item.image}
                    alt={item.name}
                    width={60}
                    height={60}
                    className="rounded-lg object-cover"
                  />
                  <span className="font-medium">{item.name}</span>
                </td>

                {/* DESKRIPSI */}
                <td className="py-3 px-4 max-w-xs">{item.description}</td>

                {/* KABUPATEN */}
                <td className="py-3 px-4">{item.kabupaten}</td>

                {/* KATEGORI */}
                <td className="py-3 px-4">{item.kategori}</td>

                {/* HARGA */}
                <td className="py-3 px-4">{item.harga}</td>

                {/* TOMBOL Aksi */}
               <td className="py-3 px-4">
  <div className="flex justify-center gap-2">
    <Button size="sm" variant="outline" className="min-w-[70px]">
      Edit
    </Button>
    <Button size="sm" variant="destructive" className="min-w-[70px]">
      Hapus
    </Button>
  </div>
</td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
