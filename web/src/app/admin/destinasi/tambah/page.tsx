"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { apiFetch } from "@/helpers/api";
import { ApiCategoryResponse } from "@/types/category";
import { CheckCircle } from "lucide-react";

interface Option {
  id: number;
  name: string;
}

export default function TambahDestinasi() {
  const router = useRouter();
  const token = Cookies.get("accessToken");

  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [price, setPrice] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [regionId, setRegionId] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);

  const [categories, setCategories] = useState<Option[]>([]);
  const [regions, setRegions] = useState<Option[]>([]);

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  /* ================= LOAD DROPDOWN ================= */
  useEffect(() => {
    async function loadDropdown() {
      try {
        const catRes = await apiFetch<ApiCategoryResponse>("/api/category");
        setCategories(catRes.data.items);

        const regionRes = await apiFetch<{ data: { items: Option[] } }>(
          "/api/region"
        );
        setRegions(regionRes.data.items);
      } catch (err) {
        console.error("Gagal load dropdown", err);
      }
    }

    loadDropdown();
  }, []);

  /* ================= SUBMIT ================= */
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const fd = new FormData();
      fd.append("name", name);
      fd.append("description", desc);
      fd.append("price", price);
      fd.append("categoryId", categoryId);
      fd.append("regionId", regionId);
      if (imageFile) fd.append("image", imageFile);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/destinations`,
        {
          method: "POST",
          headers: token ? { Authorization: `Bearer ${token}` } : {},
          body: fd,
        }
      );

      if (!res.ok) throw new Error("Gagal");

      setSuccess(true);
      setTimeout(() => {
        router.push("/admin/destinasi");
      }, 1300);
    } catch (err) {
      console.error(err);
      alert("Gagal menambah destinasi");
    } finally {
      setLoading(false);
    }
  }
/* ================= UI ================= */
return (
  <>
    {/* SUCCESS TOAST */}
    {success && (
      <div className="fixed top-4 right-4 z-50 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg animate-in slide-in-from-top">
        Destinasi berhasil ditambahkan
      </div>
    )}

    {/* MODAL */}
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white w-full max-w-xl rounded-2xl shadow-xl animate-in fade-in zoom-in">
        {/* HEADER */}
        <div className="px-6 py-4 border-b">
          <h2 className="text-lg font-semibold text-gray-800">
            Tambah Destinasi
          </h2>
        </div>

        {/* BODY */}
        {success ? (
          <div className="flex flex-col items-center py-16 animate-in fade-in zoom-in">
            <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
            <h3 className="text-lg font-semibold text-gray-800">
              Berhasil!
            </h3>
            <p className="text-gray-500 text-sm">
              Destinasi berhasil ditambahkan
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Nama Destinasi
              </label>
              <input
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Deskripsi
              </label>
              <textarea
                required
                rows={3}
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Harga</label>
              <input
                type="number"
                min={1}
                required
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Kategori Wisata
              </label>
              <select
                required
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full border rounded-lg px-3 py-2 bg-white focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="">Pilih Kategori</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Region</label>
              <select
                required
                value={regionId}
                onChange={(e) => setRegionId(e.target.value)}
                className="w-full border rounded-lg px-3 py-2 bg-white focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="">Pilih Region</option>
                {regions.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Gambar Destinasi
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
                className="text-sm"
              />
            </div>

            {/* FOOTER */}
            <div className="flex justify-end gap-2 pt-4 border-t">
              <button
                type="button"
                onClick={() => router.back()}
                className="px-4 py-2 bg-gray-100 rounded-lg"
              >
                Batal
              </button>

              <button
                disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-60"
              >
                {loading ? "Menyimpan..." : "Simpan"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  </>
);

}