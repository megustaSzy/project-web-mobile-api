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
  const [nameInput, setNameInput] = useState("");
  const [image, setImage] = useState<File | null>(null);

  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState<number | null>(null);

  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  /* ================= PAGINATION ================= */
  const [page, setPage] = useState(1);
  const perPage = 10;
  const [totalPages, setTotalPages] = useState(1);

  /* ================= LOAD DATA ================= */
  const getData = useCallback(async () => {
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
  }, [page]);

  useEffect(() => {
    getData();
  }, [getData]);

  /* ================= SAVE ================= */
  async function saveRegion() {
    if (!nameInput.trim()) return;

    setSaving(true);

    try {
      const fd = new FormData();
      fd.append("name", nameInput.trim());
      if (image) fd.append("image", image);

      if (editId !== null) {
        await apiFetch(`/api/region/${editId}`, {
          method: "PUT",
          body: fd,
        });
      } else {
        await apiFetch(`/api/region`, {
          method: "POST",
          body: fd,
        });
      }

      setModalOpen(false);
      setNameInput("");
      setImage(null);
      setEditId(null);

      setSuccessMsg(
        editId
          ? "Kabupaten berhasil diperbarui"
          : "Kabupaten berhasil ditambahkan"
      );
      setTimeout(() => setSuccessMsg(null), 2000);

      await getData();
    } catch {
      setErrorMsg("Gagal menyimpan data");
    } finally {
      setSaving(false);
    }
  }

  /* ================= DELETE ================= */
  async function deleteRegion() {
    if (!pendingDeleteId) return;

    setDeletingId(pendingDeleteId);

    try {
      await apiFetch(`/api/region/${pendingDeleteId}`, {
        method: "DELETE",
      });

      setSuccessMsg("Kabupaten berhasil dihapus");
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

  /* ================= MODAL HANDLER ================= */
  function openAddModal() {
    setEditId(null);
    setNameInput("");
    setImage(null);
    setModalOpen(true);
  }

  function openEditModal(region: RegionItem) {
    setEditId(region.id);
    setNameInput(region.name);
    setImage(null);
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
        <div className="fixed top-4 right-4 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg z-50">
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
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="w-16 px-4 py-3 text-center">No</th>
                    <th className="w-24 px-4 py-3 text-center">Foto</th>
                    <th className="px-4 py-3 text-left">Nama Kabupaten</th>
                    <th className="w-40 px-4 py-3 text-center">Aksi</th>
                  </tr>
                </thead>

                <tbody className="divide-y">
                  {regions.map((r, i) => (
                    <tr key={r.id}>
                      <td className="text-center text-gray-400">
                        {(page - 1) * perPage + i + 1}
                      </td>

                      <td className="text-center">
                        {r.imageUrl ? (
                          // eslint-disable-next-line jsx-a11y/alt-text
                          <img
                            src={r.imageUrl}
                            className="w-12 h-12 mx-auto rounded-lg object-cover"
                          />
                        ) : (
                          "-"
                        )}
                      </td>

                      <td className="px-4 py-3 font-medium">{r.name}</td>

                      <td className="px-4 py-3">
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

            {/* PAGINATION */}
            {totalPages > 1 && (
              <Pagination className="py-4">
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => page > 1 && setPage(page - 1)}
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
          <div className="bg-white p-6 rounded-2xl shadow-xl w-96">
            <h3 className="text-lg font-semibold mb-4">
              {editId ? "Edit Kabupaten" : "Tambah Kabupaten"}
            </h3>

            <input
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 mb-3"
              placeholder="Nama kabupaten"
            />

            <input
              type="file"
              onChange={(e) => setImage(e.target.files?.[0] ?? null)}
              className="w-full border rounded-lg px-3 py-2 mb-4"
            />

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setModalOpen(false)}
                className="px-4 py-2 bg-gray-100 rounded-lg"
              >
                Batal
              </button>

              <button
                onClick={saveRegion}
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
              Yakin ingin menghapus kabupaten ini?
            </p>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setConfirmDeleteOpen(false)}
                className="px-4 py-2 bg-gray-100 rounded-lg"
              >
                Batal
              </button>

              <button
                onClick={deleteRegion}
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
