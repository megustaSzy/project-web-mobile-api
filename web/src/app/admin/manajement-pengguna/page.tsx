"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/helpers/api";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, Plus } from "lucide-react";

type UserType = {
  id: number;
  name: string;
  email: string;
  role: string;
};

export default function UsersPage() {
  const [users, setUsers] = useState<UserType[]>([]);

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

  const handleDelete = (id: number) => {
    console.log("Delete user:", id);
    // TODO: konfirmasi + API delete
  };

  const handleAdd = () => {
    console.log("Tambah user baru");
    // TODO: buka modal tambah user
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-blue-700">
          Manajemen Pengguna
        </h2>

        <Button
          onClick={handleAdd}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white"
        >
          <Plus size={16} />
          Tambah Pengguna
        </Button>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-gray-50 text-gray-600">
              <th className="p-3 text-left">No</th>
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

                  <Button
                    size="sm"
                    variant="destructive"
                    className="flex items-center gap-1"
                    onClick={() => handleDelete(u.id)}
                  >
                    <Trash2 size={14} />
                    Delete
                  </Button>
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
