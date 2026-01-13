"use client";

import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { apiFetch } from "@/helpers/api";
import { ApiDestinationItem } from "@/types/destination";
import { formatRupiah, unformatRupiah } from "@/utils/rupiah";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Loader2,
  MapPin,
  FileText,
  Upload,
  Tag,
  MapPinned,
  Banknote,
} from "lucide-react";
import { PaginatedResponse } from "@/types/common";

type SimpleOption = {
  id: number;
  name: string;
};

type Props = {
  open: boolean;
  mode: "add" | "edit";
  data: ApiDestinationItem | null;
  onClose: () => void;
  onSuccess: () => void;
};

export default function DestinasiFormModal({
  open,
  mode,
  data,
  onClose,
  onSuccess,
}: Props) {
  const token = Cookies.get("accessToken");

  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState<File | null>(null);

  const [categoryId, setCategoryId] = useState<number | "">("");
  const [regionId, setRegionId] = useState<number | "">("");

  const [categories, setCategories] = useState<SimpleOption[]>([]);
  const [regions, setRegions] = useState<SimpleOption[]>([]);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) return;

    async function fetchMeta() {
      const [catRes, regRes] = await Promise.all([
        apiFetch("/api/category") as Promise<PaginatedResponse<SimpleOption>>,
        apiFetch("/api/region") as Promise<PaginatedResponse<SimpleOption>>,
      ]);

      setCategories(catRes.data.items);
      setRegions(regRes.data.items);
    }

    fetchMeta();
  }, [open]);

  useEffect(() => {
    if (data) {
      setName(data.name);
      setDesc(data.description ?? "");
      setPrice(String(data.price));
      setCategoryId(data.category.id);
      setRegionId(data.region.id);
    } else {
      setName("");
      setDesc("");
      setPrice("");
      setImage(null);
      setCategoryId("");
      setRegionId("");
    }
  }, [data, open]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      if (mode === "add") {
        const fd = new FormData();
        fd.append("name", name);
        fd.append("description", desc);
        fd.append("price", price);
        fd.append("categoryId", String(categoryId));
        fd.append("regionId", String(regionId));
        if (image) fd.append("image", image);

        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/destinations`, {
          method: "POST",
          headers: token ? { Authorization: `Bearer ${token}` } : {},
          body: fd,
        });
      } else {
        await apiFetch(`/api/destination/${data!.id}`, {
          method: "PATCH",
          body: JSON.stringify({
            name,
            description: desc,
            price: Number(price),
            categoryId,
            regionId,
          }),
        });
      }

      onClose();
      onSuccess();
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[650px] rounded-2xl max-h-[90vh] overflow-y-auto">
        <form onSubmit={submit}>
          <DialogHeader>
            <DialogTitle className="text-xl">
              {mode === "add" ? "Tambah Destinasi" : "Edit Destinasi"}
            </DialogTitle>
            <DialogDescription>
              {mode === "add"
                ? "Tambahkan destinasi wisata baru ke dalam sistem"
                : "Perbarui informasi destinasi wisata yang sudah ada"}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* NAMA */}
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium">
                Nama Destinasi
              </Label>
              <div className="relative">
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Contoh: Pantai Mutun, Danau Ranau"
                  className="rounded-lg pl-10"
                  disabled={loading}
                  required
                />
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* DESKRIPSI */}
            <div className="space-y-2">
              <Label htmlFor="description" className="text-sm font-medium">
                Deskripsi
              </Label>
              <div className="relative">
                <Textarea
                  id="description"
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  placeholder="Masukkan deskripsi destinasi wisata..."
                  className="rounded-lg pl-10 min-h-[100px]"
                  disabled={loading}
                />
                <FileText className="absolute left-3 top-3 h-4 w-4 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* ROW: CATEGORY & REGION */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* CATEGORY */}
              <div className="space-y-2">
                <Label
                  htmlFor="category"
                  className="text-sm font-medium flex items-center gap-2"
                >
                  <Tag className="h-3.5 w-3.5" />
                  Kategori
                </Label>
                <Select
                  value={categoryId ? String(categoryId) : ""}
                  onValueChange={(val) => setCategoryId(Number(val))}
                  disabled={loading}
                  required
                >
                  <SelectTrigger className="rounded-lg">
                    <SelectValue placeholder="Pilih kategori" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((c) => (
                      <SelectItem key={c.id} value={String(c.id)}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* REGION */}
              <div className="space-y-2">
                <Label
                  htmlFor="region"
                  className="text-sm font-medium flex items-center gap-2"
                >
                  <MapPinned className="h-3.5 w-3.5" />
                  Kabupaten
                </Label>
                <Select
                  value={regionId ? String(regionId) : ""}
                  onValueChange={(val) => setRegionId(Number(val))}
                  disabled={loading}
                  required
                >
                  <SelectTrigger className="rounded-lg">
                    <SelectValue placeholder="Pilih kabupaten" />
                  </SelectTrigger>
                  <SelectContent>
                    {regions.map((r) => (
                      <SelectItem key={r.id} value={String(r.id)}>
                        {r.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* HARGA */}
            <div className="space-y-2">
              <Label htmlFor="price" className="text-sm font-medium">
                Harga Tiket
              </Label>
              <div className="relative">
                <Input
                  id="price"
                  value={formatRupiah(price)}
                  onChange={(e) =>
                    setPrice(
                      unformatRupiah(e.target.value).replace(/[^\d]/g, "")
                    )
                  }
                  placeholder="Rp 50.000"
                  className="rounded-lg pl-10"
                  disabled={loading}
                  required
                />
                <Banknote className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
              </div>
              <p className="text-xs text-muted-foreground">
                Masukkan harga tiket masuk destinasi
              </p>
            </div>

            {/* IMAGE */}
            {mode === "add" && (
              <div className="space-y-2">
                <Label htmlFor="image" className="text-sm font-medium">
                  Foto Destinasi
                </Label>
                <div className="relative">
                  <Input
                    id="image"
                    type="file"
                    onChange={(e) => setImage(e.target.files?.[0] ?? null)}
                    className="rounded-lg file:mr-4 file:px-4 file:py-2 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
                    accept="image/*"
                    disabled={loading}
                  />
                  <Upload className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                </div>
                <p className="text-xs text-muted-foreground">
                  Format: JPG, PNG, atau WEBP. Maksimal 2MB
                </p>
              </div>
            )}

            {mode === "edit" && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-sm text-blue-800 flex items-start gap-2">
                  <span className="text-lg">💡</span>
                  <span>
                    Untuk mengubah foto, silakan hapus destinasi ini dan
                    tambahkan kembali dengan foto baru
                  </span>
                </p>
              </div>
            )}
          </div>

          <DialogFooter className="gap-2 sm:gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading}
              className="rounded-lg"
            >
              Batal
            </Button>
            <Button
              type="submit"
              disabled={
                loading || !name.trim() || !price || !categoryId || !regionId
              }
              className="bg-blue-600 hover:bg-blue-700 rounded-lg"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Menyimpan...
                </>
              ) : (
                "Simpan"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
