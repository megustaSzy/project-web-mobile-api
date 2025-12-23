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
  const [loading, setLoading] = useState(true);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [nameInput, setNameInput] = useState("");

  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  // 🔹 confirm delete
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState<number | null>(null);

  // 🔹 success popup
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  async function getData() {
    try {
      setLoading(true);
      const res = await apiFetch<ApiCategoryResponse>("/api/category");
      setCats(res.data.items);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      setErrorMsg("Gagal memuat data");
    } finally {
      setLoading(false);
    }
  }

  async function saveCategory() {
    if (!nameInput.trim()) return;

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

      setSuccessMsg(
        method === "POST"
          ? "Kategori berhasil ditambahkan"
          : "Kategori berhasil diperbarui"
      );

      setTimeout(() => setSuccessMsg(null), 2000);
      await getData();
    } catch {
      setErrorMsg("Gagal menyimpan data");
    } finally {
      setSaving(false);
    }
  }

  async function deleteCategory() {
    if (!pendingDeleteId) return;

    setDeletingId(pendingDeleteId);

    try {
      await apiFetch<ApiBaseResponse>(`/api/category/${pendingDeleteId}`, {
        method: "DELETE",
      });

      setSuccessMsg("Kategori berhasil dihapus");
      setTimeout(() => setSuccessMsg(null), 2000);

      await getData();
    } catch {
      setErrorMsg("Gagal menghapus data");
    } finally {
      setDeletingId(null);
      setPendingDeleteId(null);
      setConfirmDeleteOpen(false);
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

  function openDeleteConfirm(id: number) {
    setPendingDeleteId(id);
    setConfirmDeleteOpen(true);
  }

  useEffect(() => {
    getData();
  }, []);

  return (
    <div>
      <h2 className="text-xl font-semibold text-blue-700 mb-4">
        Kategori Wisata
      </h2>

      {/* Success Popup */}
      {successMsg && (
        <div className="fixed top-6 right-6 bg-green-600 text-white px-4 py-3 rounded-lg shadow-lg z-50 animate-fade-in">
          {successMsg}
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border">
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="font-semibold text-gray-700">Daftar Kategori</h3>

          <button
            onClick={openAddModal}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm"
          >
            + Tambah
          </button>
        </div>

        {loading ? (
          <p className="p-4 text-gray-500">Memuat...</p>
        ) : cats.length === 0 ? (
          <p className="p-4 text-gray-500">Belum ada kategori.</p>
        ) : (
          <ul className="divide-y">
            {cats.map((c) => (
              <li
                key={c.id}
                className="flex justify-between items-center p-4 hover:bg-gray-50"
              >
                <div>
                  <p className="font-medium">{c.name}</p>
                  <p className="text-xs text-gray-500">
                    {c.destinations?.length ?? 0} destinasi
                  </p>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => openEditModal(c)}
                    className="px-3 py-1 bg-yellow-500 text-white rounded-lg text-sm"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => openDeleteConfirm(c.id)}
                    disabled={deletingId === c.id}
                    className="px-3 py-1 bg-red-600 text-white rounded-lg text-sm"
                  >
                    {deletingId === c.id ? "Menghapus..." : "Hapus"}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Modal Add/Edit */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow w-96">
            <h3 className="text-lg font-semibold mb-4">
              {editId ? "Edit Kategori" : "Tambah Kategori"}
            </h3>

            <input
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              className="w-full border px-3 py-2 rounded mb-4"
              placeholder="Nama kategori"
            />

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setModalOpen(false)}
                className="px-4 py-2 bg-gray-200 rounded-lg"
              >
                Batal
              </button>

              <button
                onClick={saveCategory}
                disabled={saving}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg"
              >
                {saving ? "Menyimpan..." : "Simpan"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Confirm Delete */}
      {confirmDeleteOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow w-96">
            <h3 className="text-lg font-semibold mb-2">Konfirmasi</h3>
            <p className="text-sm text-gray-600 mb-6">
              Yakin ingin menghapus kategori ini?
            </p>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setConfirmDeleteOpen(false)}
                className="px-4 py-2 bg-gray-200 rounded-lg"
              >
                Batal
              </button>

              <button
                onClick={deleteCategory}
                className="px-4 py-2 bg-red-600 text-white rounded-lg"
              >
                Ya, Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
