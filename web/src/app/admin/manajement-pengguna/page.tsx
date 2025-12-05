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
  role: string;
};

export default function UsersPage() {
  const [users, setUsers] = useState<UserType[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  useEffect(() => {
    apiFetch<{
      data: { items: UserType[] };
    }>("/api/users")
      .then((res) => setUsers(res.data.items || []))
      .catch(() => setUsers([]));
  }, []);

  const handleEdit = (id: number) => {
    console.log("Edit user:", id);
    // TODO: buka modal edit
  };

  const handleDeleteConfirm = async () => {
    if (!selectedId) return;

    console.log("Delete user:", selectedId);

    // TODO: Panggil API delete
    // await apiFetch(`/api/users/${selectedId}`, { method: "DELETE" });

    // Hapus dari UI tanpa reload
    setUsers((prev) => prev.filter((u) => u.id !== selectedId));

    setSelectedId(null);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-blue-700">
          Manajemen Pengguna
        </h2>

        <Button className="flex items-center gap-2">
          <Plus size={16} />
          Tambah Pengguna
        </Button>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-gray-50 text-gray-600">
              <th className="p-3 text-left">#</th>
              <th className="p-3 text-left">Nama</th>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-left">Role</th>
              <th className="p-3 text-center">Aksi</th>
            </tr>
          </thead>

          <tbody>
            {users.map((u, index) => (
              <tr key={u.id} className="border-b hover:bg-gray-50 transition">
                <td className="p-3 font-medium text-gray-700">
                  <span className="px-2 py-1 bg-gray-100 rounded text-gray-600 text-xs">
                    {index + 1}
                  </span>
                </td>

                <td className="p-3">{u.name}</td>
                <td className="p-3">{u.email}</td>
                <td className="p-3">{u.role}</td>

                <td className="p-3 flex items-center justify-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex items-center gap-1"
                    onClick={() => handleEdit(u.id)}
                  >
                    <Pencil size={14} />
                    Edit
                  </Button>

                  {/* DELETE WITH CONFIRMATION */}
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        size="sm"
                        variant="destructive"
                        className="flex items-center gap-1"
                        onClick={() => setSelectedId(u.id)}
                      >
                        <Trash2 size={14} />
                        Delete
                      </Button>
                    </AlertDialogTrigger>

                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          Hapus Pengguna?
                        </AlertDialogTitle>

                        <AlertDialogDescription>
                          Tindakan ini tidak dapat dibatalkan. Pengguna yang dihapus tidak bisa dikembalikan.
                        </AlertDialogDescription>
                      </AlertDialogHeader>

                      <AlertDialogFooter>
                        <AlertDialogCancel>Batal</AlertDialogCancel>

                        <AlertDialogAction
                          onClick={handleDeleteConfirm}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          Hapus
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {users.length === 0 && (
          <p className="text-center text-gray-500 py-4">
            Tidak ada data pengguna.
          </p>
        )}
      </div>
    </div>
  );
}
