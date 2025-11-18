"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { FcGoogle } from "react-icons/fc";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function SignupForm({ ...props }: React.ComponentProps<typeof Card>) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    const name = (document.getElementById("name") as HTMLInputElement)?.value;
    const email = (document.getElementById("email") as HTMLInputElement)?.value;
    const password = (document.getElementById("password") as HTMLInputElement)?.value;
    const phone = (document.getElementById("phone") as HTMLInputElement)?.value;

    if (!name || !email || !password || !phone) {
      setMessage("Semua field harus diisi!");
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      const response = await fetch("http://10.93.86.50:3001/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password, phone }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("Pendaftaran berhasil! Silakan login.");
        console.log("User registered:", data);

        // Redirect ke halaman login
        setTimeout(() => router.push("/login"), 1500);
      } else {
        setMessage(data.message || "Pendaftaran gagal. Coba lagi.");
      }
    } catch (error) {
      console.error(error);
      setMessage("Tidak dapat terhubung ke server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center via-white to-gray-100 p-4">
      <Card
        {...props}
        className="w-full max-w-md shadow-lg border border-gray-100 rounded-2xl"
      >
         {/* LOGO */}
        <div className="flex justify-center mb-4">
          <img
            src="/images/logo.png" // Pastikan file ada di public/logo.png
            alt="Logo"
            className="h-20 w-auto object-contain"
          />
        </div>
        <CardHeader className="text-center space-y-0">
          <CardTitle className="text-2xl font-semibold text-gray-800">
            Create an Account
          </CardTitle>
          <CardDescription className="text-gray-500 text-sm">
            Enter your information to get started
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSignup} className="space-y-4">
            <FieldGroup className="space-y-0">
              <Field>
                <FieldLabel htmlFor="name">Full Name</FieldLabel>
                <Input
                  id="name"
                  type="text"
                  placeholder="LamiGo"
                  required
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="LamiGo@gmail.com"
                  required
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="password">Password</FieldLabel>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  required
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="phone">No Handphone</FieldLabel>
                <Input
                  id="phone"
                  type="text"
                  placeholder="08xxxxxxxxxx"
                  required
                />
              </Field>
            </FieldGroup>

            {/* Tombol Register */}
            <div className="flex flex-col gap-3">
              <Button
                type="submit"
                variant="default"
                className="w-full bg-blue-500 hover:bg-blue-700 text-white"
                disabled={loading}
              >
                {loading ? "Membuat akun..." : "Create Account"}
              </Button>

              <Button
                variant="outline"
                type="button"
                className="w-full flex items-center justify-center gap-2"
              >
                <FcGoogle size={20} />
                Sign up with Google
              </Button>
            </div>

            {/* Pesan status */}
            {message && (
              <p className="text-center text-sm text-gray-600 mt-2">{message}</p>
            )}

            <p className="text-sm text-center text-gray-500 mt-4">
              Already have an account?{" "}
              <Link
                href="/login"
                className="text-primary font-medium hover:underline"
              >
                Sign in
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
