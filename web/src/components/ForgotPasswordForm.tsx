"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { Mail, Loader2, CheckCircle2, ArrowLeft } from "lucide-react";

interface ForgotPasswordFormData {
  email: string;
}

interface ApiErrorResponse {
  message?: string;
}

export function ForgotPasswordForm() {
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    getValues,
  } = useForm<ForgotPasswordFormData>();

  const onSubmit = async (data: ForgotPasswordFormData) => {
    try {
      setErrorMessage("");

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/forgot-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: data.email }),
        }
      );

      const result: ApiErrorResponse | null = await response
        .json()
        .catch(() => null);

      if (!response.ok) {
        throw new Error(result?.message ?? "Email tidak ditemukan");
      }

      setIsSuccess(true);
    } catch (error: unknown) {
      if (error instanceof Error) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage("Terjadi kesalahan. Silakan coba lagi.");
      }
    }
  };

  /* ================= SUCCESS STATE ================= */
  if (isSuccess) {
    return (
      <div className="w-full max-w-md mx-auto">
        <Card className="border border-slate-200 shadow-md">
          <CardHeader className="space-y-1 text-center pb-6">
            <div className="flex justify-center mb-4">
              <div className="rounded-full bg-green-100 p-4">
                <CheckCircle2 className="h-10 w-10 text-green-600" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-slate-900">
              Email Terkirim!
            </CardTitle>
            <CardDescription className="text-slate-600">
              Kami telah mengirimkan link reset password ke email Anda
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <Alert className="border-blue-200 bg-blue-50 text-blue-800">
              <AlertDescription>
                Periksa inbox email{" "}
                <span className="font-semibold">{getValues("email")}</span> dan
                klik link reset password.
              </AlertDescription>
            </Alert>

            <div className="flex flex-col gap-3">
              <Button
                variant="outline"
                className="border-slate-300 text-slate-700 hover:bg-slate-50"
                onClick={() => setIsSuccess(false)}
              >
                Kirim Ulang Email
              </Button>

              <Link href="/login">
                <Button
                  variant="outline"
                  className="w-full border-slate-300 text-slate-700 hover:bg-slate-50"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Kembali ke Login
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  /* ================= FORM STATE ================= */
  return (
    <div className="w-full max-w-md mx-auto">
      <Card className="border-neutral-200 shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-slate-900">
            Lupa Password?
          </CardTitle>
          <CardDescription className="text-slate-600">
            Masukkan email Anda untuk reset password
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {errorMessage && (
              <Alert variant="destructive">
                <AlertDescription>{errorMessage}</AlertDescription>
              </Alert>
            )}

            <FieldGroup>
              <Field>
                <FieldLabel>Email</FieldLabel>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    type="email"
                    placeholder="email@example.com"
                    className="pl-10"
                    disabled={isSubmitting}
                    {...register("email", {
                      required: "Email wajib diisi",
                      pattern: {
                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        message: "Format email tidak valid",
                      },
                    })}
                  />
                </div>
                {errors.email && (
                  <p className="text-sm text-red-600 mt-1">
                    {errors.email.message}
                  </p>
                )}
              </Field>
            </FieldGroup>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Mengirim...
                </>
              ) : (
                "Kirim Link Reset Password"
              )}
            </Button>

            <Link href="/login">
              <Button className="w-full bg-white border border-slate-300 text-slate-700 hover:bg-slate-50">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Kembali ke Login
              </Button>
            </Link>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
