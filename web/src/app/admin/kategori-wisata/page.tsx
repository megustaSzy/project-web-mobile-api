"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/helpers/api";
import {
  ApiCategoryResponse,
  ApiBaseResponse,
  CategoryItem,
} from "@/types/category";

export default function KategoriWisataPage() {
  const [cats, setCats] = useState<CategoryItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [nameInput, setNameInput] = useState<string>("");

  const [saving, setSaving] = useState<boolean>(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  async function getData(): Promise<void> {
    try {
      setLoading(true);
      const res = await apiFetch<ApiCategoryResponse>("/api/category");
      setCats(res.data.items);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Gagal memuat data";
      setErrorMsg(msg);
    } finally {
      setLoading(false);
    }
  }

  async function saveCategory(): Promise<void> {
    if (!nameInput.trim()) {
      alert("Nama kategori wajib diisi.");
      return;
    }

    setSaving(true);

    const payload = { name: nameInput.trim() };
    const method = editId !== null ? "PUT" : "POST";
    const endpoint =
      editId !== null ? `/api/category/${editId}` : `/api/category`;

    try {
      await apiFetch<ApiBaseResponse>(endpoint, {
        method,
        body: JSON.stringify(payload),
      });

      setModalOpen(false);
      setNameInput("");
      setEditId(null);
      await getData();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Gagal menyimpan";
      setErrorMsg(msg);
      alert(msg);
    } finally {
      setSaving(false);
    }
  }

  async function deleteCategory(id: number): Promise<void> {
    if (!confirm("Yakin ingin menghapus kategori ini?")) return;

    setDeletingId(id);

    try {
      await apiFetch<ApiBaseResponse>(`/api/category/${id}`, {
        method: "DELETE",
      });

      await getData();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Gagal menghapus";
      setErrorMsg(msg);
      alert(msg);
    } finally {
      setDeletingId(null);
    }
  }

  function openAddModal() {
    setEditId(null);
    setNameInput("");
    setModalOpen(true);
  }

  function openEditModal(cat: CategoryItem) {
    setEditId(cat.id);
    setNameInput(cat.name);
    setModalOpen(true);
  }

  useEffect(() => {
    getData();
  }, []);

  return (
    <div>
      <h2 className="text-xl font-semibold text-blue-700 mb-4">
        Kategori Wisata
      </h2>

      <div className="bg-white p-4 rounded shadow">
        <button
          onClick={openAddModal}
          className="px-4 py-2 bg-blue-600 text-white rounded mb-4"
          disabled={saving}
        >
          + Tambah Kategori
        </button>

        {errorMsg && (
          <p className="text-red-600 font-medium mb-2">{errorMsg}</p>
        )}

        {loading ? (
          <p className="text-gray-500">Memuat...</p>
        ) : cats.length === 0 ? (
          <p className="text-gray-500">Tidak ada kategori tersedia.</p>
        ) : (
          <ul className="space-y-2">
            {cats.map((c) => (
              <li
                key={c.id}
                className="flex justify-between items-center border-b pb-2 text-sm"
              >
                <div>
                  <p className="font-medium">{c.name}</p>
                  <p className="text-xs text-gray-500">
                    {c.destinations?.length ?? 0} destinasi
                  </p>
                </div>

                <div className="space-x-2">
                  <button
                    onClick={() => openEditModal(c)}
                    className="px-2 py-1 bg-yellow-500 text-white rounded"
                    disabled={saving || deletingId !== null}
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => deleteCategory(c.id)}
                    className="px-2 py-1 bg-red-600 text-white rounded"
                    disabled={deletingId === c.id}
                  >
                    {deletingId === c.id ? "Menghapus..." : "Delete"}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {modalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow w-96">
            <h3 className="text-lg font-semibold mb-4">
              {editId !== null ? "Edit Kategori" : "Tambah Kategori"}
            </h3>

            <input
              type="text"
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              placeholder="Nama kategori"
              className="w-full border px-3 py-2 rounded mb-4"
            />

            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setModalOpen(false)}
                className="px-3 py-2 bg-gray-300 rounded"
              >
                Batal
              </button>

              <button
                onClick={saveCategory}
                className="px-3 py-2 bg-blue-600 text-white rounded"
                disabled={saving}
              >
                {saving ? "Menyimpan..." : "Simpan"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
