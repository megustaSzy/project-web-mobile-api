import { userService } from "../services/userService";
import { Request, Response, NextFunction } from "express";
import { createError } from "../utils/createError";

export const userController = {

  async getAllUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const users = await userService.getAllUsers();

      return res.status(200).json({
        success: true,
        users,
      });
    } catch (error) {
      next(error);
    }
  },

  async getUserById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);

      if (isNaN(id)) throw createError("ID tidak valid", 400);

      const user = await userService.getUserById(id);

      if (!user) throw createError("User tidak ditemukan", 404);

      return res.status(200).json({
        success: true,
        user,
      });
    } catch (error) {
      next(error);
    }
  },

  async editUser(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);

      if (isNaN(id)) throw createError("ID tidak valid", 400);

      const currentUser = (req as any).user;

      if (currentUser.role !== "Admin" && currentUser.id !== id) {
        throw createError("Akses ditolak", 403);
      }

      const updatedUser = await userService.updateUserById(id, req.body);

      return res.status(200).json({
        success: true,
        message: "User berhasil diperbarui",
        user: updatedUser,
      });
    } catch (error) {
      next(error);
    }
  },

  async deleteUser(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);

      if (isNaN(id)) throw createError("ID tidak valid", 400);

      const currentUser = (req as any).user;

      if (currentUser.role !== "Admin") {
        throw createError("Akses ditolak", 403);
      }

      await userService.deleteUserById(id);

      return res.status(200).json({
        success: true,
        message: "User berhasil dihapus",
      });
    } catch (error) {
      next(error);
    }
  },

  async getProfile(req: Request, res: Response) {
    return res.status(200).json({
      success: true,
      user: (req as any).user,
    });
  },
};
