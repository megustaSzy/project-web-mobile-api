"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { apiFetch } from "@/helpers/api";
import { ApiCategoryResponse } from "@/types/category";

interface Option {
  id: number;
  name: string;
}

export default function TambahDestinasi() {
  const router = useRouter();
  const token = Cookies.get("accessToken");

  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [price, setPrice] = useState<number | "">("");
  const [categoryId, setCategoryId] = useState<number | "">("");
  const [kabupatenId, setKabupatenId] = useState<number | "">("");
  const [imageFile, setImageFile] = useState<File | null>(null);

  const [categories, setCategories] = useState<Option[]>([]);
  const [kabupaten, setKabupaten] = useState<Option[]>([]);

  /* ================= LOAD DROPDOWN ================= */
  useEffect(() => {
    async function loadDropdown() {
      try {
        // ✅ KATEGORI WISATA (SAMA DENGAN DASHBOARD)
        const catRes = await apiFetch<ApiCategoryResponse>("/api/category");
        setCategories(catRes.data.items);

        // ✅ KATEGORI KABUPATEN (HARUS DARI API)
        const kabRes = await apiFetch<{ data: { items: Option[] } }>(
          "/api/kabupaten"
        );
        setKabupaten(kabRes.data.items);
      } catch (err) {
        console.error("Gagal load dropdown", err);
      }
    }

    loadDropdown();
  }, []);

  /* ================= SUBMIT ================= */
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
      const fd = new FormData();
      fd.append("name", name);
      fd.append("description", desc);
      fd.append("price", String(price));
      fd.append("category_id", String(categoryId));
      fd.append("kabupaten_id", String(kabupatenId));
      if (imageFile) fd.append("image", imageFile);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/destinations`,
        {
          method: "POST",
          headers: token ? { Authorization: `Bearer ${token}` } : {},
          body: fd,
        }
      );

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text);
      }

      router.push("/admin/destinasi");
    } catch (err) {
      console.error(err);
      alert("Gagal menambah destinasi");
    }
  }

  /* ================= UI ================= */
  return (
    <div>
      <h2 className="text-xl font-semibold text-blue-700 mb-4">
        Tambah Destinasi
      </h2>

      <form className="bg-white p-6 rounded-xl shadow" onSubmit={handleSubmit}>
        <div className="grid gap-4">
          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border p-2 rounded"
            placeholder="Nama destinasi"
          />

          <textarea
            required
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            className="border p-2 rounded"
            placeholder="Deskripsi"
            rows={4}
          />

          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
            className="border p-2 rounded"
            placeholder="Harga"
          />

          {/* ✅ KATEGORI WISATA */}
          <select
            required
            value={categoryId}
            onChange={(e) => setCategoryId(Number(e.target.value))}
            className="border p-2 rounded"
          >
            <option value="">Pilih Kategori Wisata</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          {/* ✅ KATEGORI KABUPATEN */}
          <select
            required
            value={kabupatenId}
            onChange={(e) => setKabupatenId(Number(e.target.value))}
            className="border p-2 rounded"
          >
            <option value="">Pilih Kabupaten</option>
            {kabupaten.map((k) => (
              <option key={k.id} value={k.id}>
                {k.name}
              </option>
            ))}
          </select>

          <input
            type="file"
            onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
            className="border p-2 rounded"
          />

          <div className="flex gap-2">
            <button className="px-4 py-2 bg-blue-600 text-white rounded">
              Simpan
            </button>
            <button
              type="button"
              onClick={() => router.back()}
              className="px-4 py-2 bg-gray-100 rounded"
            >
              Batal
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
