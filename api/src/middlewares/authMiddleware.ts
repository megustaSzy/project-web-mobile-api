import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken"
import prisma from "../lib/prisma";
import { ResponseData } from "../utilities/Response";
import { use } from "passport";

export const authMiddleware = async(req: Request, res: Response, next: NextFunction) => {
  // ambil accessToken dari Authorization header: bearer token
  const authHeader = req.headers.authorization;

  const token = authHeader?.startsWith("Bearer ") ? authHeader.split(" ")[1] : null;

  if(!token){
    return ResponseData.unauthorized(res, "access token tidak ditemukan")
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: number };

    const user = await prisma.tb_user.findUnique({
      where: {
        id: decoded.id
      },
      select: {
        id: true,
        name: true,
        email: true,
        notelp: true
      }
    });

    if(!user) {
      return ResponseData.notFound(res, "user tidak ditemukan");
    } 

    (req as any).user = user;
    next();

  } catch (err) {
    return ResponseData.forbidden(res, "token tidak valid atau expired")
  }
}