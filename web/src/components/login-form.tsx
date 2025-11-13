"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FcGoogle } from "react-icons/fc";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, XCircle } from "lucide-react";

/* ✅ Komponen popup animasi */
function AuthModal({
  open,
  status,
  message,
}: {
  open: boolean;
  status: "success" | "error" | null;
  message: string;
}) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="modal"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
        >
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.9 }}
            className={`rounded-2xl shadow-xl p-6 text-center w-[90%] max-w-sm ${
              status === "success" ? "bg-green-50" : "bg-red-50"
            }`}
          >
            {status === "success" ? (
              <CheckCircle className="w-12 h-12 mx-auto text-green-600 mb-3" />
            ) : (
              <XCircle className="w-12 h-12 mx-auto text-red-600 mb-3" />
            )}

            <h3
              className={`text-lg font-semibold mb-1 ${
                status === "success" ? "text-green-700" : "text-red-700"
              }`}
            >
              {status === "success" ? "Berhasil!" : "Gagal!"}
            </h3>

            <p className="text-gray-600 text-sm">{message}</p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalStatus, setModalStatus] = useState<"success" | "error" | null>(
    null
  );
  const [modalMessage, setModalMessage] = useState("");

  // ✅ Fungsi Login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    const email = (document.getElementById("email") as HTMLInputElement)?.value;
    const password = (document.getElementById("password") as HTMLInputElement)
      ?.value;

    if (!email || !password) {
      setModalStatus("error");
      setModalMessage("Masukkan email dan password terlebih dahulu!");
      setModalOpen(true);
      setTimeout(() => setModalOpen(false), 1800);
      return;
    }

    try {
      setLoading(true);
      const response = await fetch("http://10.93.86.50:3001/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      console.log("Respon API:", data);

      if (response.ok) {
        // ✅ Simpan token dari API (pastikan nama field benar)
        const token = data.accessToken || data.token;

        if (token) {
          localStorage.setItem("token", token);
          console.log("Token disimpan:", token);
        }

        // ✅ Tampilkan popup sukses
        setModalStatus("success");
        setModalMessage("Login berhasil! Selamat datang kembali 👋");
        setModalOpen(true);

        // Tutup otomatis + redirect
        setTimeout(() => {
          setModalOpen(false);
          router.push("/");
        }, 1500);
      } else {
        setModalStatus("error");
        setModalMessage(data.message || "Email atau password salah.");
        setModalOpen(true);
        setTimeout(() => setModalOpen(false), 1800);
      }
    } catch (error) {
      console.error("Login error:", error);
      setModalStatus("error");
      setModalMessage("Tidak dapat terhubung ke server.");
      setModalOpen(true);
      setTimeout(() => setModalOpen(false), 1800);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <section
        className={cn(
          "flex flex-col items-center justify-center min-h-screen px-4",
          className
        )}
        {...props}
      >
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
              Login Akun
            </CardTitle>
            <CardDescription className="text-gray-500">
              Masuk ke akun kamu untuk melanjutkan
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleLogin} className="space-y-5">
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
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Password
                </label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  className="w-full"
                  required
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg transition-all duration-200"
                disabled={loading}
              >
                {loading ? "Sedang masuk..." : "Login"}
              </Button>

              <div className="relative">
                <hr className="border-gray-200" />
                <span className="absolute left-1/2 -translate-x-1/2 -top-2 bg-white px-2 text-gray-400 text-sm">
                  atau
                </span>
              </div>

              <Button
                variant="outline"
                type="button"
                className="w-full border-gray-300 hover:bg-gray-50 py-2 rounded-lg flex items-center justify-center gap-2"
              >
                <FcGoogle size={20} />
                Login dengan Google
              </Button>

              <p className="text-center text-sm text-gray-500 pt-2">
                Belum punya akun?{" "}
                <a
                  href="/signup"
                  className="text-blue-600 hover:underline font-medium"
                >
                  Daftar sekarang
                </a>
              </p>
            </form>
          </CardContent>
        </Card>
      </section>

      {/* ✅ Popup otomatis */}
      <AuthModal
        open={modalOpen}
        status={modalStatus}
        message={modalMessage}
      />
    </>
  );
}
