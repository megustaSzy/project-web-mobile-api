"use client"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { FcGoogle } from "react-icons/fc"
import Link from "next/link"

export default function SignupForm({ ...props }: React.ComponentProps<typeof Card>) {
  return (
    <div className="flex min-h-screen items-center justify-center via-white to-gray-100 p-4">
  <Card
    {...props}
    className="w-full max-w-md shadow-lg border border-gray-100 rounded-2xl"
  >
    <CardHeader className="text-center space-y-0">
      <CardTitle className="text-2xl font-semibold text-gray-800">
        Create an Account
      </CardTitle>
      <CardDescription className="text-gray-500 text-sm">
        Enter your information to get started
      </CardDescription>
    </CardHeader>

    <CardContent>
      {/* ↓ ubah jarak antar field */}
      <form className="space-y-3">
        <FieldGroup className="space-y-0">
          <Field>
            <FieldLabel htmlFor="name">Full Name</FieldLabel>
            <Input
              id="name"
              type="text"
              placeholder="John Doe"
              className="focus-visible:ring-2 focus-visible:ring-primary"
              required
            />
          </Field>

          <Field>
            <FieldLabel htmlFor="email">Email</FieldLabel>
            <Input
              id="email"
              type="email"
              placeholder="m@example.com"
              className="focus-visible:ring-2 focus-visible:ring-primary"
              required
            />
          </Field>

          <Field>
            <FieldLabel htmlFor="password">Password</FieldLabel>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              className="focus-visible:ring-2 focus-visible:ring-primary"
              required
            />
          </Field>

          <Field>
            <FieldLabel htmlFor="confirm-password">
              Confirm Password
            </FieldLabel>
            <Input
              id="confirm-password"
              type="password"
              placeholder="••••••••"
              className="focus-visible:ring-2 focus-visible:ring-primary"
              required
            />
          </Field>
        </FieldGroup>

            <div className="flex flex-col gap-3">
             <Button type="submit" variant="default" className="w-full bg-blue-500 hover:bg-blue-700">
              Create Account
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
  )
}
