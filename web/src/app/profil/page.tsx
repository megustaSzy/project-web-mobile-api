"use client";

import React, { useEffect, useState } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

import Cookies from "js-cookie";

// ========================
// TIPE API
// ========================
export type ApiProfileResponse = {
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
  name: string;
  email: string;
  role: string;
  avatar: string;
};

export default function ProfilePage() {
  const [user, setUser] = useState<UserProfile>({
    name: "",
    email: "",
    role: "",
    avatar: "/images/profile.jpg",
  });

  const [loading, setLoading] = useState(true);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [openLogout, setOpenLogout] = useState(false);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

  const buildAvatarUrl = (avatar?: string | null) => {
    if (!avatar) return "/images/profile.jpg";
    return avatar.startsWith("http") ? avatar : `${API_URL}${avatar}`;
  };

  // =============================
  // FETCH PROFILE (WAJIB HEADER)
  // =============================
  const fetchProfile = async () => {
    const token = Cookies.get("accessToken");

    if (!token) {
      window.location.href = "/login";
      return;
    }

    try {
      const res = await fetch(`${API_URL}/api/users/profile`, {
        credentials: "include",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status === 401) {
        window.location.href = "/login";
        return;
      }

      const result: ApiProfileResponse = await res.json();
      const data = result.data;

      setUser({
        name: data.name,
        email: data.email,
        role: data.role,
        avatar: buildAvatarUrl(data.avatar),
      });
    } finally {
      setLoading(false);
    }
  };

  // =============================
  // UPDATE PROFILE
  // =============================
  const updateProfile = async () => {
    const token = Cookies.get("accessToken");

    if (!token) {
      window.location.href = "/login";
      return;
    }

    const formData = new FormData();
    formData.append("name", user.name);
    if (file) formData.append("avatar", file);

    const res = await fetch(`${API_URL}/api/users/profile`, {
      method: "PUT",
      body: formData,
      credentials: "include",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (res.status === 401) {
      window.location.href = "/login";
      return;
    }

    const result: ApiProfileResponse = await res.json();
    const data = result.data;

    setUser({
      name: data.name,
      email: data.email,
      role: data.role,
      avatar: buildAvatarUrl(data.avatar),
    });

    setFile(null);
    setPreview(null);
    alert("Profil berhasil diperbarui!");
  };

  // =============================
  // LOGOUT
  // =============================
  const handleLogout = async () => {
    try {
      await fetch(`${API_URL}/api/users/logout`, {
        method: "POST",
        credentials: "include",
      });
    } finally {
      Cookies.remove("accessToken");
      window.location.href = "/login";
    }
  };

  // =============================
  // INIT
  // =============================
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
            {/* Avatar */}
            <div className="flex flex-col items-center gap-4">
              <Avatar className="h-28 w-28">
                <AvatarImage src={preview ?? user.avatar} />
                <AvatarFallback>
                  {user.name ? user.name[0] : "U"}
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

            {/* Nama */}
            <div className="space-y-2">
              <Label>Nama</Label>
              <Input
                value={user.name}
                onChange={(e) => setUser({ ...user, name: e.target.value })}
              />
            </div>

            {/* Info
            <div className="text-center text-sm text-muted-foreground">
              <p>{user.email}</p>
              <p>{user.role}</p>
            </div> */}

            <Button type="button" className="w-full" onClick={updateProfile}>
              Simpan Perubahan
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

      {/* LOGOUT DIALOG */}
      <Dialog open={openLogout} onOpenChange={setOpenLogout}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Konfirmasi Logout</DialogTitle>
            <DialogDescription>
              Kamu yakin ingin keluar dari akun ini?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenLogout(false)}>
              Batal
            </Button>
            <Button variant="destructive" onClick={handleLogout}>
              Ya, Logout
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
