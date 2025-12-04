// app/admin/manajement-pengguna/page.tsx
"use client";
import { useEffect, useState } from "react";
import { apiFetch } from "@/helpers/api";

export default function UsersPage() {
  const [users, setUsers] = useState<{ id:number; name:string; email:string; role:string }[]>([]);

  useEffect(()=> {
    apiFetch<{ data: { items: { id:number; name:string; email:string; role:string }[] } }>("/users")
      .then(res => setUsers(res.data.items || []))
      .catch(()=> setUsers([]));
  },[]);

  return (
    <div>
      <h2 className="text-xl font-semibold text-blue-700 mb-4">Manajemen Pengguna</h2>
      <div className="bg-white p-4 rounded shadow">
        <table className="w-full text-sm">
          <thead className="text-gray-500">
            <tr><th>ID</th><th>Nama</th><th>Email</th><th>Role</th></tr>
          </thead>
          <tbody>
            {users.map(u=>(
              <tr key={u.id} className="border-t"><td>{u.id}</td><td>{u.name}</td><td>{u.email}</td><td>{u.role}</td></tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
