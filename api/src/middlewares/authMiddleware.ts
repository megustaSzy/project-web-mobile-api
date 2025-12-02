import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import prisma from "../lib/prisma";
import { ResponseData } from "../utilities/Response";

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Ambil token dari cookie ATAU header Authorization
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return ResponseData.unauthorized(res, "token tidak ditemukan");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      id: number;
    };

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
