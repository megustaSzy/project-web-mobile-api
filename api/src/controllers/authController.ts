import { ResponseData } from "@/utilities/Response";
import { authService } from "../services/authService";
import { Request, Response } from "express";

export const authController = {

  // POST /register
  // Membuat akun baru
  async register(req: Request, res: Response) {
    try {
      const user = await authService.registerUser(req.body);

      return ResponseData.created(res, user, "registrasi berhasil");

    } catch (error: any) {
      return ResponseData.badRequest(res, error.message);
    }
  },

  // POST /login
  // Login user dan buat token + refreshToken
  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return ResponseData.badRequest(res, "email dan password wajib diisi");
      }

      // Semua logic login ada di authService
      const { user, token, refreshToken } = await authService.loginUser(email, password);

      // Simpan refresh token di cookie httpOnly
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 1 * 60 * 1000, // 1 menit (testing)
      });

      return ResponseData.ok(res, { user, token }, "login berhasil");

    } catch (error: any) {
      return ResponseData.unauthorized(res, error.message);
    }
  },

  // POST /refresh-token
  // Memperbarui access token menggunakan refresh token
  async refreshToken(req: Request, res: Response) {
    try {
      const token = req.cookies.refreshToken;
      if (!token) {
        return ResponseData.unauthorized(res, "refresh token tidak ditemukan");
      }

      const newAccessToken = await authService.refreshAccessToken(token);

      return ResponseData.ok(res, { token: newAccessToken }, "token berhasil diperbarui");

    } catch (error: any) {
      return ResponseData.unauthorized(res, error.message);
    }
  },

  // POST /logout
  // Logout user dan hapus refresh token
  async logout(req: Request, res: Response) {
    try {
      const token = req.cookies.refreshToken;

      if (token) {
        await authService.logoutUser(token);
      }

      res.clearCookie("refreshToken");

      return ResponseData.ok(res, null, "logout berhasil");

    } catch (error: any) {
      return ResponseData.serverError(res, error);
    }
  },

};
