import prisma from "../lib/prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import { AuthData } from "../types/auth";

const JWT_SECRET = process.env.JWT_SECRET!;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET!;

export const authService = {

    async registerUser(data: AuthData) {

        const existingUser = await prisma.tb_user.findUnique({
            where: { email: data.email }
        });

        if (existingUser) throw new Error("email sudah digunakan");

        const hashedPassword = await bcrypt.hash(data.password, 10);

        return prisma.tb_user.create({
            data: {
                name: data.name,
                email: data.email,
                password: hashedPassword,
                role: data.role || "User",
                notelp: data.notelp || ""
            }
        });
    },

    async loginUser(email: string, password: string) {

        const user = await prisma.tb_user.findUnique({ where: { email } });
        if (!user) throw new Error("email tidak ditemukan");

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) throw new Error("password salah");

        // Hapus semua refresh token lama user
        await prisma.tb_refreshToken.deleteMany({
            where: { userId: user.id }
        });

        // ==== ACCESS TOKEN (JWT) ====
        const accessToken = jwt.sign(
            {
                id: user.id,
                email: user.email,
                role: user.role
            },
            JWT_SECRET,
            { expiresIn: "10m" }
        );

        // ==== REFRESH TOKEN (JWT disimpan di DB) ====
        const tokenId = uuidv4();

        const refreshToken = jwt.sign(
            {
                id: user.id,
                tokenId: tokenId
            },
            JWT_REFRESH_SECRET,
            { expiresIn: "7d" }
        );

        await prisma.tb_refreshToken.create({
            data: {
                token: refreshToken,
                tokenId: tokenId,
                userId: user.id,
                expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
            }
        });

        const { password: _, ...safeUser } = user;
        return { user: safeUser, token: accessToken, refreshToken };
    },

    async refreshAccessToken(refreshToken: string) {

        let payload: any;
        try {
            payload = jwt.verify(refreshToken, JWT_REFRESH_SECRET) as any;
        } catch (err) {
            throw new Error("refresh token tidak valid");
        }

        const stored = await prisma.tb_refreshToken.findUnique({
            where: { tokenId: payload.tokenId }
        });

        if (!stored) throw new Error("refresh token tidak terdaftar");
        if (stored.expiresAt < new Date()) throw new Error("refresh token kadaluarsa");

        const user = await prisma.tb_user.findUnique({
            where: { id: stored.userId }
        });

        if (!user) throw new Error("user tidak ditemukan");

        const newAccessToken = jwt.sign(
            {
                id: user.id,
                email: user.email,
                role: user.role
            },
            JWT_SECRET,
            { expiresIn: "10m" }
        );

        return newAccessToken;
    },

    async logoutUser(refreshToken: string) {
        try {
            const payload: any = jwt.verify(refreshToken, JWT_REFRESH_SECRET);
            await prisma.tb_refreshToken.deleteMany({
                where: { tokenId: payload.tokenId }
            });
        } catch (err) {
            // token invalid → abaikan
        }
    }
};
