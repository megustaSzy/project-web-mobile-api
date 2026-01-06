"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { apiFetch } from "@/helpers/api";
import {
  ApiDestinationItem,
  ApiDestinationsResponse,
} from "@/types/destination";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
} from "@/components/ui/pagination";

export default function DestinasiList() {
  const [items, setItems] = useState<ApiDestinationItem[]>([]);
  const [loading, setLoading] = useState(true);

  // 🔹 Pagination state
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  // 🔹 Load data (useCallback agar aman di useEffect)
  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await apiFetch<ApiDestinationsResponse>(
        `/api/destinations?page=${page}&limit=${limit}`
      );

      setItems(res.data.items);
      setTotalPages(res.data.total_pages);
    } catch (err) {
      console.error(err);
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [page, limit]);

  // 🔹 Trigger load saat page berubah
  useEffect(() => {
    load();
  }, [load]);

  async function handleDelete(id: number) {
    if (!confirm("Hapus destinasi ini?")) return;
    try {
      await apiFetch(`/destinations/${id}`, { method: "DELETE" });

      // kalau halaman terakhir & item tinggal 1
      if (items.length === 1 && page > 1) {
        setPage((p) => p - 1);
      } else {
        load();
      }
    } catch (err) {
      console.error(err);
      alert("Gagal menghapus destinasi");
    }
  }

  return (
    <div className="space-y-4">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
        <h2 className="text-xl font-semibold text-blue-700">
          Manajemen Destinasi
        </h2>

        <Link
          href="/admin/destinasi/tambah"
          className="w-full sm:w-auto px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm text-center"
        >
          + Tambah Destinasi
        </Link>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-2xl border shadow-sm overflow-x-auto">
        {loading ? (
          <p className="p-6 text-gray-500">Memuat data...</p>
        ) : items.length === 0 ? (
          <p className="p-6 text-gray-500">Belum ada destinasi.</p>
        ) : (
          <>
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr className="text-gray-600">
                  <th className="px-6 py-4 text-center w-12">No</th>
                  <th className="px-6 py-4 text-center w-24">Foto</th>
                  <th className="px-6 py-4 text-left">Nama Destinasi</th>
                  <th className="px-6 py-4 text-left">Kategori</th>
                  <th className="px-6 py-4 text-left">Harga</th>
                  <th className="px-6 py-4 text-center w-40">Aksi</th>
                </tr>
              </thead>

              <tbody className="divide-y">
                {items.map((it, i) => (
                  <tr key={it.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-center text-gray-500">
                      {(page - 1) * limit + i + 1}
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex justify-center">
                        {it.imageUrl ? (
                          <Image
                            src={it.imageUrl}
                            alt={it.name}
                            width={48}
                            height={48}
                            unoptimized
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
                      {it.name}
                    </td>

                    <td className="px-6 py-4">{it.category.name}</td>

                    <td className="px-6 py-4">
                      Rp.{it.price.toLocaleString("id-ID")}
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex justify-center gap-2">
                        <Link
                          href={`/admin/destinasi/edit/${it.id}`}
                          className="px-3 py-1.5 bg-yellow-500 hover:bg-yellow-600 text-white rounded-full text-xs"
                        >
                          Edit
                        </Link>

                        <button
                          onClick={() => handleDelete(it.id)}
                          className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-full text-xs"
                        >
                          Hapus
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* PAGINATION */}
            {totalPages > 1 && (
              <Pagination className="py-4">
                <PaginationContent>
                  {/* PREV */}
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => page > 1 && setPage(page - 1)}
                      className={
                        page === 1 ? "pointer-events-none opacity-50" : ""
                      }
                    />
                  </PaginationItem>

                  {/* PAGE NUMBER */}
                  {Array.from({ length: totalPages }).map((_, i) => {
                    const pageNumber = i + 1;
                    return (
                      <PaginationItem key={pageNumber}>
                        <PaginationLink
                          isActive={page === pageNumber}
                          onClick={() => setPage(pageNumber)}
                        >
                          {pageNumber}
                        </PaginationLink>
                      </PaginationItem>
                    );
                  })}

                  {/* NEXT */}
                  <PaginationItem>
                    <PaginationNext
                      onClick={() => page < totalPages && setPage(page + 1)}
                      className={
                        page === totalPages
                          ? "pointer-events-none opacity-50"
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
    </div>
  );
}
