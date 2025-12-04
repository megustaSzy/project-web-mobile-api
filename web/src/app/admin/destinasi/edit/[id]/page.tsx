// app/admin/destinasi/edit/[id]/page.tsx
"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { apiFetch } from "@/helpers/api";

export default function EditDestinasi() {
  const search = useSearchParams();
  const id = search.get("id") || undefined;
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [price, setPrice] = useState<number | "">("");
  const [image, setImage] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        const res = await apiFetch<{ data: { id:number; name:string; description?:string; price?:number; imageUrl?:string } }>(`/destinations/${id}`);
        const d = res.data;
        setName(d.name);
        setDesc(d.description ?? "");
        setPrice(d.price ?? "");
        setImage(d.imageUrl ?? null);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      await apiFetch(`/destinations/${id}`, { method: "PUT", body: JSON.stringify({ name, description: desc, price }) });
      router.push("/admin/destinasi");
    } catch (err) {
      console.error(err);
      alert("Gagal update");
    }
  }

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h2 className="text-xl font-semibold text-blue-700 mb-4">Edit Destinasi</h2>
      <form className="bg-white p-6 rounded-xl shadow" onSubmit={handleSubmit}>
        <div className="grid gap-4">
          <input value={name} onChange={(e)=>setName(e.target.value)} className="border p-2 rounded" required />
          <textarea value={desc} onChange={(e)=>setDesc(e.target.value)} className="border p-2 rounded" rows={4} />
          <input value={price as number} onChange={(e)=>setPrice(Number(e.target.value))} type="number" className="border p-2 rounded" />
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-blue-600 text-white rounded">Update</button>
            <button type="button" onClick={()=>router.back()} className="px-4 py-2 bg-gray-100 rounded">Batal</button>
          </div>
        </div>
      </form>
    </div>
  );
}
