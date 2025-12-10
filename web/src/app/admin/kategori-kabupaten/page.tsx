// app/admin/kategori-kabupaten/page.tsx
"use client";
import { useState } from "react";

export default function KategoriKabupaten() {
  const [kabupaten, setKabupaten] = useState([
    { id: 1, name: "Bandar Lampung" },
    { id: 2, name: "Lampung Selatan" },
    { id: 3, name: "Lampung Timur" },
  ]);
  const [newName, setNewName] = useState("");
  function add() {
    if(!newName.trim()) return;
    setKabupaten([...kabupaten, { id: kabupaten.length+1, name: newName }]);
    setNewName("");
  }
  function remove(id:number){ setKabupaten(kabupaten.filter(k=>k.id!==id)); }
  return (
    <div>
      <h2 className="text-xl font-semibold text-blue-700 mb-4">Kategori Kabupaten</h2>
      <div className="bg-white p-4 rounded shadow">
        <div className="flex gap-2 mb-4">
          <input value={newName} onChange={e=>setNewName(e.target.value)} className="border p-2 rounded" placeholder="Nama kabupaten"/>
          <button onClick={add} className="px-3 py-2 bg-blue-600 text-white rounded">Tambah</button>
        </div>
        <ul className="space-y-2">
          {kabupaten.map(k=>(
            <li key={k.id} className="flex justify-between">
              <span>{k.name}</span>
              <button onClick={()=>remove(k.id)} className="text-sm text-red-500">Hapus</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
