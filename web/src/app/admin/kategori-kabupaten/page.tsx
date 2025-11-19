"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function KategoriKabupatenPage() {

  const [kabupaten, setKabupaten] = useState([
    { id: 1, name: "Bandar Lampung" },
    { id: 2, name: "Lampung Selatan" },
    { id: 3, name: "Lampung Timur" },
    { id: 4, name: "Metro" },
    { id: 5, name: "Pesawaran" },
  ]);

  const [newKabupaten, setNewKabupaten] = useState("");
  const [editId, setEditId] = useState<number | null>(null);
  const [editName, setEditName] = useState("");

  // Tambah kabupaten
  function handleAdd() {
    if (!newKabupaten.trim()) return;

    const newItem = {
      id: kabupaten.length + 1,
      name: newKabupaten,
    };

    setKabupaten([...kabupaten, newItem]);
    setNewKabupaten("");
  }

  // Simpan edit
  function handleEdit() {
    if (!editName.trim()) return;

    setKabupaten(
      kabupaten.map((item) =>
        item.id === editId ? { ...item, name: editName } : item
      )
    );

    setEditId(null);
    setEditName("");
  }

  // Hapus
  function handleDelete(id: number) {
    setKabupaten(kabupaten.filter((item) => item.id !== id));
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-6">Kategori Kabupaten</h1>

      {/* Tombol tambah kabupaten */}
      <Dialog>
        <DialogTrigger asChild>
          <Button className="mb-4">+ Tambah Kabupaten</Button>
        </DialogTrigger>

        <DialogContent>
          <DialogHeader>
            <DialogTitle>Tambah Kabupaten Baru</DialogTitle>
          </DialogHeader>

          <Input
            placeholder="Nama Kabupaten (contoh: Pesawaran)"
            value={newKabupaten}
            onChange={(e) => setNewKabupaten(e.target.value)}
          />

          <DialogFooter>
            <Button variant="outline">Batal</Button>
            <Button onClick={handleAdd}>Simpan</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Tabel kabupaten */}
      <div className="bg-white rounded-xl border shadow-sm mt-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-16">ID</TableHead>
              <TableHead>Nama Kabupaten</TableHead>
              <TableHead className="text-right pr-4">Aksi</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {kabupaten.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.id}</TableCell>
                <TableCell>{item.name}</TableCell>

                <TableCell className="text-right space-x-2">

                  {/* Edit modal */}
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setEditId(item.id);
                          setEditName(item.name);
                        }}
                      >
                        Edit
                      </Button>
                    </DialogTrigger>

                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Edit Kabupaten</DialogTitle>
                      </DialogHeader>

                      <Input
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                      />

                      <DialogFooter>
                        <Button variant="outline">Batal</Button>
                        <Button onClick={handleEdit}>Simpan</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>

                  {/* Delete */}
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDelete(item.id)}
                  >
                    Hapus
                  </Button>

                </TableCell>
              </TableRow>
            ))}
          </TableBody>

        </Table>
      </div>
    </div>
  );
}
