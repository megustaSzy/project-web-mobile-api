/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { FcGoogle } from "react-icons/fc";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { registerSchema } from "@/schema/registerSchema";

/* =========================
   TYPE KHUSUS FORM (INPUT)
========================= */
type RegisterFormInput = z.input<typeof registerSchema>;

export default function SignupForm(props: React.ComponentProps<typeof Card>) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role: "User",
      notelp: "",
    },
  });

  const handleSignup = async (data: RegisterFormInput): Promise<void> => {
    try {
      setLoading(true);
      setMessage("");

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/register`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        }
      );

      const result: { message?: string } = await response.json();

      if (!response.ok) {
        setMessage(result.message ?? "Pendaftaran gagal. Coba lagi.");
        return;
      }

      setMessage("Pendaftaran berhasil! Mengarahkan ke login...");
      setTimeout(() => router.push("/login"), 1200);
    } catch (error) {
      console.error(error);
      setMessage("Tidak dapat terhubung ke server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card
        {...props}
        className="w-full max-w-md shadow-lg border border-gray-100 rounded-2xl"
      >
        {/* LOGO */}
        <div className="flex justify-center mb-4">
          <img
            src="/images/logo.png"
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
          <form onSubmit={handleSubmit(handleSignup)} className="space-y-4">
            <FieldGroup className="space-y-0">
              <Field>
                <FieldLabel htmlFor="name">Full Name</FieldLabel>
                <Input
                  id="name"
                  type="text"
                  placeholder="LamiGo"
                  {...register("name")}
                />
                {errors.name && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.name.message}
                  </p>
                )}
              </Field>

              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="example@gmail.com"
                  {...register("email")}
                />
                {errors.email && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.email.message}
                  </p>
                )}
              </Field>

              <Field>
                <FieldLabel htmlFor="password">Password</FieldLabel>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  {...register("password")}
                />
                {errors.password && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.password.message}
                  </p>
                )}
              </Field>

              <Field>
                <FieldLabel htmlFor="notelp">No Handphone</FieldLabel>
                <Input
                  id="notelp"
                  type="text"
                  placeholder="08xxxxxxxxxx"
                  {...register("notelp")}
                />
                {errors.notelp && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.notelp.message}
                  </p>
                )}
              </Field>
            </FieldGroup>

            <div className="flex flex-col gap-3">
              <Button
                type="submit"
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

            {message && (
              <p className="text-center text-sm text-gray-600 mt-2">
                {message}
              </p>
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
