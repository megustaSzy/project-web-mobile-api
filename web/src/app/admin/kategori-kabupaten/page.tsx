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

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Plus, AlertCircle, CheckCircle2 } from "lucide-react";

import KabupatenTable from "@/components/admin/kategori-kabupaten/KabupatenTable";
import KabupatenFormModal from "@/components/admin/kategori-kabupaten/KabupatenFormModal";
import KabupatenDeleteModal from "@/components/admin/kategori-kabupaten/KabupatenDeleteModal";

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

  const [page, setPage] = useState(1);
  const perPage = 10;
  const [totalPages, setTotalPages] = useState(1);

  /* ================= FETCH ================= */
  const getData = useCallback(async () => {
    try {
      setLoading(true);
      const res = await apiFetch<RegionApiResponse>(
        `/api/region/admin?page=${page}&per_page=${perPage}`
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
          method: "PATCH",
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
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-blue-700 tracking-tight">
          Kategori Kabupaten
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Kelola data kabupaten dan wilayah
        </p>
      </div>

      {/* SUCCESS TOAST */}
      {successMsg && (
        <Alert className="fixed top-4 right-4 bg-green-600 text-white border-green-700 shadow-lg z-50 w-auto">
          <CheckCircle2 className="h-4 w-4" />
          <AlertDescription>{successMsg}</AlertDescription>
        </Alert>
      )}

      {/* ERROR ALERT */}
      {errorMsg && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{errorMsg}</AlertDescription>
        </Alert>
      )}

      <Card className="rounded-2xl shadow-sm">
        <CardHeader className="border-b">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-gray-800">Daftar Kabupaten</CardTitle>
              <CardDescription className="mt-1">
                Total {regions.length} kabupaten
              </CardDescription>
            </div>
            <Button
              onClick={openAddModal}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Tambah
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-6 w-6 animate-spin text-blue-600 mr-2" />
              <p className="text-gray-500">Memuat data...</p>
            </div>
          ) : regions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <p className="text-gray-500 text-sm">Belum ada kabupaten.</p>
              <Button
                variant="outline"
                size="sm"
                onClick={openAddModal}
                className="mt-4"
              >
                <Plus className="h-4 w-4 mr-2" />
                Tambah Kabupaten Pertama
              </Button>
            </div>
          ) : (
            <>
              <KabupatenTable
                regions={regions}
                page={page}
                perPage={perPage}
                deletingId={deletingId}
                onEdit={openEditModal}
                onDelete={openDeleteConfirm}
              />

              {totalPages > 1 && (
                <div className="border-t py-4">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          onClick={() => page > 1 && setPage(page - 1)}
                          className={
                            page === 1
                              ? "pointer-events-none opacity-50"
                              : "cursor-pointer"
                          }
                        />
                      </PaginationItem>

                      {Array.from({ length: totalPages }).map((_, i) => (
                        <PaginationItem key={i}>
                          <PaginationLink
                            isActive={page === i + 1}
                            onClick={() => setPage(i + 1)}
                            className="cursor-pointer"
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
                              ? "pointer-events-none opacity-50"
                              : "cursor-pointer"
                          }
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* MODALS */}
      <KabupatenFormModal
        open={modalOpen}
        editId={editId}
        nameInput={nameInput}
        saving={saving}
        onClose={() => setModalOpen(false)}
        onSave={saveRegion}
        onNameChange={setNameInput}
        onImageChange={setImage}
      />

      <KabupatenDeleteModal
        open={confirmDeleteOpen}
        onCancel={() => setConfirmDeleteOpen(false)}
        onConfirm={deleteRegion}
      />
    </div>
  );
}
