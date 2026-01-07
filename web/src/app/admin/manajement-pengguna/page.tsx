"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/helpers/api";

type UserItem = {
  id: number;
  name: string;
  email: string;
  notelp: string | null;
};

type ApiUsersResponse = {
  data: {
    items: UserItem[];
  };
};

type ApiBaseResponse = {
  message: string;
};

export default function UsersPage() {
  const [users, setUsers] = useState<UserItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);

  const [nameInput, setNameInput] = useState("");
  const [emailInput, setEmailInput] = useState("");
  const [notelpInput, setNotelpInput] = useState("");

  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState<number | null>(null);

  /* ================= FETCH ================= */
  async function getData() {
    try {
      setLoading(true);
      const res = await apiFetch<ApiUsersResponse>("/api/users");
      setUsers(res.data.items);
    } catch {
      setErrorMsg("Gagal memuat data pengguna");
    } finally {
      setLoading(false);
    }
  }

  /* ================= SAVE EDIT ================= */
  async function saveUser() {
    if (!editId) return;

    setSaving(true);

    const fd = new FormData();
    fd.append("name", nameInput);
    fd.append("notelp", notelpInput);
    fd.append("_method", "PUT");

    try {
      await apiFetch(`/api/users/${editId}`, {
        method: "POST",
        body: fd,
      });

      setModalOpen(false);
      setEditId(null);

      setSuccessMsg("Pengguna berhasil diperbarui");
      setTimeout(() => setSuccessMsg(null), 2000);

      await getData();
    } catch {
      setErrorMsg("Gagal menyimpan data");
    } finally {
      setSaving(false);
    }
  }

  /* ================= DELETE ================= */
  async function deleteUser() {
    if (!pendingDeleteId) return;

    setDeletingId(pendingDeleteId);

    try {
      await apiFetch<ApiBaseResponse>(`/api/users/${pendingDeleteId}`, {
        method: "DELETE",
      });

      setSuccessMsg("Pengguna berhasil dihapus");
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

  /* ================= MODAL ================= */
  function openEditModal(user: UserItem) {
    setEditId(user.id);
    setNameInput(user.name);
    setEmailInput(user.email);
    setNotelpInput(user.notelp ?? "");
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
      <h2 className="text-xl font-semibold text-blue-700">
        Manajemen Pengguna
      </h2>

      {successMsg && (
        <div className="fixed top-4 right-4 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg z-50">
          {successMsg}
        </div>
      )}

      {errorMsg && (
        <div className="fixed top-4 left-4 bg-red-600 text-white px-4 py-2 rounded-lg shadow-lg z-50">
          {errorMsg}
        </div>
      )}

      <div className="bg-white rounded-2xl border shadow-sm">
        <div className="px-6 py-4 border-b">
          <h3 className="font-semibold text-gray-800">Daftar Pengguna</h3>
        </div>

        {loading ? (
          <p className="p-6 text-gray-500">Memuat data...</p>
        ) : users.length === 0 ? (
          <p className="p-6 text-gray-500">Tidak ada data pengguna.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full table-auto text-sm">
              <thead className="bg-gray-50 border-b">
                <tr className="text-gray-600">
                  <th className="w-14 px-4 py-3 text-center">No</th>
                  <th className="px-4 py-3 text-left">Nama</th>
                  <th className="px-4 py-3 text-left">Email</th>
                  <th className="px-4 py-3 text-left">No. Telp</th>
                  <th className="w-40 px-4 py-3 text-center">Aksi</th>
                </tr>
              </thead>

              <tbody className="divide-y">
                {users.map((u, i) => (
                  <tr key={u.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-center text-gray-400">
                      {i + 1}
                    </td>

                    <td className="px-4 py-3 font-medium">{u.name}</td>

                    <td
                      className="px-4 py-3 text-gray-600 break-all max-w-xs"
                      title={u.email}
                    >
                      {u.email}
                    </td>

                    <td className="px-4 py-3 text-gray-600 whitespace-nowrap">
                      {u.notelp || "-"}
                    </td>

                    <td className="px-4 py-3">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => openEditModal(u)}
                          className="px-3 py-1.5 bg-yellow-500 text-white rounded-full text-xs"
                        >
                          Edit
                        </button>

                        <button
                          onClick={() => openDeleteConfirm(u.id)}
                          disabled={deletingId === u.id}
                          className="px-3 py-1.5 bg-red-600 text-white rounded-full text-xs"
                        >
                          {deletingId === u.id ? "Menghapus..." : "Hapus"}
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

      {/* MODAL EDIT */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-2xl shadow-xl w-96">
            <h3 className="text-lg font-semibold mb-4">Edit Pengguna</h3>

            <input
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 mb-2"
              placeholder="Nama"
            />

            <input
              value={emailInput}
              disabled
              className="w-full border rounded-lg px-3 py-2 mb-2 bg-gray-100 cursor-not-allowed"
              placeholder="Email"
            />

            <input
              value={notelpInput}
              onChange={(e) => setNotelpInput(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 mb-4"
              placeholder="No. Telp"
            />

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setModalOpen(false)}
                className="px-4 py-2 bg-gray-100 rounded-lg"
              >
                Batal
              </button>

              <button
                onClick={saveUser}
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
              Yakin ingin menghapus pengguna ini?
            </p>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setConfirmDeleteOpen(false)}
                className="px-4 py-2 bg-gray-100 rounded-lg"
              >
                Batal
              </button>

              <button
                onClick={deleteUser}
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
