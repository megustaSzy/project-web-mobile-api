// app/admin/destinasi/tambah/page.tsx
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function TambahDestinasi() {
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [price, setPrice] = useState<number | "">("");
  const [categoryId, setCategoryId] = useState<number | "">("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      const fd = new FormData();
      fd.append("name", name);
      fd.append("description", desc);
      fd.append("price", String(price));
      fd.append("categoryId", String(categoryId));
      if (imageFile) fd.append("image", imageFile);

      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/destinations`, {
        method: "POST",
        body: fd,
      });

      router.push("/admin/destinasi");
    } catch (err) {
      console.error(err);
      alert("Gagal menambah destinasi");
    }
  }

  return (
    <div>
      <h2 className="text-xl font-semibold text-blue-700 mb-4">Tambah Destinasi</h2>
      <form className="bg-white p-6 rounded-xl shadow" onSubmit={handleSubmit}>
        <div className="grid gap-4">
          <input value={name} onChange={(e)=>setName(e.target.value)} className="border p-2 rounded" placeholder="Nama destinasi" required />
          <textarea value={desc} onChange={(e)=>setDesc(e.target.value)} className="border p-2 rounded" placeholder="Deskripsi" rows={4} required/>
          <input value={price} onChange={(e)=>setPrice(Number(e.target.value))} type="number" className="border p-2 rounded" placeholder="Harga" />
          <input value={categoryId} onChange={(e)=>setCategoryId(Number(e.target.value))} type="number" className="border p-2 rounded" placeholder="Category ID" />
          <input type="file" onChange={(e)=>setImageFile(e.target.files?.[0] ?? null)} className="border p-2 rounded"/>
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-blue-600 text-white rounded">Simpan</button>
            <button type="button" onClick={()=>router.back()} className="px-4 py-2 bg-gray-100 rounded">Batal</button>
          </div>
        </div>
      </form>
    </div>
  );
}
