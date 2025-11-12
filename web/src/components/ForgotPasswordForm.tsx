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
import { useRouter } from "next/navigation"; // ✅ untuk navigasi antar halaman

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // 🔹 Simulasi database user yang terdaftar
  const registeredEmails = ["test@example.com", "faiz@gmail.com", "user123@mail.com"];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return alert("Masukkan email Anda!");
    setLoading(true);

    // 🔹 Simulasi pengecekan ke database
    setTimeout(() => {
      if (registeredEmails.includes(email.trim().toLowerCase())) {
        // ✅ Jika email terdaftar → arahkan ke halaman reset password
        router.push("/reset-password");
      } else {
        // ❌ Jika tidak terdaftar → tampilkan pesan error
        alert("Email tidak valid atau belum terdaftar.");
      }
      setLoading(false);
    }, 1000);
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
            Lupa Password
          </CardTitle>
          <CardDescription className="text-gray-500">
            Masukkan email Anda untuk menerima link reset password
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Email
              </label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                className="w-full"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg transition-all duration-200"
            >
              {loading ? "Memeriksa..." : "Kirim Link Reset"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </section>
  );
}
