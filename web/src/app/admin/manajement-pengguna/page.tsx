"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/helpers/api";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, Plus } from "lucide-react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

type UserType = {
  id: number;
  name: string;
  email: string;
  notelp: string;
  role: string;
};

export default function UsersPage() {
  const [users, setUsers] = useState<UserType[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  useEffect(() => {
    apiFetch<{ data: { items: UserType[] } }>("/api/users")
      .then((res) => setUsers(res.data.items || []))
      .catch(() => setUsers([]));
  }, []);

  const handleEdit = (id: number) => {
    // TODO: buka modal edit user
  };

  const handleDeleteConfirm = async () => {
    if (!selectedId) return;

    setUsers((prev) => prev.filter((u) => u.id !== selectedId));
    setSelectedId(null);
  };

  return (
    <div className="space-y-4">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-blue-700">
          Manajemen Pengguna
        </h2>

        <Button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white">
          <Plus size={16} />
          Tambah Pengguna
        </Button>
      </div>

      {/* TABLE CARD */}
      <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs md:text-sm table-fixed">
            {/* 🔑 CONTROL WIDTH (ANTI GAP) */}
            <colgroup>
              <col style={{ width: "56px" }} />
              <col />
              <col className="hidden md:table-column" />
              <col style={{ width: "140px" }} />
              <col className="hidden md:table-column" />
              <col style={{ width: "160px" }} />
            </colgroup>

            <thead className="bg-gray-50 border-b">
              <tr className="text-gray-600">
                <th className="px-3 py-3 text-center">No</th>
                <th className="px-3 py-3 text-left">Nama</th>
                <th className="hidden md:table-cell px-3 py-3 text-left">
                  Email
                </th>
                <th className="px-3 py-3 text-left">No. Telp</th>
                <th className="hidden md:table-cell px-3 py-3 text-left">
                  Role
                </th>
                <th className="px-3 py-3 text-center">Aksi</th>
              </tr>
            </thead>

            <tbody className="divide-y">
              {users.map((u, index) => (
                <tr key={u.id} className="hover:bg-gray-50 transition">
                  {/* NO */}
                  <td className="px-3 py-3 text-center text-gray-400">
                    {index + 1}
                  </td>

                  {/* NAMA + INFO MOBILE */}
                  <td className="px-3 py-3 font-medium">
                    {u.name}

                    <div className="md:hidden mt-1 space-y-1 text-gray-500">
                      <div className="text-xs">{u.email}</div>
                      <span className="inline-block px-2 py-0.5 bg-blue-50 text-blue-700 rounded-full text-xs">
                        {u.role}
                      </span>
                    </div>
                  </td>

                  {/* EMAIL DESKTOP */}
                  <td className="hidden md:table-cell px-3 py-3 text-gray-600">
                    {u.email}
                  </td>

                  {/* TELP */}
                  <td className="px-3 py-3 text-gray-600">
                    {u.notelp || "-"}
                  </td>

                  {/* ROLE DESKTOP */}
                  <td className="hidden md:table-cell px-3 py-3">
                    <span className="px-2 py-1 rounded-full bg-blue-50 text-blue-700 text-xs">
                      {u.role}
                    </span>
                  </td>

                  {/* AKSI */}
                  <td className="px-3 py-3">
                    <div className="flex flex-col md:flex-row justify-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex items-center gap-1"
                        onClick={() => handleEdit(u.id)}
                      >
                        <Pencil size={14} />
                        Edit
                      </Button>

                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            size="sm"
                            variant="destructive"
                            className="flex items-center gap-1"
                            onClick={() => setSelectedId(u.id)}
                          >
                            <Trash2 size={14} />
                            Hapus
                          </Button>
                        </AlertDialogTrigger>

                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              Hapus Pengguna?
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              Data pengguna akan dihapus permanen dan
                              tidak dapat dikembalikan.
                            </AlertDialogDescription>
                          </AlertDialogHeader>

                          <AlertDialogFooter>
                            <AlertDialogCancel>
                              Batal
                            </AlertDialogCancel>
                            <AlertDialogAction
                              onClick={handleDeleteConfirm}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              Ya, Hapus
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {users.length === 0 && (
            <p className="text-center text-gray-500 py-6">
              Tidak ada data pengguna.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
