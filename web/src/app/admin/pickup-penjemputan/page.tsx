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
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [nameInput, setNameInput] = useState("");

  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  // ==================================================
  // GET DATA
  type PickupListResponse = {
  status: number;
  message: string;
  data: ApiPickupItem[];
};

async function getData(): Promise<void> {
  try {
    setLoading(true);
    setErrorMsg(null);

    const res = await apiFetch<PickupListResponse>("/api/pickup-locations");

    console.log("RESPONSE PICKUP (RAW):", res);
    console.log("RESPONSE DATA:", res.data);

    const rawItems: ApiPickupItem[] = Array.isArray(res.data)
      ? res.data
      : [];

    console.log("RAW ITEMS AFTER CHECK:", rawItems);

    const mapped: PickupType[] = rawItems.map((i) => ({
      id: i.id,
      name: i.name,
    }));

    console.log("MAPPED ITEMS:", mapped);

    setItems(mapped);
  } catch (err) {
    console.error("GET PICKUP ERROR:", err);
    const msg =
      err instanceof Error ? err.message : "Gagal memuat data pickup";
    setErrorMsg(msg);
    setItems([]);
  } finally {
    setLoading(false);
  }
}


  // ==================================================
  // SAVE (ADD / EDIT)
  async function savePickup(): Promise<void> {
    if (!nameInput.trim()) {
      alert("Nama lokasi wajib diisi.");
      return;
    }

    setSaving(true);

    const payload = { name: nameInput.trim() };
    const method = editId ? "PUT" : "POST";
    const endpoint = editId
      ? `/api/pickup-locations/${editId}`
      : "/api/pickup-locations";

    console.log("SAVE PAYLOAD:", payload);
    console.log("SAVE METHOD:", method);
    console.log("SAVE ENDPOINT:", endpoint);

    try {
      const res = await apiFetch<ApiPickupResponse>(endpoint, {
        method,
        body: JSON.stringify(payload),
      });

      console.log("SAVE RESPONSE:", res);

      setModalOpen(false);
      setEditId(null);
      setNameInput("");

      await getData();
    } catch (err) {
  console.error("ERROR SAVE PICKUP:", err);

  const msg =
    err instanceof Error
      ? err.message.replace(/["{}]/g, "")
      : "Gagal menyimpan data pickup";

  alert(msg);
  setErrorMsg(msg);
}
 finally {
      setSaving(false);
    }
  }

  // ==================================================
  // DELETE
  async function deletePickup(id: number): Promise<void> {
    if (!confirm("Yakin ingin menghapus lokasi ini?")) return;

    setDeletingId(id);

    console.log("DELETE ID:", id);

    try {
      const res = await apiFetch(`/api/pickup-locations/${id}`, {
        method: "DELETE",
      });

      console.log("DELETE RESPONSE:", res);

      await getData();
    } catch (err) {
      console.error("ERROR DELETE PICKUP:", err);

      const msg =
        err instanceof Error ? err.message : "Gagal menghapus data pickup";
      alert(msg);
      setErrorMsg(msg);
    } finally {
      setDeletingId(null);
    }
  }

  // ==================================================
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

  useEffect(() => {
    getData();
  }, []);

  // ==================================================
  return (
    <div>
      <h2 className="text-xl font-semibold text-blue-700 mb-4">
        Pickup Penjemputan
      </h2>

      <div className="bg-white p-4 rounded shadow">
        <button
          onClick={openAddModal}
          className="px-4 py-2 bg-blue-600 text-white rounded mb-4"
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
              {editId ? "Edit Lokasi Pickup" : "Tambah Lokasi Pickup"}
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
