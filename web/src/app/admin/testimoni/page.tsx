"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/helpers/api";

type TestimoniItem = {
  id: number;
  name?: string;
  email?: string;
  profession?: string;
  comment: string;
  rating?: number;
  approvalStatus: "PENDING" | "APPROVED" | "REJECTED";
  createdAt: string;
};

type ApiTestimoniResponse = {
  data: {
    items: TestimoniItem[];
  };
};

type ApiBaseResponse = {
  message: string;
};

export default function TestimoniPage() {
  const [testimoni, setTestimoni] = useState<TestimoniItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);

  const [nameInput, setNameInput] = useState("");
  const [emailInput, setEmailInput] = useState("");
  const [professionInput, setProfessionInput] = useState("");
  const [commentInput, setCommentInput] = useState("");
  const [ratingInput, setRatingInput] = useState<number>(5);

  const [saving, setSaving] = useState(false);

  /* ================= FETCH ================= */
  async function getData() {
    try {
      setLoading(true);
      const res = await apiFetch<ApiTestimoniResponse>("/api/testimoni/admin"); // Admin lihat semua
      setTestimoni(res.data.items);
    } catch {
      setErrorMsg("Gagal memuat data testimoni");
    } finally {
      setLoading(false);
    }
  }

  /* ================= SAVE / EDIT ================= */
  async function saveTestimoni() {
    setSaving(true);

    const payload = {
      name: nameInput,
      email: emailInput,
      profession: professionInput,
      comment: commentInput,
      rating: ratingInput,
    };

    try {
      if (editId) {
        await apiFetch(`/api/testimoni/${editId}`, {
          method: "PUT",
          body: JSON.stringify(payload),
        });
        setSuccessMsg("Testimoni berhasil diperbarui");
      } else {
        await apiFetch("/api/testimoni", {
          method: "POST",
          body: JSON.stringify(payload),
        });
        setSuccessMsg("Testimoni berhasil dibuat");
      }

      setModalOpen(false);
      setEditId(null);
      setTimeout(() => setSuccessMsg(null), 2000);
      await getData();
    } catch {
      setErrorMsg("Gagal menyimpan testimoni");
    } finally {
      setSaving(false);
    }
  }

  /* ================= APPROVE / REJECT ================= */
  async function approve(id: number) {
    try {
      await apiFetch(`/api/testimoni/admin/${id}/approve`, { method: "PATCH" });
      setSuccessMsg("Testimoni disetujui");
      setTimeout(() => setSuccessMsg(null), 2000);
      await getData();
    } catch {
      setErrorMsg("Gagal menyetujui testimoni");
    }
  }

  async function reject(id: number) {
    try {
      await apiFetch(`/api/testimoni/admin/${id}/reject`, { method: "PATCH" });
      setSuccessMsg("Testimoni ditolak");
      setTimeout(() => setSuccessMsg(null), 2000);
      await getData();
    } catch {
      setErrorMsg("Gagal menolak testimoni");
    }
  }

  /* ================= MODAL ================= */
  function openEditModal(t: TestimoniItem) {
    setEditId(t.id);
    setNameInput(t.name || "");
    setEmailInput(t.email || "");
    setProfessionInput(t.profession || "");
    setCommentInput(t.comment);
    setRatingInput(t.rating || 5);
    setModalOpen(true);
  }

  useEffect(() => {
    getData();
  }, []);

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-blue-700">
        Manajemen Testimoni
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
          <h3 className="font-semibold text-gray-800">Daftar Testimoni</h3>
        </div>

        {loading ? (
          <p className="p-6 text-gray-500">Memuat data...</p>
        ) : testimoni.length === 0 ? (
          <p className="p-6 text-gray-500">Tidak ada testimoni.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full table-auto text-sm">
              <thead className="bg-gray-50 border-b">
                <tr className="text-gray-600">
                  <th className="w-14 px-4 py-3 text-center">No</th>
                  <th className="px-4 py-3 text-left">Nama</th>
                  <th className="px-4 py-3 text-left">Email</th>
                  <th className="px-4 py-3 text-left">Profesi</th>
                  <th className="px-4 py-3 text-left">Comment</th>
                  <th className="w-20 px-4 py-3 text-center">Rating</th>
                  <th className="w-32 px-4 py-3 text-center">Status</th>
                  <th className="w-40 px-4 py-3 text-center">Aksi</th>
                </tr>
              </thead>

              <tbody className="divide-y">
                {testimoni.map((t, i) => (
                  <tr key={t.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-center text-gray-400">
                      {i + 1}
                    </td>
                    <td className="px-4 py-3 font-medium">{t.name || "-"}</td>
                    <td className="px-4 py-3 text-gray-600 break-all max-w-xs">
                      {t.email || "-"}
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {t.profession || "-"}
                    </td>
                    <td className="px-4 py-3 text-gray-700">{t.comment}</td>
                    <td className="px-4 py-3 text-center">{t.rating ?? "-"}</td>
                    <td className="px-4 py-3 text-center font-semibold">
                      {t.approvalStatus}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-center gap-2">
                        {t.approvalStatus === "PENDING" && (
                          <>
                            <button
                              onClick={() => approve(t.id)}
                              className="px-3 py-1.5 bg-green-600 text-white rounded-full text-xs"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => reject(t.id)}
                              className="px-3 py-1.5 bg-red-600 text-white rounded-full text-xs"
                            >
                              Reject
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => openEditModal(t)}
                          className="px-3 py-1.5 bg-yellow-500 text-white rounded-full text-xs"
                        >
                          Edit
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

      {/* MODAL CREATE / EDIT */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-2xl shadow-xl w-96">
            <h3 className="text-lg font-semibold mb-4">
              {editId ? "Edit Testimoni" : "Buat Testimoni"}
            </h3>

            <input
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 mb-2"
              placeholder="Nama"
            />

            <input
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 mb-2"
              placeholder="Email"
            />

            <input
              value={professionInput}
              onChange={(e) => setProfessionInput(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 mb-2"
              placeholder="Profesi"
            />

            <textarea
              value={commentInput}
              onChange={(e) => setCommentInput(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 mb-2"
              placeholder="Comment"
            />

            <input
              type="number"
              value={ratingInput}
              min={1}
              max={5}
              onChange={(e) => setRatingInput(Number(e.target.value))}
              className="w-full border rounded-lg px-3 py-2 mb-4"
              placeholder="Rating"
            />

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setModalOpen(false)}
                className="px-4 py-2 bg-gray-100 rounded-lg"
              >
                Batal
              </button>

              <button
                onClick={saveTestimoni}
                disabled={saving}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg"
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
