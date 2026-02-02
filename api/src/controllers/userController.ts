import { userService } from "../services/userService";
import { NextFunction, Request, Response } from "express";
import { ResponseData } from "../utilities/Response";
import { uploadToCloudinary } from "../utilities/uploadToCloudinary";
import cloudinary from "../config/cloudinary";
import { logActivity } from "../utilities/activityLogger";
import { ActivityAction } from "@prisma/client";
import { updateSchema } from "../schemas/updateSchema";

export const userController = {
  async getAllUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;

      const users = await userService.getAllUsers(page, limit);

      return ResponseData.ok(res, users);
    } catch (error) {
      next(error);
    }
  },

  async getUserById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);

      if (isNaN(id)) return ResponseData.badRequest(res, "id tidak valid");

      const user = await userService.getUserById(id);

      return ResponseData.ok(res, user);
    } catch (error) {
      next(error);
    }
  },

  async editUser(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) return ResponseData.badRequest(res, "id tidak valid");

      const currentUser = (req as any).user;
      if (currentUser.role !== "Admin" && currentUser.id !== id) {
        return ResponseData.forbidden(res, "akses ditolak");
      }

      const user = await userService.getUserById(id);
      if (!user) return ResponseData.notFound(res, "user tidak ditemukan");

      let avatarUrl: string | undefined;
      let avatarPublicId: string | undefined;

      if (req.file) {
        const result: any = await uploadToCloudinary(req.file.buffer);
        avatarUrl = result.secure_url;
        avatarPublicId = result.public_id;

        if (user.avatarPublicId) {
          await cloudinary.uploader.destroy(user.avatarPublicId);
        }
      }

      const payload = updateSchema.parse({
        ...req.body,
        ...(avatarUrl && { avatar: avatarUrl, avatarPublicId }),
      });

      const updatedUser = await userService.updateUserById(id, payload);

      return ResponseData.ok(res, updatedUser);
    } catch (error) {
      next(error);
    }
  },
  async deleteUser(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);

      if (isNaN(id)) return ResponseData.badRequest(res, "id tidak valid");

      const currentUser = (req as any).user;

      if (currentUser.role !== "Admin") {
        return ResponseData.forbidden(res, "akses ditolak");
      }

      const deleted = await userService.deleteUserById(id);

      await logActivity({
        userId: currentUser.id,
        role: currentUser.role,
        action: ActivityAction.ADMIN_DELETE_USER,
        description: `Hapus user ${deleted.name}`,
        req,
      });

      return ResponseData.ok(res, deleted);
    } catch (error) {
      next(error);
    }
  },

  async getProfile(req: Request, res: Response, next: NextFunction) {
    return ResponseData.ok(res, (req as any).user);
  },
};
