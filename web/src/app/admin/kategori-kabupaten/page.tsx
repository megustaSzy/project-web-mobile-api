/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/helpers/api";
import { RegionApiResponse, RegionItem } from "@/types/region";

export default function KategoriKabupaten() {
  const [regions, setRegions] = useState<RegionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [name, setName] = useState("");
  const [logo, setLogo] = useState<File | null>(null);

  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState<number | null>(null);

  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  /* ================= LOAD DATA ================= */
  async function loadData() {
    try {
      setLoading(true);
      const res = await apiFetch<RegionApiResponse>("/api/region");
      setRegions(res.data.items);
    } catch {
      setErrorMsg("Gagal memuat data");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  /* ================= SIMPAN ================= */
  async function save() {
    if (!name.trim()) return;
    setSaving(true);

    try {
      const fd = new FormData();
      fd.append("name", name);
      if (logo) fd.append("image", logo);

      const endpoint = editId ? `/api/region/${editId}` : "/api/region";
      if (editId) fd.append("_method", "PUT");

      await apiFetch(endpoint, { method: "POST", body: fd });

      setModalOpen(false);
      setName("");
      setLogo(null);
      setEditId(null);

      setSuccessMsg(
        editId
          ? "Kabupaten berhasil diperbarui"
          : "Kabupaten berhasil ditambahkan"
      );
      setTimeout(() => setSuccessMsg(null), 2000);

      await loadData();
    } catch {
      setErrorMsg("Gagal menyimpan data");
    } finally {
      setSaving(false);
    }
  }

  /* ================= HAPUS ================= */
  async function deleteRegion() {
    if (!pendingDeleteId) return;
    setDeletingId(pendingDeleteId);

    try {
      await apiFetch(`/api/region/${pendingDeleteId}`, {
        method: "DELETE",
      });

      setSuccessMsg("Kabupaten berhasil dihapus");
      setTimeout(() => setSuccessMsg(null), 2000);
      await loadData();
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
    setName("");
    setLogo(null);
    setModalOpen(true);
  }

  function openEditModal(region: RegionItem) {
    setEditId(region.id);
    setName(region.name);
    setLogo(null);
    setModalOpen(true);
  }

  function openDeleteConfirm(id: number) {
    setPendingDeleteId(id);
    setConfirmDeleteOpen(true);
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-blue-700">
        Kategori Kabupaten
      </h2>

      {/* SUCCESS */}
      {successMsg && (
        <div className="fixed top-4 right-4 left-4 sm:left-auto bg-green-600 text-white px-5 py-3 rounded-xl shadow-lg z-50 text-center sm:text-left">
          {successMsg}
        </div>
      )}

      {errorMsg && (
        <div className="bg-red-100 text-red-700 px-4 py-2 rounded-lg">
          {errorMsg}
        </div>
      )}

      <div className="bg-white rounded-2xl border shadow-sm">
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 px-4 sm:px-6 py-4 border-b">
          <h3 className="font-semibold text-gray-800">Daftar Kabupaten</h3>
          <button
            onClick={openAddModal}
            className="w-full sm:w-auto px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm"
          >
            + Tambah
          </button>
        </div>

        {/* CONTENT */}
        {loading ? (
          <p className="p-6 text-gray-500">Memuat data...</p>
        ) : regions.length === 0 ? (
          <p className="p-6 text-gray-500">Belum ada kabupaten.</p>
        ) : (
          <>
            {/* MOBILE CARD */}
            <div className="md:hidden divide-y">
              {regions.map((r, i) => (
                <div key={r.id} className="p-4 flex gap-4">
                  <div className="shrink-0">
                    {r.imageUrl ? (
                      <img
                        src={r.imageUrl}
                        alt={r.name}
                        className="w-14 h-14 rounded-lg object-cover ring-1 ring-gray-200"
                      />
                    ) : (
                      <div className="w-14 h-14 flex items-center justify-center rounded-lg bg-gray-100 text-gray-400 text-xs">
                        N/A
                      </div>
                    )}
                  </div>

                  <div className="flex-1">
                    <p className="text-xs text-gray-500">#{i + 1}</p>
                    <p className="font-medium text-gray-800">{r.name}</p>

                    <div className="flex gap-2 mt-3">
                      <button
                        onClick={() => openEditModal(r)}
                        className="flex-1 px-3 py-1.5 bg-yellow-500 text-white rounded-lg text-xs"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => openDeleteConfirm(r.id)}
                        disabled={deletingId === r.id}
                        className="flex-1 px-3 py-1.5 bg-red-600 text-white rounded-lg text-xs"
                      >
                        {deletingId === r.id ? "Menghapus..." : "Hapus"}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* DESKTOP TABLE */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b">
                  <tr className="text-gray-600">
                    <th className="px-6 py-4 text-center w-12">No</th>
                    <th className="px-6 py-4 text-center w-24">Foto</th>
                    <th className="px-6 py-4 text-left">Nama Kabupaten</th>
                    <th className="px-6 py-4 text-center w-40">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {regions.map((r, i) => (
                    <tr key={r.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-center text-gray-500">
                        {i + 1}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-center">
                          {r.imageUrl ? (
                            <img
                              src={r.imageUrl}
                              alt={r.name}
                              className="w-12 h-12 rounded-lg object-cover ring-1 ring-gray-200"
                            />
                          ) : (
                            <div className="w-12 h-12 flex items-center justify-center rounded-lg bg-gray-100 text-gray-400 text-xs">
                              N/A
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 font-medium text-gray-800">
                        {r.name}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() => openEditModal(r)}
                            className="px-3 py-1.5 bg-yellow-500 text-white rounded-full text-xs"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => openDeleteConfirm(r.id)}
                            disabled={deletingId === r.id}
                            className="px-3 py-1.5 bg-red-600 text-white rounded-full text-xs"
                          >
                            {deletingId === r.id ? "Menghapus..." : "Hapus"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      {/* MODAL ADD / EDIT */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl w-[90%] sm:w-96 p-6">
            <h3 className="text-lg font-semibold mb-4">
              {editId ? "Edit Kabupaten" : "Tambah Kabupaten"}
            </h3>

            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nama kabupaten"
              className="w-full border rounded-lg px-3 py-2 mb-3 focus:ring-2 focus:ring-blue-500 outline-none"
            />

            <input
              type="file"
              accept="image/*"
              onChange={(e) => setLogo(e.target.files?.[0] ?? null)}
              className="w-full border rounded-lg px-3 py-2 mb-5"
            />

            <div className="flex flex-col sm:flex-row justify-end gap-2">
              <button
                onClick={() => setModalOpen(false)}
                className="px-4 py-2 bg-gray-100 rounded-lg text-sm"
              >
                Batal
              </button>
              <button
                onClick={save}
                disabled={saving}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm"
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
          <div className="bg-white rounded-2xl shadow-xl w-[90%] sm:w-96 p-6">
            <h3 className="text-lg font-semibold mb-2">Konfirmasi</h3>
            <p className="text-sm text-gray-600 mb-6">
              Yakin ingin menghapus kabupaten ini?
            </p>

            <div className="flex flex-col sm:flex-row justify-end gap-2">
              <button
                onClick={() => setConfirmDeleteOpen(false)}
                className="px-4 py-2 bg-gray-100 rounded-lg text-sm"
              >
                Batal
              </button>
              <button
                onClick={deleteRegion}
                className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm"
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
