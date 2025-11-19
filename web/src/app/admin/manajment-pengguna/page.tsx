"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";

export default function Page() {
  const users = [
    {
      id: 1,
      name: "BKLGO Hoodie",
      email: "ezz@emailin.ajaaaa",
      phone: "243598234",
      status: "aktif",
      avatar: "/images/user1.jpeg"
    },
    {
      id: 2,
      name: "MacBook Pro",
      email: "ezz@emailin.ajaaaa",
      phone: "877712",
      status: "tidak aktif",
      avatar: "/images/user2.jpeg"
    },
    {
      id: 3,
      name: "Metro Bar Stool",
      email: "ezz@emailin.ajaaaa",
      phone: "0134729",
      status: "tidak aktif",
      avatar: "/images/user3.jpeg"
    },
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold">Manajement Pengguna</h1>

        <Button className="px-4 py-2">+ Tambah Pengguna</Button>
      </div>

      <div className="bg-white border rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-slate-50 text-left">
              <th className="py-3 px-4 font-medium">Nama</th>
              <th className="py-3 px-4 font-medium">Email</th>
              <th className="py-3 px-4 font-medium">Nomor Telpon</th>
              <th className="py-3 px-4 font-medium">Status</th>
              <th className="py-3 px-4 font-medium text-center">Aksi</th>
            </tr>
          </thead>

          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-b hover:bg-slate-50 transition">
                <td className="py-3 px-4 flex items-center gap-3">
                  <Image
                    src={user.avatar}
                    alt={user.name}
                    width={38}
                    height={38}
                    className="rounded-full"
                  />
                  {user.name}
                </td>

                <td className="py-3 px-4">{user.email}</td>
                <td className="py-3 px-4">{user.phone}</td>

                <td className="py-3 px-4">
                  {user.status === "aktif" ? (
                    <span className="bg-green-100 text-green-600 text-xs px-3 py-1 rounded-full">
                      aktif
                    </span>
                  ) : (
                    <span className="bg-red-100 text-red-500 text-xs px-3 py-1 rounded-full">
                      tidak aktif
                    </span>
                  )}
                </td>

                <td className="py-3 px-4 text-center">
                  <Button variant="destructive" size="sm">
                    Hapus
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
