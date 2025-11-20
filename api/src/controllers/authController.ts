import { authService } from "../services/authService";
import { Request, Response } from "express";

export const authController = {

  // POST /register
  // Membuat akun baru
  async register(req: Request, res: Response) {
    try {
      const user = await authService.registerUser(req.body);

      return res.status(201).json({
        success: true,
        message: "Berhasil membuat akun",
        user,
      });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  },

  // POST /login
  // Login user dan buat token + refreshToken
  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: "Email dan password wajib diisi",
        });
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

      return res.status(200).json({
        success: true,
        message: "Login berhasil",
        user,
        token,
        refreshToken,
      });

    } catch (error: any) {
      return res.status(401).json({
        success: false,
        message: error.message,
      });
    }
  },

  // POST /refresh-token
  // Memperbarui access token menggunakan refresh token
  async refreshToken(req: Request, res: Response) {
    try {
      const token = req.cookies.refreshToken;
      if (!token) {
        return res.status(401).json({
          success: false,
          message: "No refresh token",
        });
      }

      const newAccessToken = await authService.refreshAccessToken(token);

      return res.status(200).json({
        success: true,
        token: newAccessToken,
      });

    } catch (error: any) {
      return res.status(401).json({
        success: false,
        message: error.message,
      });
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

      return res.status(200).json({
        success: true,
        message: "Logout berhasil",
      });

    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  },

};
