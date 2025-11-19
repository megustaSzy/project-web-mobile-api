"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import React from "react";

export default function Page() {
  const [form, setForm] = useState({
    name: "",
    harga: "",
    kabupaten: "",
    kategori: "",
    deskripsi: "",
    image: null as File | null,
  });

  const kabupatenList = [
    "Bandar Lampung",
    "Metro",
    "Lampung Selatan",
    "Lampung Timur",
    "Lampung Tengah",
    "Lampung Utara",
    "Pesawaran",
    "Pringsewu",
    "Tanggamus",
    "Pesisir Barat",
    "Way Kanan",
    "Tulang Bawang",
    "Tulang Bawang Barat",
    "Mesuji",
  ];

  const kategoriList = ["Pantai", "Gunung", "Bukit", "Pulau", "Air Terjun"];

  function handleInput(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleImage(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files[0]) {
      setForm({ ...form, image: e.target.files[0] });
    }
  }

  function handleSubmit() {
    console.log("Data disimpan:", form);
    alert("Destinasi berhasil disimpan (dummy)");
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-semibold mb-6">Tambah Destinasi</h1>

      <div className="space-y-4 bg-white p-6 rounded-xl border shadow-sm">

        {/* NAMA */}
        <div>
          <label className="font-medium">Nama Destinasi</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleInput}
            className="w-full mt-1 border rounded-lg px-3 py-2"
            placeholder="Masukkan nama destinasi"
          />
        </div>

        {/* HARGA */}
        <div>
          <label className="font-medium">Harga</label>
          <input
            type="text"
            name="harga"
            value={form.harga}
            onChange={handleInput}
            className="w-full mt-1 border rounded-lg px-3 py-2"
            placeholder="Contoh: Rp25.000"
          />
        </div>

        {/* KABUPATEN */}
        <div>
          <label className="font-medium">Kabupaten</label>
          <select
            name="kabupaten"
            value={form.kabupaten}
            onChange={handleInput}
            className="w-full mt-1 border rounded-lg px-3 py-2"
          >
            <option value="">Pilih Kabupaten</option>
            {kabupatenList.map((kab, idx) => (
              <option key={idx} value={kab}>
                {kab}
              </option>
            ))}
          </select>
        </div>

        {/* KATEGORI */}
        <div>
          <label className="font-medium">Kategori</label>
          <select
            name="kategori"
            value={form.kategori}
            onChange={handleInput}
            className="w-full mt-1 border rounded-lg px-3 py-2"
          >
            <option value="">Pilih Kategori</option>
            {kategoriList.map((kat, idx) => (
              <option key={idx} value={kat}>
                {kat}
              </option>
            ))}
          </select>
        </div>

        {/* DESKRIPSI */}
        <div>
          <label className="font-medium">Deskripsi</label>
          <textarea
            name="deskripsi"
            value={form.deskripsi}
            onChange={handleInput}
            rows={4}
            className="w-full mt-1 border rounded-lg px-3 py-2"
            placeholder="Tulis deskripsi destinasi..."
          />
        </div>

        {/* UPLOAD GAMBAR */}
        <div>
          <label className="font-medium">Upload Gambar</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImage}
            className="w-full mt-1 border rounded-lg px-3 py-2"
          />
        </div>

        {/* BUTTON */}
        <div className="flex justify-end gap-3 pt-4">
          <Button variant="outline">Batal</Button>
          <Button onClick={handleSubmit}>Simpan</Button>
        </div>
      </div>
    </div>
  );
}
