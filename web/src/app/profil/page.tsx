"use client";

import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { CheckCircle2 } from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

/* ========================
   TIPE DATA
======================== */
type ApiProfileResponse = {
  status: number;
  message: string;
  data: {
    id: number;
    name: string;
    email: string;
    role: string;
    avatar?: string | null;
  };
};

type UserProfile = {
  id: number;
  name: string;
  email: string;
  role: string;
  avatar: string;
};

export default function ProfilePage() {
  const API_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

  const [user, setUser] = useState<UserProfile>({
    id: 0,
    name: "",
    email: "",
    role: "",
    avatar: "/images/default-avatar.png",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const [openLogout, setOpenLogout] = useState(false);
  const [openSuccess, setOpenSuccess] = useState(false);

  const buildAvatarUrl = (avatar?: string | null) => {
    if (!avatar) return "/images/default-avatar.png";
    return avatar.startsWith("http")
      ? avatar
      : `${API_URL}${avatar}`;
  };

  /* =============================
     FETCH PROFILE
  ============================= */
  const fetchProfile = async () => {
    const token = Cookies.get("accessToken");
    if (!token) {
      window.location.href = "/login";
      return;
    }

    try {
      const res = await fetch(`${API_URL}/api/users/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        window.location.href = "/login";
        return;
      }

      const result: ApiProfileResponse = await res.json();

      setUser({
        id: result.data.id,
        name: result.data.name,
        email: result.data.email,
        role: result.data.role,
        avatar: buildAvatarUrl(result.data.avatar),
      });
    } catch (error) {
      console.error("FETCH PROFILE ERROR:", error);
      window.location.href = "/login";
    } finally {
      setLoading(false);
    }
  };

  /* =============================
     UPDATE PROFILE
  ============================= */
  const updateProfile = async () => {
    if (!user.name.trim()) {
      alert("Nama tidak boleh kosong");
      return;
    }

    const token = Cookies.get("accessToken");
    if (!token || !user.id) {
      window.location.href = "/login";
      return;
    }

    setSaving(true);

    try {
      const formData = new FormData();
      formData.append("name", user.name);

      if (file) {
        formData.append("avatar", file);
      }

      const res = await fetch(
        `${API_URL}/api/users/${user.id}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      const text = await res.text();

      if (!res.ok) {
        alert("Gagal menyimpan profil");
        return;
      }

      const result: ApiProfileResponse = JSON.parse(text);

      setUser({
        id: result.data.id,
        name: result.data.name,
        email: result.data.email,
        role: result.data.role,
        avatar: buildAvatarUrl(result.data.avatar),
      });

      setFile(null);
      setPreview(null);

      setOpenSuccess(true);

      // auto close (optional)
      setTimeout(() => setOpenSuccess(false), 2000);
    } catch (error) {
      console.error("UPDATE PROFILE ERROR:", error);
      alert("Terjadi kesalahan");
    } finally {
      setSaving(false);
    }
  };

  /* =============================
     LOGOUT
  ============================= */
  const handleLogout = async () => {
    try {
      await fetch(`${API_URL}/api/users/logout`, {
        method: "POST",
      });
    } catch (e) {
      console.error(e);
    } finally {
      Cookies.remove("accessToken", { path: "/" });
      localStorage.removeItem("profile");
      window.location.href = "/login";
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center text-muted-foreground">
        Memuat profil...
      </div>
    );
  }

  return (
    <>
      <div className="flex min-h-screen items-center justify-center bg-muted/40 px-4">
        <Card className="w-full max-w-md rounded-2xl shadow-xl">
          <CardHeader className="text-center">
            <CardTitle>Akun Saya</CardTitle>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* AVATAR */}
            <div className="flex flex-col items-center gap-4">
              <Avatar className="h-28 w-28">
                <AvatarImage src={preview ?? user.avatar} />
                <AvatarFallback>
                  {user.name?.[0] || "U"}
                </AvatarFallback>
              </Avatar>

              <Label className="cursor-pointer text-primary">
                Ubah Foto
                <Input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (!f) return;
                    setFile(f);
                    setPreview(URL.createObjectURL(f));
                  }}
                />
              </Label>
            </div>

            <Separator />

            {/* NAMA */}
            <div className="space-y-2">
              <Label>Nama</Label>
              <Input
                value={user.name}
                onChange={(e) =>
                  setUser({ ...user, name: e.target.value })
                }
              />
            </div>

            <Button
              className="w-full"
              onClick={updateProfile}
              disabled={saving}
            >
              {saving ? "Menyimpan..." : "Simpan Perubahan"}
            </Button>

            <Button
              variant="destructive"
              className="w-full"
              onClick={() => setOpenLogout(true)}
            >
              Logout
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* DIALOG LOGOUT */}
      <Dialog open={openLogout} onOpenChange={setOpenLogout}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Konfirmasi Logout</DialogTitle>
            <DialogDescription>
              Kamu yakin ingin keluar?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setOpenLogout(false)}
            >
              Batal
            </Button>
            <Button
              variant="destructive"
              onClick={handleLogout}
            >
              Ya, Logout
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* DIALOG SUCCESS (ELEGAN) */}
      <Dialog open={openSuccess} onOpenChange={setOpenSuccess}>
        <DialogContent className="sm:max-w-md rounded-2xl p-0 overflow-hidden">
          <div className="flex flex-col items-center gap-4 px-8 py-10 text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100">
              <CheckCircle2 className="h-10 w-10 text-emerald-600" />
            </div>

            <DialogHeader className="space-y-2">
              <DialogTitle className="text-xl font-semibold">
                Profil Berhasil Diperbarui
              </DialogTitle>
              <DialogDescription className="text-sm text-muted-foreground">
                Perubahan profil kamu telah berhasil disimpan.
              </DialogDescription>
            </DialogHeader>

            <DialogFooter className="w-full">
              <Button
                className="w-full rounded-xl"
                onClick={() => setOpenSuccess(false)}
              >
                Tutup
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
