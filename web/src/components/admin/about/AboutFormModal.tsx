"use client";

import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { TitleItem } from "@/types/admin/admin-about";
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
import { Loader2, FileText, Upload, Hash, Heading } from "lucide-react";

type Props = {
  open: boolean;
  mode: "add" | "edit";
  data: TitleItem | null;
  onClose: () => void;
  onSuccess: () => void;
};

export default function AboutFormModal({
  open,
  mode,
  data,
  onClose,
  onSuccess,
}: Props) {
  const token = Cookies.get("accessToken");

  const [title, setTitle] = useState("");
  const [history, setHistory] = useState("");
  const [vision, setVision] = useState("");
  const [mission, setMission] = useState("");

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) return;

    if (data) {
      // edit
      setTitle(data.title);
      setHistory(data.history);
      setVision(data.vision);
      setMission(data.mission);
    } else {
      // add
      setTitle("");
      setHistory("");
      setVision("");
      setMission("");
    }
  }, [data, open]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const fd = new FormData();

      fd.append("title", title);
      fd.append("history", history);
      fd.append("number", vision);
      fd.append("number", mission);

      const url =
        mode === "add"
          ? `${process.env.NEXT_PUBLIC_API_URL}/api/about`
          : `${process.env.NEXT_PUBLIC_API_URL}/api/about/${data!.id}`;

      await fetch(url, {
        method: mode === "add" ? "POST" : "PATCH",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: fd,
      });

      onClose();
      onSuccess();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] rounded-2xl max-h-[90vh] overflow-y-auto">
        <form onSubmit={submit}>
          <DialogHeader>
            <DialogTitle className="text-xl">
              {mode === "add" ? "Tambah Konten" : "Edit Konten"}
            </DialogTitle>
            <DialogDescription>
              {mode === "add"
                ? "Tambahkan konten baru ke dalam sistem"
                : "Perbarui informasi konten yang sudah ada"}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* TITLE */}
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium">
                Title
              </Label>
              <div className="relative">
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Contoh: Isi Konten"
                  className="rounded-lg pl-10"
                  disabled={loading}
                  required
                />
                <FileText className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              </div>
            </div>

            {/* HISTORY */}
            <div className="space-y-2">
              <Label htmlFor="header" className="text-sm font-medium">
                History
              </Label>
              <div className="relative">
                <Input
                  id="history"
                  value={history}
                  onChange={(e) => setHistory(e.target.value)}
                  placeholder="Contoh: Rating"
                  className="rounded-lg pl-10"
                  disabled={loading}
                  required
                />
                <Heading className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              </div>
            </div>

            {/* VISOON */}
            <div className="space-y-2">
              <Label htmlFor="header" className="text-sm font-medium">
                Vision
              </Label>
              <div className="relative">
                <Input
                  id="vision"
                  value={vision}
                  onChange={(e) => setVision(e.target.value)}
                  placeholder="Contoh: Rating"
                  className="rounded-lg pl-10"
                  disabled={loading}
                  required
                />
                <Heading className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              </div>
            </div>

            {/* MISSION */}
            <div className="space-y-2">
              <Label htmlFor="header" className="text-sm font-medium">
                Mission
              </Label>
              <div className="relative">
                <Input
                  id="mission"
                  value={mission}
                  onChange={(e) => setMission(e.target.value)}
                  placeholder="Contoh: Rating"
                  className="rounded-lg pl-10"
                  disabled={loading}
                  required
                />
                <Heading className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              </div>
            </div>
          </div>

          <DialogFooter className="gap-2">
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
                loading || !title.trim() || !history || !vision || !mission
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
