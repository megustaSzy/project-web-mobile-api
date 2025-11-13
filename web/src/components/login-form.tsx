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
import { CheckCircle, XCircle, X } from "lucide-react";

/**
 * Self-contained modal (no external dialog component needed).
 * Props:
 *  - open: boolean
 *  - onClose: () => void
 *  - status: "success" | "error"
 *  - message: string
 */
function AuthModal({
  open,
  onClose,
  status,
  message,
}: {
  open: boolean;
  onClose: () => void;
  status: "success" | "error" | null;
  message: string;
}) {
  return (
    <AnimatePresence>
      {open && (
        // Backdrop
        <motion.div
          key="backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center"
        >
          <div
            className="absolute inset-0 bg-black/40"
            onClick={onClose}
            aria-hidden
          />

          {/* Modal card */}
          <motion.div
            key="modal"
            initial={{ y: 20, opacity: 0, scale: 0.96 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 10, opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.22 }}
            className="relative z-10 w-[90%] max-w-md bg-white dark:bg-zinc-900 rounded-2xl shadow-xl p-6"
            role="dialog"
            aria-modal="true"
          >
            {/* Close icon */}
            <button
              onClick={onClose}
              className="absolute right-3 top-3 p-1 rounded-md text-gray-500 hover:bg-gray-100"
              aria-label="Tutup"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex flex-col items-center gap-3 text-center">
              <div className="p-3 rounded-full bg-green-50/70">
                {status === "success" ? (
                  <CheckCircle className="w-14 h-14 text-green-600" />
                ) : (
                  <XCircle className="w-14 h-14 text-red-600" />
                )}
              </div>

              <h3
                className={`text-lg font-semibold ${
                  status === "success" ? "text-green-700" : "text-red-600"
                }`}
              >
                {status === "success" ? "Berhasil!" : "Gagal"}
              </h3>

              <p className="text-sm text-gray-600">{message}</p>

              <div className="w-full mt-3">
                <Button
                  onClick={onClose}
                  className={`w-full ${
                    status === "success"
                      ? "bg-green-600 hover:bg-green-700"
                      : "bg-red-600 hover:bg-red-700"
                  }`}
                >
                  Tutup
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function LoginForm({ className, ...props }: React.ComponentProps<"div">) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalStatus, setModalStatus] = useState<"success" | "error" | null>(null);
  const [modalMessage, setModalMessage] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    const email = (document.getElementById("email") as HTMLInputElement)?.value;
    const password = (document.getElementById("password") as HTMLInputElement)
      ?.value;

    if (!email || !password) {
      setModalStatus("error");
      setModalMessage("Masukkan email dan password terlebih dahulu!");
      setModalOpen(true);
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

      if (response.ok) {
        setModalStatus("success");
        setModalMessage("Login berhasil! Selamat datang kembali 👋");
        setModalOpen(true);

        if (data.token) localStorage.setItem("token", data.token);

        // redirect after a short delay so user sees the modal
        setTimeout(() => {
          setModalOpen(false);
          router.push("/");
        }, 1400);
      } else {
        setModalStatus("error");
        setModalMessage(data.message || "Login gagal. Periksa email dan password.");
        setModalOpen(true);
      }
    } catch (error) {
      console.error(error);
      setModalStatus("error");
      setModalMessage("Tidak dapat terhubung ke server. Coba lagi nanti.");
      setModalOpen(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <section
        className={cn(
          "flex flex-col items-center justify-center min-h-screen px-4 to-white",
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
              {/* Email */}
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

              {/* Password */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Password
                  </label>
                  <Link
                    href="/forgot-password"
                    className="text-sm text-blue-600 hover:underline"
                  >
                    Lupa?
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  className="w-full"
                  required
                />
              </div>

              {/* Button */}
              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg transition-all duration-200"
                disabled={loading}
              >
                {loading ? "Sedang masuk..." : "Login"}
              </Button>

              {/* Divider */}
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

      {/* Modal */}
      <AuthModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        status={modalStatus}
        message={modalMessage}
      />
    </>
  );
}
