import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import prisma from "../lib/prisma";
import { ResponseData } from "../utilities/Response";

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Ambil token dari header Authorization
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return ResponseData.unauthorized(res, "token tidak ditemukan");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      id: number;
      tokenId: string;
    };

    // Cek apakah accessToken valid
    const tokenExists = await prisma.tb_accessToken.findFirst({
      where: { tokenId: decoded.tokenId },
    });

    if (!tokenExists) {
      return ResponseData.forbidden(
        res,
        "token sudah tidak valid (sudah logout)"
      );
    }

    const user = await prisma.tb_user.findUnique({
      where: { id: decoded.id },
      select: { id: true, name: true, email: true, role: true },
    });

    if (!user) {
      return ResponseData.notFound(res, "user tidak ditemukan");
    }

    (req as any).user = user;
    next();
  } catch (err) {
    return ResponseData.forbidden(res, "token tidak valid atau expired");
  }
};
