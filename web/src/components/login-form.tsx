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

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <section
      className={cn(
        "flex flex-col items-center justify-center min-h-screen px-4 to-white",
        className
      )}
      {...props}
    >
      {/* Card Form */}
      <Card className="w-full max-w-md shadow-lg border border-gray-100 rounded-2xl bg-white/80 backdrop-blur">
        <CardHeader className="text-center pb-2 flex flex-col items-center">
          {/* Logo di dalam card */}
         <Image
          src="/images/logo.png"
          alt="Logo"
          width={60}
          height={60}
          className="w-16 h-16 object-contain mb-3"
        />
          <CardTitle className="text-2xl font-bold text-gray-800">
            Welcome Back
          </CardTitle>
          <CardDescription className="text-gray-500">
            Masuk ke akun kamu untuk melanjutkan
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form className="space-y-5">
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
                <a
                  href="#"
                  className="text-sm text-blue-600 hover:underline"
                >
                  Forgot?
                </a>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                className="w-full"
                required
              />
            </div>

            {/* Tombol Login */}
            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg transition-all duration-200"
            >
              Login
            </Button>

            {/* Divider */}
            <div className="relative">
              <hr className="border-gray-200" />
              <span className="absolute left-1/2 -translate-x-1/2 -top-2 bg-white px-2 text-gray-400 text-sm">
                or
              </span>
            </div>

            {/* Tombol Google */}
            <Button
              variant="outline"
              type="button"
              className="w-full border-gray-300 hover:bg-gray-50 py-2 rounded-lg flex items-center justify-center gap-2"
            >
              <FcGoogle size={20} />
              Sign in with Google
            </Button>

            {/* Signup link */}
            <p className="text-center text-sm text-gray-500 pt-2">
              Don’t have an account?{" "}
              <a href="/signup" className="text-blue-600 hover:underline font-medium">
                Sign up
              </a>
            </p>
          </form>
        </CardContent>
      </Card>
    </section>
  );
}
