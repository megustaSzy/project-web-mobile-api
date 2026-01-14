"use client";

import { useCallback, useEffect, useState } from "react";
import { apiFetch } from "@/helpers/api";
import { KontenItem, KontenResponse } from "@/types/admin/konten";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

import KontenTable from "@/components/admin/konten/KontenTable";
import KontenFormModal from "@/components/admin/konten/KontenFormModal";
import KontenDeleteModal from "@/components/admin/konten/KontenDeleteModal";

export default function KontenPage() {
  const [items, setItems] = useState<KontenItem[]>([]);
  const [loading, setLoading] = useState(true);

  // modal state
  const [openForm, setOpenForm] = useState(false);
  const [mode, setMode] = useState<"add" | "edit">("add");
  const [selected, setSelected] = useState<KontenItem | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await apiFetch<KontenResponse>("/api/banner");
      setItems(res.data);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-semibold text-blue-700 tracking-tight">
            Manajemen Konten
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Kelola konten dan informasinya
          </p>
        </div>

        <Button
          onClick={() => {
            setMode("add");
            setSelected(null);
            setOpenForm(true);
          }}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Tambah Konten
        </Button>
      </div>

      <Card className="rounded-2xl shadow-sm">
        <CardHeader className="border-b">
          <div>
            <CardTitle className="text-gray-800">Daftar Konten</CardTitle>
            <CardDescription className="mt-1">
              Total {items.length} data
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <KontenTable
            items={items}
            loading={loading}
            onEdit={(item) => {
              setMode("edit");
              setSelected(item);
              setOpenForm(true);
            }}
            onDelete={(id) => setDeleteId(id)}
          />
        </CardContent>
      </Card>

      <KontenFormModal
        open={openForm}
        mode={mode}
        data={selected}
        onClose={() => setOpenForm(false)}
        onSuccess={load}
      />

      <KontenDeleteModal
        id={deleteId}
        onClose={() => setDeleteId(null)}
        onSuccess={load}
      />
    </div>
  );
}
