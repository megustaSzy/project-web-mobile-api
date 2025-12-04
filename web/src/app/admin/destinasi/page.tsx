// app/admin/destinasi/page.tsx
"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { apiFetch } from "@/helpers/api";

type ApiDestinationItem = {
  id: number;
  name: string;
  imageUrl?: string | null;
  description?: string;
  price?: number;
  category?: { id:number; name:string };
};

export default function DestinasiList() {
  const [items, setItems] = useState<ApiDestinationItem[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    try {
      const res = await apiFetch<{ data: { items: ApiDestinationItem[] } }>("/api/destinations");
      setItems(res?.data?.items ?? []);
    } catch (err) {
      console.error(err);
      setItems([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  async function handleDelete(id: number) {
    if (!confirm("Hapus destinasi ini?")) return;
    try {
      await apiFetch(`/destinations/${id}`, { method: "DELETE" });
      load();
    } catch (err) {
      console.error(err);
      alert("Gagal menghapus");
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-blue-700">Manajemen Destinasi</h2>
        <Link href="/admin/destinasi/tambah" className="px-4 py-2 bg-blue-600 text-white rounded">+ Tambah</Link>
      </div>

      <div className="bg-white rounded-xl shadow p-4">
        {loading ? (
          <p>Loading...</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="text-left text-gray-500">
              <tr>
                <th className="py-2">#</th>
                <th>Nama</th>
                <th>Kategori</th>
                <th>Harga</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {items.map((it) => (
                <tr key={it.id} className="border-t">
                  <td className="py-3">{it.id}</td>
                  <td>{it.name}</td>
                  <td>{it.category?.name ?? "-"}</td>
                  <td>Rp.{(it.price ?? 0).toLocaleString("id-ID")}</td>
                  <td>
                    <div className="flex gap-2">
                      <Link href={`/admin/destinasi/edit/${it.id}`} className="px-2 py-1 bg-yellow-400 rounded">Edit</Link>
                      <button onClick={() => handleDelete(it.id)} className="px-2 py-1 bg-red-500 text-white rounded">Hapus</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
