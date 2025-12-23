"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/helpers/api";
import {
  ApiPickupItem,
  ApiPickupResponse,
  PickupType,
} from "@/types/pickupLocation";

export default function PickupPage() {
  const [items, setItems] = useState<PickupType[]>([]);
  const [loading, setLoading] = useState(true);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [nameInput, setNameInput] = useState("");

  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  // 🔴 CONFIRM DELETE
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState<number | null>(null);

  // ==================================================
  type PickupListResponse = {
    status: number;
    message: string;
    data: ApiPickupItem[];
  };

  async function getData(): Promise<void> {
    try {
      setLoading(true);
      setErrorMsg(null);

      const res = await apiFetch<PickupListResponse>(
        "/api/pickup-locations"
      );

      const rawItems = Array.isArray(res.data) ? res.data : [];
      const mapped: PickupType[] = rawItems.map((i) => ({
        id: i.id,
        name: i.name,
      }));

      setItems(mapped);
    } catch {
      setErrorMsg("Gagal memuat data pickup");
      setItems([]);
    } finally {
      setLoading(false);
    }
  }

  // ==================================================
  // SAVE
  async function savePickup(): Promise<void> {
    if (!nameInput.trim()) return;

    setSaving(true);

    const payload = { name: nameInput.trim() };
    const method = editId ? "PUT" : "POST";
    const endpoint = editId
      ? `/api/pickup-locations/${editId}`
      : "/api/pickup-locations";

    try {
      await apiFetch<ApiPickupResponse>(endpoint, {
        method,
        body: JSON.stringify(payload),
      });

      setModalOpen(false);
      setNameInput("");
      setEditId(null);

      setSuccessMsg(
        method === "POST"
          ? "Lokasi pickup berhasil ditambahkan"
          : "Lokasi pickup berhasil diperbarui"
      );
      setTimeout(() => setSuccessMsg(null), 2000);

      await getData();
    } catch {
      setErrorMsg("Gagal menyimpan data pickup");
    } finally {
      setSaving(false);
    }
  }

  // ==================================================
  // DELETE
  async function deletePickup(): Promise<void> {
    if (!pendingDeleteId) return;

    setDeletingId(pendingDeleteId);

    try {
      await apiFetch(
        `/api/pickup-locations/${pendingDeleteId}`,
        { method: "DELETE" }
      );

      setSuccessMsg("Lokasi pickup berhasil dihapus");
      setTimeout(() => setSuccessMsg(null), 2000);

      await getData();
    } catch {
      setErrorMsg("Gagal menghapus data pickup");
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

  function openEditModal(item: PickupType) {
    setEditId(item.id);
    setNameInput(item.name);
    setModalOpen(true);
  }

  function openDeleteConfirm(id: number) {
    setPendingDeleteId(id);
    setConfirmDeleteOpen(true);
  }

  useEffect(() => {
    getData();
  }, [ ]);// eslint-disable-line react-hooks/exhaustive-deps

  // ==================================================
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-blue-700">
        Pickup Penjemputan
      </h2>

      {/* SUCCESS POPUP */}
      {successMsg && (
        <div className="fixed top-6 right-6 bg-green-600 text-white px-5 py-3 rounded-xl shadow-lg z-50">
          {successMsg}
        </div>
      )}

      <div className="bg-white rounded-2xl border shadow-sm">
        <div className="flex justify-between items-center px-6 py-4 border-b">
          <h3 className="font-semibold text-gray-800">
            Daftar Lokasi Pickup
          </h3>

          <button
            onClick={openAddModal}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm"
          >
            + Tambah
          </button>
        </div>

        {loading ? (
          <p className="p-6 text-gray-500">Memuat data...</p>
        ) : items.length === 0 ? (
          <p className="p-6 text-gray-500">
            Belum ada lokasi pickup.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <colgroup>
                <col style={{ width: "60px" }} />
                <col />
                <col style={{ width: "160px" }} />
              </colgroup>

              <thead className="bg-gray-50 border-b">
                <tr className="text-gray-600">
                  <th className="px-4 py-3 text-center">
                    No
                  </th>
                  <th className="px-4 py-3 text-left">
                    Nama Lokasi
                  </th>
                  <th className="px-4 py-3 text-center">
                    Aksi
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y">
                {items.map((item, i) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-center text-gray-400">
                      {i + 1}
                    </td>

                    <td className="px-4 py-3 font-medium">
                      {item.name}
                    </td>

                    <td className="px-4 py-3">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() =>
                            openEditModal(item)
                          }
                          className="px-3 py-1.5 bg-yellow-500 hover:bg-yellow-600 text-white rounded-full text-xs"
                        >
                          Edit
                        </button>

                        <button
                          onClick={() =>
                            openDeleteConfirm(item.id)
                          }
                          disabled={
                            deletingId === item.id
                          }
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
          </div>
        )}
      </div>

      {/* MODAL ADD / EDIT */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl w-96 p-6">
            <h3 className="text-lg font-semibold mb-4">
              {editId
                ? "Edit Lokasi Pickup"
                : "Tambah Lokasi Pickup"}
            </h3>

            <input
              value={nameInput}
              onChange={(e) =>
                setNameInput(e.target.value)
              }
              className="w-full border rounded-lg px-3 py-2 mb-4 focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Nama lokasi pickup"
            />

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setModalOpen(false)}
                className="px-4 py-2 bg-gray-100 rounded-lg"
              >
                Batal
              </button>

              <button
                onClick={savePickup}
                disabled={saving}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg"
              >
                {saving ? "Menyimpan..." : "Simpan"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL CONFIRM DELETE */}
      {confirmDeleteOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl w-96 p-6">
            <h3 className="text-lg font-semibold mb-2">
              Konfirmasi
            </h3>
            <p className="text-sm text-gray-600 mb-6">
              Yakin ingin menghapus lokasi pickup ini?
            </p>

            <div className="flex justify-end gap-2">
              <button
                onClick={() =>
                  setConfirmDeleteOpen(false)
                }
                className="px-4 py-2 bg-gray-100 rounded-lg"
              >
                Batal
              </button>

              <button
                onClick={deletePickup}
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
