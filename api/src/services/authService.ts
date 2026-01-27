import prisma from "../lib/prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { v4 as uuidv4, validate } from "uuid";
import { sendEmail } from "../utilities/sendEmail";
import { createError } from "../utilities/createError";
import {
  createSessionToken,
  decodeSessionToken,
} from "../utilities/sessionToken";
import { AuthData } from "../schemas/authSchema";
import { comparePassword, hashPassword } from "../lib/hash";

const JWT_SECRET = process.env.JWT_SECRET!;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET!;

export const authService = {
  async registerUser(data: AuthData) {
    const existing = await prisma.tb_user.findUnique({
      where: { email: data.email },
    });

    if (existing) throw createError("email sudah digunakan", 409);

    const hash = await hashPassword(data.password);

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
    const user = await prisma.tb_user.findFirst({
      where: {
        id: userId,
      },
      select: {
        name: true,
        email: true,
      },
    });

    if (!user) throw createError("user tidak ditemukan", 404);

    const accessTokenId = uuidv4();
    const refreshTokenId = uuidv4();

    // access token 1 jam
    const accessToken = jwt.sign(
      {
        id: userId,
        name: user.name,
        email: user.email,
        tokenId: accessTokenId,
      }, // add name, email
      JWT_SECRET,
      { expiresIn: "1h" },
    );

    await prisma.tb_accessToken.create({
      data: {
        token: accessToken,
        tokenId: accessTokenId,
        userId,
        expiresAt: new Date(Date.now() + 1 * 60 * 60 * 1000),
      },
    });

    // refresh token 7 hari
    const refreshToken = jwt.sign(
      {
        id: userId,
        name: user.email,
        email: user.email,
        tokenId: refreshTokenId,
      },
      JWT_REFRESH_SECRET,
      { expiresIn: "7d" },
    );

    await prisma.tb_refreshToken.create({
      data: {
        token: refreshToken,
        tokenId: refreshTokenId,
        userId,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    return { accessToken, refreshToken };
  },

  async loginUser(email: string, password: string) {
    const user = await prisma.tb_user.findUnique({ where: { email } });
    if (!user) throw createError("email tidak ditemukan", 404);

    const isMatch = await comparePassword(password, user.password!);
    if (!isMatch) throw createError("password salah", 400);

    // hapus semua sisa token user
    await prisma.tb_accessToken.deleteMany({ where: { userId: user.id } });
    await prisma.tb_refreshToken.deleteMany({ where: { userId: user.id } });

    // buat token baru
    const { accessToken, refreshToken } = await this.createTokens(user.id);

    const { password: _, ...safeUser } = user;
    return { user: safeUser, accessToken, refreshToken };
  },

  async refreshAccessToken(refreshToken: string) {
    let payload: any;
    try {
      payload = jwt.verify(refreshToken, JWT_REFRESH_SECRET);
    } catch {
      throw createError("refresh token tidak valid", 401);
    }

    const stored = await prisma.tb_refreshToken.findUnique({
      where: { tokenId: payload.tokenId },
    });

    if (!stored) throw createError("refresh token tidak terdaftar", 401);
    if (stored.expiresAt < new Date())
      throw createError("refresh token kadaluarsa", 401);

    // generate access token baru
    const newAccessTokenId = uuidv4();
    const newAccessToken = jwt.sign(
      { id: payload.id, tokenId: newAccessTokenId },
      JWT_SECRET,
      { expiresIn: "1h" },
    );

    await prisma.tb_accessToken.create({
      data: {
        token: newAccessToken,
        tokenId: newAccessTokenId,
        userId: payload.id,
        expiresAt: new Date(Date.now() + 1 * 60 * 60 * 1000),
      },
    });

    return newAccessToken;
  },

  async logoutUser(refreshToken: string) {
    try {
      const payload: any = jwt.verify(refreshToken, JWT_REFRESH_SECRET);

      // hapus semua token milik user
      await prisma.tb_accessToken.deleteMany({ where: { userId: payload.id } });

      await prisma.tb_refreshToken.deleteMany({
        where: { userId: payload.id },
      });
    } catch {
      // abaikan token invalid
    }

    return "logout berhasil";
  },

  async loginWithGoogle(profile: any) {
    if (!profile.emails || !profile.emails[0])
      createError("email google tidak ditemukan", 404);

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

  async requestForgotPassword(email: string) {
    if (!email) throw createError("email wajib diisi", 400);

    const user = await prisma.tb_user.findUnique({
      where: {
        email,
      },
    });

    if (!user) throw createError("email tidak ditemukan", 404);

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    await prisma.tb_otp.create({
      data: {
        email,
        otp,
        expiresAt,
      },
    });

    const session = {
      email,
      otp,
      expiresAt: expiresAt.toISOString(),
    };

    const sessionToken = createSessionToken(session);

    const resetLink = `${process.env.FRONTEND_URL}/reset-password?sessionToken=${sessionToken}`;

    await sendEmail(
      email,
      "Reset Password Akun Anda",
      `
<!DOCTYPE html>
<html>
<body style="margin: 0; padding: 40px 20px; background-color: #f0f4ff; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
    <div style="max-width: 500px; margin: 0 auto; background-color: #ffffff; padding: 40px; border-radius: 12px; box-shadow: 0 2px 8px rgba(37, 99, 235, 0.1);">
        
        <p style="margin: 0 0 20px; color: #1e293b; font-size: 16px;">
            Halo,
        </p>
        
        <p style="margin: 0 0 30px; color: #475569; font-size: 15px; line-height: 1.6;">
            Berikut adalah link untuk reset password Anda:
        </p>
        
        <div style="text-align: center; margin: 0 0 30px;">
            <a href="${resetLink}" style="
                display: inline-block;
                padding: 14px 32px;
                background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
                color: #ffffff;
                text-decoration: none;
                border-radius: 8px;
                font-weight: 600;
                font-size: 15px;
                box-shadow: 0 4px 12px rgba(37, 99, 235, 0.25);
            ">
                Reset Password
            </a>
        </div>
        
        <div style="background-color: #eff6ff; border-left: 3px solid #3b82f6; padding: 14px 16px; border-radius: 6px; margin-bottom: 24px;">
            <p style="margin: 0; color: #1e40af; font-size: 14px;">
                ⏰ Link ini hanya berlaku selama <strong>5 menit</strong>.
            </p>
        </div>
        
        <p style="margin: 0; color: #475569; font-size: 15px;">
            Terima kasih.
        </p>
        
    </div>
</body>
</html>
`,
    );

    return {
      message: "Link reset password telah dikirim lewat email",
      resetLink,
    };
  },

  async verifySession(sessionToken: string) {
    if (!sessionToken) throw createError("token tidak ditemukan", 404);

    const decoded = decodeSessionToken(sessionToken);
    const { email, otp } = decoded;

    // cek db
    const record = await prisma.tb_otp.findFirst({
      where: {
        email,
        otp,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    if (!record) throw createError("token tidak valid", 400);
    if (record.expiresAt < new Date()) throw createError("token expired", 400);

    return {
      valid: true,
      email,
    };
  },

  async resetPassword(sessionToken: string, newPassword: string) {
    if (!sessionToken) throw createError("token tidak ditemukan", 404);
    if (!newPassword) throw createError("password wajib diisi", 400);

    const decoded = decodeSessionToken(sessionToken);
    const { email, otp } = decoded;

    // cek db
    const record = await prisma.tb_otp.findFirst({
      where: {
        email,
        otp,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    if (!record) throw createError("token tidak valid", 400);
    if (record.expiresAt < new Date()) throw createError("Token expired", 400);

    // update password user

    const hashed = await bcrypt.hash(newPassword, 10);

    await prisma.tb_user.update({
      where: {
        email,
      },
      data: {
        password: hashed,
      },
    });

    await prisma.tb_otp.deleteMany({
      where: {
        email,
      },
    });

    return {
      message: "password berhasil direset",
    };
  },
};
