import prisma from "../lib/prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import { AuthData } from "../types/auth";
import { sendEmail } from "../utilities/sendEmail";
import { createError } from "../utilities/createError";

const JWT_SECRET = process.env.JWT_SECRET!;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET!;

export const authService = {
  async registerUser(data: AuthData) {
    if(!data.name) createError ("nama wajib diisi", 409);
    if(!data.email) createError("email wajib diisi", 400);
    if(!data.email.includes("@")) createError("format email tidak valid", 400);
    if(!data.password || data.password.length < 6) createError ("password minimal 6 karakter", 400)

    const existing = await prisma.tb_user.findUnique({
      where: { email: data.email },
    });

    if (existing) createError("email sudah digunakan", 409);

    const hash = await bcrypt.hash(data.password, 10);

    return prisma.tb_user.create({
      data: {
        name: data.name,
        email: data.email,
        password: hash,
        role: data.role || "User",
        notelp: data.notelp || "",
      },
    });
  },

  async createTokens(userId: number) {
    const tokenId = uuidv4();

    const accessToken = jwt.sign({ id: userId }, JWT_SECRET, {
      expiresIn: "1d",
    });

    await prisma.tb_accessToken.create({
      data: {
        token: accessToken,
        tokenId,
        userId,
        expiresAt: new Date(Date.now() + 1 * 24 * 60 * 1000),
      }
    })

    const refreshToken = jwt.sign({ id: userId, tokenId }, JWT_REFRESH_SECRET, {
      expiresIn: "7d",
    });

    await prisma.tb_refreshToken.create({
      data: {
        token: refreshToken,
        tokenId,
        userId,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    return { accessToken, refreshToken };
  },

  async loginUser(email: string, password: string) {
    const user = await prisma.tb_user.findUnique({ where: { email } });
    if (!user) throw new Error("email tidak ditemukan");

    const isMatch = await bcrypt.compare(password, user.password!);
    if (!isMatch) throw new Error("password salah");

    await prisma.tb_refreshToken.deleteMany({
      where: { userId: user.id },
    });

    const { accessToken, refreshToken } = await this.createTokens(user.id);

    const { password: _, ...safeUser } = user;
    return { user: safeUser, accessToken, refreshToken };
  },

  async refreshAccessToken(refreshToken: string) {
    const payload: any = jwt.verify(refreshToken, JWT_REFRESH_SECRET);

    const stored = await prisma.tb_refreshToken.findUnique({
      where: { tokenId: payload.tokenId },
    });

    if (!stored) throw new Error("refresh token tidak terdaftar");
    if (stored.expiresAt < new Date())
      throw new Error("refresh token kadaluarsa");

    const newAccessToken = jwt.sign({ id: payload.id }, JWT_SECRET, {
      expiresIn: "1h",
    });

    return newAccessToken;
  },

  async logoutUser(refreshToken: string) {
    try {
      const payload: any = jwt.verify(refreshToken, JWT_REFRESH_SECRET);
      await prisma.tb_refreshToken.deleteMany({
        where: { tokenId: payload.tokenId },
      });
    } catch {
      // abaikan token invalid
    }
  },

  async loginWithGoogle(profile: any) {
    if(!profile.emails || !profile.emails[0]) createError("email google tidak ditemukan", 404);

    const email = profile.emails[0].value;
    const name = profile.displayName;

    let user = await prisma.tb_user.findUnique({ where: { email } });

    if (!user) {
      user = await prisma.tb_user.create({
        data: {
          name,
          email,
          provider: "google",
          providerId: profile.id,
          password: null,
          notelp: null,
          role: "User",
        },
      });
    }

    const { accessToken, refreshToken } = await this.createTokens(user.id);
    return { user, accessToken, refreshToken };
  },

  async requestOtp(email: string) {
    if(!email) createError("email wajib diisi", 400);

    const user = await prisma.tb_user.findUnique({ where: { email } });
    if (!user) createError("email tidak ditemukan", 404);

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expires = new Date(Date.now() + 5 * 60 * 1000);

    await prisma.tb_otp.create({
      data: {
        email,
        otp,
        expiresAt: expires,
      },
    });

    await sendEmail(
      email,
      "Kode OTP Reset Password",
      `Kode OTP Anda: ${otp}\nKode berlaku selama 5 menit`
    );

    return "Kode OTP berhasil dikirim";
  },

  async verifyOtp(email: string, otp: string) {
    if(!email || !otp) createError("email dan otp wajib diisi", 400);

    const record = await prisma.tb_otp.findFirst({
      where: { email, otp },
      orderBy: { createdAt: "desc" },
    });

    if (!record) throw new Error("OTP salah");
    if (record.expiresAt < new Date()) throw new Error("OTP kadaluarsa");

    await prisma.tb_otp.delete({ where: { id: record.id } });

    return "OTP valid";
  },

  async resetPassword(email: string, newPassword: string) {
    if(!newPassword || newPassword.length < 6) createError("password minimal 6 karakter", 400);
    
    const hash = await bcrypt.hash(newPassword, 10);

    await prisma.tb_user.update({
      where: { email },
      data: { password: hash },
    });

    return "password berhasil direset";
  },
};
