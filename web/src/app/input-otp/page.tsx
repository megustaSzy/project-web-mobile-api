"use client";

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { apiFetch } from "@/helpers/api";
import { VerifyOtpResponse, ResetPasswordResponse } from "@/types/auth";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

export default function Page() {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);

  const searchParams = useSearchParams();
  const router = useRouter();

  //  Ambil email dari query
  const email = searchParams.get("email") || "";

  //  Resend OTP
  const handleResendOtp = async () => {
    setResendLoading(true);

    try {
      const res = await apiFetch<ResetPasswordResponse>(
        "/api/auth/forgot-password",
        {
          method: "POST",
          body: JSON.stringify({ email }),
        }
      );

      if (res.status === 200) {
        alert(res.data || "OTP baru telah dikirim ke email Anda!");
      } else {
        alert(res.message || "Gagal mengirim ulang OTP");
      }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      alert("Terjadi kesalahan server");
    } finally {
      setResendLoading(false);
    }
  };

  //  Verify OTP
  const handleVerify = async () => {
    if (otp.length < 6) return alert("OTP harus 6 digit!");

    setLoading(true);

    try {
      const res = await apiFetch<VerifyOtpResponse>("/api/auth/verify-otp", {
        method: "POST",
        body: JSON.stringify({ email, otp }),
      });

      if (res.status === 200) {
        alert("OTP benar! Silakan buat password baru.");
        router.push(`/reset-password?email=${encodeURIComponent(email)}`);
      } else {
        alert(res.message || "OTP salah!");
      }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      alert("Terjadi kesalahan server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10 bg-gray-100">
      <Card className="w-full max-w-sm shadow-lg rounded-xl">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-semibold">
            Verifikasi OTP
          </CardTitle>
          <CardDescription className="text-center text-gray-600">
            Kode OTP telah dikirim ke{" "}
            <span className="font-medium text-gray-800">{email}</span>
          </CardDescription>
        </CardHeader>

        <CardContent>
          {/* OTP Input */}
          <div className="flex justify-center my-6">
            <InputOTP maxLength={6} value={otp} onChange={setOtp}>
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
          </div>

          {/* Verify Button */}
          <Button
            onClick={handleVerify}
            disabled={loading}
            className="w-full mt-2 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg"
          >
            {loading ? "Memeriksa..." : "Verifikasi OTP"}
          </Button>

          {/* Resend */}
          <p className="text-center text-sm text-gray-500 mt-4">
            Tidak menerima kode?{" "}
            <span
              className="text-blue-600 hover:underline cursor-pointer font-medium"
              onClick={handleResendOtp}
            >
              {resendLoading ? "Mengirim..." : "Kirim ulang"}
            </span>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
