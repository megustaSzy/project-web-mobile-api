// app/admin/kategori-kabupaten/page.tsx
"use client";
import { useState } from "react";

interface Kabupaten {
  id: number;
  name: string;
  logo?: string;
}

export default function KategoriKabupaten() {
  const [kabupaten, setKabupaten] = useState<Kabupaten[]>([
    { id: 1, name: "Bandar Lampung" },
    { id: 2, name: "Lampung Selatan" },
    { id: 3, name: "Lampung Timur" },
  ]);

  const [showForm, setShowForm] = useState(false);
  const [newName, setNewName] = useState("");
  const [logoFile, setLogoFile] = useState<File | null>(null);

  function add() {
    if (!newName.trim()) return;

    const newItem: Kabupaten = {
      id: kabupaten.length + 1,
      name: newName,
      logo: logoFile ? URL.createObjectURL(logoFile) : undefined,
    };

    setKabupaten([...kabupaten, newItem]);
    setNewName("");
    setLogoFile(null);
    setShowForm(false);
  }

  function remove(id: number) {
    setKabupaten(kabupaten.filter((k) => k.id !== id));
  }

  return (
    <div>
      <h2 className="text-xl font-semibold text-blue-700 mb-4">
        Kategori Kabupaten
      </h2>

      <div className="bg-white p-4 rounded shadow">
        {/* BUTTON TAMBAH */}
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-blue-600 text-white rounded mb-4"
        >
          + Tambah Kabupaten
        </button>

        {/* FORM TAMBAH */}
        {showForm && (
          <div className="grid gap-2 mb-4">
            <input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="border p-2 rounded"
              placeholder="Nama kabupaten"
            />

            <input
              type="file"
              accept="image/*"
              onChange={(e) => setLogoFile(e.target.files?.[0] ?? null)}
              className="border p-2 rounded"
            />

            <div className="flex gap-2">
              <button
                onClick={add}
                className="px-4 py-2 bg-blue-600 text-white rounded"
              >
                Simpan
              </button>
              <button
                onClick={() => setShowForm(false)}
                className="px-4 py-2 bg-gray-200 rounded"
              >
                Batal
              </button>
            </div>
          </div>
        )}

        {/* LIST */}
        <ul className="space-y-2">
          {kabupaten.map((k) => (
            <li
              key={k.id}
              className="flex justify-between items-center border-b pb-2"
            >
              <div className="flex items-center gap-2">
                {k.logo && (
                  <img
                    src={k.logo}
                    alt={k.name}
                    className="w-8 h-8 object-cover rounded"
                  />
                )}
                <span>{k.name}</span>
              </div>

              <button
                onClick={() => remove(k.id)}
                className="px-4 py-2 bg-red-600 text-white rounded"
              >
                Hapus
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}g
