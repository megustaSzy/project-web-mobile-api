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

  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState<number | null>(null);

  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  async function getData() {
    try {
      setLoading(true);
      const res = await apiFetch<ApiCategoryResponse>("/api/category");
      setCats(res.data.items);
    } catch {
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
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-blue-700">Kategori Wisata</h2>

      {/* SUCCESS POPUP */}
      {successMsg && (
        <div className="fixed top-4 right-4 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg z-50">
          {successMsg}
        </div>
      )}

      <div className="bg-white rounded-2xl border shadow-sm">
        {/* HEADER */}
        <div className="flex justify-between items-center px-6 py-4 border-b">
          <h3 className="font-semibold text-gray-800">Daftar Kategori</h3>

          <button
            onClick={openAddModal}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm"
          >
            + Tambah
          </button>
        </div>

        {/* CONTENT */}
        {loading ? (
          <p className="p-6 text-gray-500">Memuat data...</p>
        ) : cats.length === 0 ? (
          <p className="p-6 text-gray-500">Belum ada kategori.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full table-fixed text-sm">
              <thead className="bg-gray-50 border-b">
                <tr className="text-gray-600">
                  <th className="w-16 px-4 py-3 text-center">No</th>
                  <th className="px-4 py-3 text-left">Nama Kategori</th>
                  <th className="w-40 px-4 py-3 text-center">Jumlah</th>
                  <th className="w-40 px-4 py-3 text-center">Aksi</th>
                </tr>
              </thead>

              <tbody className="divide-y">
                {cats.map((c, i) => (
                  <tr key={c.id} className="hover:bg-gray-50 transition">
                    {/* NO */}
                    <td className="px-4 py-3 text-center text-gray-400">
                      {i + 1}
                    </td>

                    {/* NAMA */}
                    <td className="px-4 py-3 font-medium text-gray-800">
                      {c.name}
                    </td>

                    {/* JUMLAH */}
                    <td className="px-4 py-3 text-center">
                      <span className="px-2 py-1 bg-gray-100 rounded-full text-xs text-gray-600">
                        {c.destinations?.length ?? 0} destinasi
                      </span>
                    </td>

                    {/* AKSI */}
                    <td className="px-4 py-3">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => openEditModal(c)}
                          className="px-3 py-1.5 bg-yellow-500 hover:bg-yellow-600 text-white rounded-full text-xs"
                        >
                          Edit
                        </button>

                        <button
                          onClick={() => openDeleteConfirm(c.id)}
                          disabled={deletingId === c.id}
                          className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-full text-xs"
                        >
                          {deletingId === c.id ? "Menghapus..." : "Hapus"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* MODAL ADD / EDIT */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-2xl shadow-xl w-96">
            <h3 className="text-lg font-semibold mb-4">
              {editId ? "Edit Kategori" : "Tambah Kategori"}
            </h3>

            <input
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 mb-4 focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Nama kategori"
            />

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setModalOpen(false)}
                className="px-4 py-2 bg-gray-100 rounded-lg"
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

      {/* MODAL DELETE */}
      {confirmDeleteOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-2xl shadow-xl w-96">
            <h3 className="text-lg font-semibold mb-2">Konfirmasi</h3>
            <p className="text-sm text-gray-600 mb-6">
              Yakin ingin menghapus kategori ini?
            </p>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setConfirmDeleteOpen(false)}
                className="px-4 py-2 bg-gray-100 rounded-lg"
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
