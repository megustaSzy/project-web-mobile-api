"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/helpers/api";
import { RegionApiResponse, RegionItem } from "@/types/region";

export default function KategoriKabupaten() {
  const [regions, setRegions] = useState<RegionItem[]>([]);
  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [name, setName] = useState("");
  const [logo, setLogo] = useState<File | null>(null);

  /* ===================== LOAD DATA ===================== */
  async function loadData(): Promise<void> {
    try {
      const res = await apiFetch<RegionApiResponse>("/api/region");
      setRegions(res.data.items);
    } catch (error) {
      console.error("Gagal load region", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  /* ===================== SIMPAN ===================== */
  async function save(): Promise<void> {
  if (!name.trim()) {
    alert("Nama kabupaten wajib diisi");
    return;
  }

  try {
    const fd = new FormData();
    fd.append("name", name);

    if (logo) {
      fd.append("image", logo);
    }

    // ✅ FIX UTAMA: endpoint didefinisikan
    const endpoint = editingId
      ? `/api/region/${editingId}`
      : "/api/region";

    // ⚠️ Laravel-style update via POST + _method
    if (editingId) {
      fd.append("_method", "PUT");
    }

    await apiFetch(endpoint, {
      method: "POST",
      body: fd,
    });

    resetForm();
    await loadData();
  } catch (error) {
    console.error("Gagal menyimpan kabupaten:", error);
    alert("Gagal menyimpan kabupaten");
  }
}


  /* ===================== HAPUS ===================== */
  async function remove(id: number): Promise<void> {
    if (!confirm("Yakin ingin menghapus kabupaten ini?")) return;

    try {
      await apiFetch(`/api/region/${id}`, { method: "DELETE" });
      loadData();
    } catch (error) {
      console.error("Gagal menghapus data", error);
    }
  }

  /* ===================== EDIT ===================== */
  function edit(region: RegionItem): void {
    setEditingId(region.id);
    setName(region.name);
    setLogo(null);
    setShowForm(true);
  }

  /* ===================== RESET ===================== */
  function resetForm(): void {
    setShowForm(false);
    setEditingId(null);
    setName("");
    setLogo(null);
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold text-blue-700 mb-6">
        Kategori Kabupaten
      </h2>

      {/* BUTTON TAMBAH */}
      <button
        onClick={() => {
          resetForm();
          setShowForm(true);
        }}
        className="px-4 py-2 bg-blue-600 text-white rounded mb-4"
      >
        + Tambah Kabupaten
      </button>

      {/* LIST */}
      <div className="bg-white rounded shadow p-4">
        {loading ? (
          <p className="text-gray-500">Memuat data...</p>
        ) : regions.length === 0 ? (
          <p className="text-gray-500">Belum ada kabupaten</p>
        ) : (
          <ul className="space-y-3">
            {regions.map((r) => (
              <li
                key={r.id}
                className="flex justify-between items-center border-b pb-2"
              >
                <div className="flex items-center gap-3">
                  {r.image_url && (
                    <img
                      src={r.image_url}
                      alt={r.name}
                      className="w-10 h-10 rounded object-cover"
                    />
                  )}
                  <span className="font-medium">{r.name}</span>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => edit(r)}
                    className="px-3 py-1 bg-yellow-500 text-white rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => remove(r.id)}
                    className="px-3 py-1 bg-red-600 text-white rounded"
                  >
                    Hapus
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {showForm && (
  <div className="fixed inset-0 z-50 flex items-center justify-center">
    {/* BACKDROP */}
    <div
      className="absolute inset-0 bg-black/50"
      onClick={resetForm}
    />

    {/* MODAL */}
    <div className="relative bg-white w-full max-w-md rounded-xl p-6 shadow-lg pointer-events-auto">
      <h3 className="text-lg font-semibold mb-4">
        {editingId ? "Edit Kabupaten" : "Tambah Kabupaten"}
      </h3>

      <div className="grid gap-3">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border p-2 rounded"
          placeholder="Nama kabupaten"
        />

        <input
          type="file"
          accept="image/*"
          onChange={(e) => setLogo(e.target.files?.[0] ?? null)}
          className="border p-2 rounded"
        />

        <div className="flex justify-end gap-2 mt-4">
          <button
            type="button"
            onClick={resetForm}
            className="px-4 py-2 bg-gray-200 rounded"
          >
            Batal
          </button>

          <button
            type="button"
            onClick={save}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            Simpan
          </button>
        </div>
      </div>
    </div>
  </div>
)}

    </div>
  );
}
