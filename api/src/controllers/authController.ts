import { authService } from "../services/authService";
import { Request, Response } from "express";

export const authController = {

    async register(req: Request, res: Response) {
        try {
            const user = await authService.registerUser(req.body);

            return res.status(201).json({
                message: "berhasil membuat akun",
                success: true,
                user
            });
            
        } catch (error: any) {
            return res.status(400).json({
                message: error.message,
                success: false
            });
        }
    },

    async login(req: Request, res: Response) {
        try {
            const { email, password } = req.body;

            if (!email || !password) {
                return res.status(400).json({
                    message: "email dan password wajib diisi",
                    success: false
                });
            }

            // 👉 semua logic login ada di authService (good)
            const { user, token, refreshToken } = await authService.loginUser(email, password);

            // simpan refresh token di cookie httpOnly
            res.cookie("refreshToken", refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
                maxAge: 1 * 60 * 1000 // 1 menit (testing)
            });

            return res.status(200).json({
                message: "login berhasil",
                success: true,
                user,
                token,
                refreshToken,
            });

        } catch (error: any) {
            return res.status(401).json({
                message: error.message,
                success: false
            });
        }
    },

    async refreshToken(req: Request, res: Response) {
        try {
            const token = req.cookies.refreshToken;
            if (!token) {
                return res.status(401).json({
                    success: false,
                    message: "no refresh token"
                });
            }

            // 👉 controller hanya memanggil service
            const newAccessToken = await authService.refreshAccessToken(token);

            return res.json({
                success: true,
                token: newAccessToken
            });

        } catch (error: any) {
            return res.status(401).json({
                success: false,
                message: error.message
            });
        }
    },

    async logout(req: Request, res: Response) {
        try {
            const token = req.cookies.refreshToken;

            if (token) {
                await authService.logoutUser(token);
            }

            res.clearCookie("refreshToken");

            return res.json({
                success: true,
                message: "logout berhasil"
            });

        } catch (error: any) {
            return res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

};
