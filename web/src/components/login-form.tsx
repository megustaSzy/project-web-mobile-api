"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
        className
      )}
      {...props}
    >
      {/* Judul Halaman */}
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">
          Welcome Back 
        </h1>
        <p className="text-gray-500">
          Silakan login untuk melanjutkan ke dashboard kamu
        </p>
      </div>

      {/* Card Form */}
      <Card className="w-full max-w-lg shadow-md border border-gray-200 rounded-2xl bg-white">
        <CardHeader className="text-center pb-2">
          <CardTitle className="text-2xl font-semibold text-gray-800">
            Login to Your Account
          </CardTitle>
          <CardDescription className="text-gray-500">
            Please enter your email and password below
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form className="space-y-6">
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

            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg"
            >
              Login
            </Button>

            <Button
              variant="outline"
              type="button"
              className="w-full border-gray-300 hover:bg-gray-100 py-2 rounded-lg"
            >
              Continue with Google
            </Button>

            <p className="text-center text-sm text-gray-500 pt-2">
              Don’t have an account?{" "}
              <a href="/signup" className="text-blue-600 hover:underline">
                Sign up
              </a>
            </p>
          </form>
        </CardContent>
      </Card>
    </section>
  );
}
