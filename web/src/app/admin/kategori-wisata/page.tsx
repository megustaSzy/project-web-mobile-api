"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function KategoriWisataPage() {
  // Dummy data kategori
  const [kategori, setKategori] = useState([
    { id: 1, name: "Pantai" },
    { id: 2, name: "Gunung" },
    { id: 3, name: "Air Terjun" },
    { id: 4, name: "Bukit" }
  ]);

  const [newKategori, setNewKategori] = useState("");
  const [editId, setEditId] = useState<number | null>(null);
  const [editName, setEditName] = useState("");

  // Tambah kategori
  function handleAdd() {
    if (!newKategori.trim()) return;

    const newItem = {
      id: kategori.length + 1,
      name: newKategori,
    };

    setKategori([...kategori, newItem]);
    setNewKategori("");
  }

  // Simpan edit kategori
  function handleEdit() {
    if (!editName.trim()) return;

    setKategori(
      kategori.map((item) =>
        item.id === editId ? { ...item, name: editName } : item
      )
    );

    setEditId(null);
    setEditName("");
  }

  // Hapus kategori
  function handleDelete(id: number) {
    setKategori(kategori.filter((item) => item.id !== id));
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-6">Kategori Wisata</h1>

      {/* Tambah kategori button */}
      <Dialog>
        <DialogTrigger asChild>
          <Button className="mb-4">+ Tambah Kategori</Button>
        </DialogTrigger>

        <DialogContent>
          <DialogHeader>
            <DialogTitle>Tambah Kategori Baru</DialogTitle>
          </DialogHeader>

          <Input
            placeholder="Nama kategori (contoh: Pantai)"
            value={newKategori}
            onChange={(e) => setNewKategori(e.target.value)}
          />

          <DialogFooter>
            <Button variant="outline">Batal</Button>
            <Button onClick={handleAdd}>Simpan</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Tabel kategori */}
      <div className="bg-white rounded-xl border shadow-sm mt-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-16">ID</TableHead>
              <TableHead>Nama Kategori</TableHead>
              <TableHead className="text-right pr-4">Aksi</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {kategori.map((item) => (
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
                        <DialogTitle>Edit Kategori</DialogTitle>
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
