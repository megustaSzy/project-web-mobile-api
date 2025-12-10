"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/helpers/api";
import {  ApiPickupItem, ApiPickupResponse, PickupType } from "@/types/pickupLocation";

export default function PickupPage() {
  const [items, setItems] = useState<PickupType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [nameInput, setNameInput] = useState<string>("");

  const [saving, setSaving] = useState<boolean>(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  // ────────────────────────────────────────────────
  // GET DATA dari backend
  async function getData(): Promise<void> {
    try {
      setLoading(true);
      const res = await apiFetch<ApiPickupResponse>("/api/pickup-locations");

      const mapped: PickupType[] = res.data.items.map((i: ApiPickupItem) => ({
        id: i.id,
        name: i.name,
      }));

      setItems(mapped);
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : "Gagal memuat data pickup";
      setErrorMsg(msg);
    } finally {
      setLoading(false);
    }
  }

  // ────────────────────────────────────────────────
  // SIMPAN (ADD / EDIT)
  async function savePickup(): Promise<void> {
    if (!nameInput.trim()) {
      alert("Nama lokasi wajib diisi.");
      return;
    }

    setSaving(true);

    const payload = { name: nameInput.trim() };
    const method = editId !== null ? "PUT" : "POST";
    const endpoint =
      editId !== null
        ? `/api/pickup-locations/${editId}`
        : `/api/pickup-locations`;

    try {
      await apiFetch<ApiPickupResponse>(endpoint, {
        method,
        body: JSON.stringify(payload),
      });

      setModalOpen(false);
      setNameInput("");
      setEditId(null);

      await getData();
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : "Gagal menyimpan data pickup";
      setErrorMsg(msg);
      alert(msg);
    } finally {
      setSaving(false);
    }
  }

  // ────────────────────────────────────────────────
  // DELETE
  async function deletePickup(id: number): Promise<void> {
    if (!confirm("Yakin ingin menghapus lokasi ini?")) return;

    setDeletingId(id);

    try {
      await apiFetch<ApiPickupResponse>(`/api/pickup-locations/${id}`, {
        method: "DELETE",
      });

      await getData();
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : "Gagal menghapus data pickup";
      setErrorMsg(msg);
      alert(msg);
    } finally {
      setDeletingId(null);
    }
  }

  // ────────────────────────────────────────────────
  // Open Modal Untuk Tambah
  function openAddModal(): void {
    setEditId(null);
    setNameInput("");
    setModalOpen(true);
  }

  // Open Modal Untuk Edit
  function openEditModal(item: PickupType): void {
    setEditId(item.id);
    setNameInput(item.name);
    setModalOpen(true);
  }

  useEffect(() => {
    getData();
  }, []);

  // ────────────────────────────────────────────────
  return (
    <div>
      <h2 className="text-xl font-semibold text-blue-700 mb-4">
        Pickup Penjemputan
      </h2>

      <div className="bg-white p-4 rounded shadow">
        <button
          onClick={openAddModal}
          className="px-4 py-2 bg-blue-600 text-white rounded mb-4"
          disabled={saving}
        >
          + Tambah Lokasi Pickup
        </button>

        {errorMsg && <p className="text-red-600 mb-2">{errorMsg}</p>}

        {loading ? (
          <p className="text-gray-500">Memuat...</p>
        ) : items.length === 0 ? (
          <p className="text-gray-500">Belum ada lokasi penjemputan.</p>
        ) : (
          <ul className="space-y-2">
            {items.map((item) => (
              <li
                key={item.id}
                className="flex justify-between items-center border-b pb-2 text-sm"
              >
                <span>{item.name}</span>

                <div className="space-x-2">
                  <button
                    onClick={() => openEditModal(item)}
                    className="px-2 py-1 bg-yellow-500 text-white rounded"
                    disabled={saving || deletingId !== null}
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => deletePickup(item.id)}
                    className="px-2 py-1 bg-red-600 text-white rounded"
                    disabled={deletingId === item.id}
                  >
                    {deletingId === item.id ? "Menghapus..." : "Delete"}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow w-96">
            <h3 className="text-lg font-semibold mb-4">
              {editId !== null ? "Edit Lokasi Pickup" : "Tambah Lokasi Pickup"}
            </h3>

            <input
              type="text"
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              placeholder="Nama lokasi"
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
                onClick={savePickup}
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
