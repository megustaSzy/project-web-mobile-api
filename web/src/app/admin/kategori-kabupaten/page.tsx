/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useState, useCallback } from "react";
import { apiFetch } from "@/helpers/api";
import { RegionApiResponse, RegionItem } from "@/types/region";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
} from "@/components/ui/pagination";

export default function KategoriKabupaten() {
  const [regions, setRegions] = useState<RegionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [name, setName] = useState("");
  const [logo, setLogo] = useState<File | null>(null);

  const [saving, setSaving] = useState(false);
  // const [deletingId, setDeletingId] = useState<number | null>(null);

  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState<number | null>(null);

  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  /* ================= PAGINATION STATE ================= */
  const [page, setPage] = useState(1);
  const [perPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  /* ================= LOAD DATA ================= */
  const loadData = useCallback(async () => {
  try {
    setLoading(true);
    const res = await apiFetch<RegionApiResponse>(
      `/api/region?page=${page}&per_page=${perPage}`
    );

    setRegions(res.data.items);
    setTotalPages(res.data.total_pages);
  } catch {
    setErrorMsg("Gagal memuat data");
  } finally {
    setLoading(false);
  }
}, [page, perPage]);


  useEffect(() => {
    loadData();
  }, [loadData, page]);

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

      setPage(1);
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
    // setDeletingId(pendingDeleteId);

    try {
      await apiFetch(`/api/region/${pendingDeleteId}`, {
        method: "DELETE",
      });

      setSuccessMsg("Kabupaten berhasil dihapus");
      setTimeout(() => setSuccessMsg(null), 2000);

      setPage(1);
      await loadData();
    } catch {
      setErrorMsg("Gagal menghapus data");
    } finally {
      // setDeletingId(null);
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

      {successMsg && (
        <div className="fixed top-4 right-4 left-4 sm:left-auto bg-green-600 text-white px-5 py-3 rounded-xl shadow-lg z-50">
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
        <div className="flex justify-between items-center px-6 py-4 border-b">
          <h3 className="font-semibold text-gray-800">Daftar Kabupaten</h3>
          <button
            onClick={openAddModal}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm"
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
            {/* TABLE */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-4 text-center w-12">No</th>
                    <th className="px-6 py-4 text-center w-24">Foto</th>
                    <th className="px-6 py-4 text-left">Nama Kabupaten</th>
                    <th className="px-6 py-4 text-center w-40">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {regions.map((r, i) => (
                    <tr key={r.id}>
                      <td className="px-6 py-4 text-center">
                        {(page - 1) * perPage + i + 1}
                      </td>
                      <td className="px-6 py-4 text-center">
                        {r.imageUrl ? (
                          <img
                            src={r.imageUrl}
                            alt={r.name}
                            className="w-12 h-12 rounded-lg object-cover mx-auto"
                          />
                        ) : (
                          "N/A"
                        )}
                      </td>
                      <td className="px-6 py-4">{r.name}</td>
                      <td className="px-6 py-4 text-center space-x-2">
                        <button
                          onClick={() => openEditModal(r)}
                          className="px-3 py-1.5 bg-yellow-500 text-white rounded-full text-xs"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => openDeleteConfirm(r.id)}
                          className="px-3 py-1.5 bg-red-600 text-white rounded-full text-xs"
                        >
                          Hapus
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* PAGINATION */}
            {totalPages > 1 && (
              <Pagination className="py-4">
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => page > 1 && setPage(page - 1)}
                      className={page === 1 ? "opacity-50 pointer-events-none" : ""}
                    />
                  </PaginationItem>

                  {Array.from({ length: totalPages }).map((_, i) => (
                    <PaginationItem key={i}>
                      <PaginationLink
                        isActive={page === i + 1}
                        onClick={() => setPage(i + 1)}
                      >
                        {i + 1}
                      </PaginationLink>
                    </PaginationItem>
                  ))}

                  <PaginationItem>
                    <PaginationNext
                      onClick={() => page < totalPages && setPage(page + 1)}
                      className={
                        page === totalPages
                          ? "opacity-50 pointer-events-none"
                          : ""
                      }
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            )}
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
