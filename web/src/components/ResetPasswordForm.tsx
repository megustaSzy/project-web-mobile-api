"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import Image from "next/image";

export default function ResetPasswordForm() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [success, setSuccess] = useState(false);

  const handleReset = (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirm) {
      alert("Password tidak sama!");
      return;
    }

    // simulasi update password (di backend nanti)
    setSuccess(true);
  };

  return (
    <section className="flex flex-col items-center justify-center min-h-screen px-4 bg-gradient-to-b from-blue-50 to-white">
      <Card className="w-full max-w-md shadow-lg border border-gray-100 rounded-2xl bg-white/80 backdrop-blur">
        <CardHeader className="text-center pb-2 flex flex-col items-center">
          <Image
            src="/images/logo.png"
            alt="Logo"
            width={61}
            height={61}
            className="w-16 h-16 object-contain mb-3"
          />
          <CardTitle className="text-2xl font-bold text-gray-800">
            Reset Password
          </CardTitle>
          <CardDescription className="text-gray-500">
            Buat password baru untuk akun Anda
          </CardDescription>
        </CardHeader>

        <CardContent>
          {!success ? (
            <form onSubmit={handleReset} className="space-y-5">
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Password Baru
                </label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  className="w-full"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <div>
                <label
                  htmlFor="confirm"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Konfirmasi Password
                </label>
                <Input
                  id="confirm"
                  type="password"
                  placeholder="••••••••"
                  className="w-full"
                  required
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg transition-all duration-200"
              >
                Simpan Password Baru
              </Button>
            </form>
          ) : (
            <div className="text-center space-y-4 py-6">
              <p className="text-gray-600 text-sm">
                Password kamu berhasil diubah! 🎉
              </p>
              <a
                href="/login"
                className="text-blue-600 text-sm hover:underline font-medium"
              >
                Kembali ke Login
              </a>
            </div>
          )}
        </CardContent>
      </Card>
    </section>
  );
}
