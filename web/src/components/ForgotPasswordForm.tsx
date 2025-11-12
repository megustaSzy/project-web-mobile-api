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


export default function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // simulasi validasi email
    if (email === "") return alert("Masukkan email Anda!");
    setSubmitted(true);

    // nanti di backend, kamu bisa cek apakah email ini terdaftar di database
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
          {!submitted ? (
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
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg transition-all duration-200"
              >
                Kirim Link Reset
              </Button>
            </form>
          ) : (
            <div className="text-center space-y-4 py-6">
              <p className="text-gray-600 text-sm">
                Jika email <span className="font-semibold">{email}</span> terdaftar,
                kami telah mengirimkan link untuk mereset password.
              </p>
              <a
                href="/reset-password"
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
