import { userService } from "../services/userService";
import { Request, Response } from "express";
import { ResponseData } from "../utilities/Response";
import { updateSchema } from "../schemas/updateSchema";

export const userController = {
  async getAllUsers(req: Request, res: Response) {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;

      const users = await userService.getAllUsers(page, limit);

      return ResponseData.ok(res, users);
    } catch (error) {
      return ResponseData.serverError(res, error);
    }
  },

  async getUserById(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);

      if (isNaN(id)) return ResponseData.badRequest(res, "id tidak valid");

      const user = await userService.getUserById(id);

      return ResponseData.ok(res, user);
    } catch (error) {
      return ResponseData.serverError(res, error);
    }
  },

  async editUser(req: Request, res: Response) {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return ResponseData.badRequest(res, "id tidak valid");
    }

    const currentUser = (req as any).user;

    // Admin atau user itu sendiri
    if (currentUser.role !== "Admin" && Number(currentUser.id) !== id) {
      return ResponseData.forbidden(res, "akses ditolak");
    }

    // Siapkan payload
    const payload: any = {
      ...req.body,
    };

    // Upload avatar
    if (req.file) {
      payload.avatar = `/uploads/${req.file.filename}`;
    }

    // Password kosong → jangan update
    if (payload.password === "" || payload.password === null) {
      delete payload.password;
    }

    //VALIDASI ZOD (gaya create kamu)
    const result = updateSchema.safeParse(payload);

    if (!result.success) {
      return ResponseData.badRequest(res, result.error.issues[0].message);
    }

    try {
      const updatedUser = await userService.updateUserById(id, result.data);
      return ResponseData.ok(res, updatedUser);
    } catch (error) {
      return ResponseData.serverError(res, error);
    }
  },
  async deleteUser(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);

      if (isNaN(id)) return ResponseData.badRequest(res, "id tidak valid");

      const currentUser = (req as any).user;

      if (currentUser.role !== "Admin") {
        return ResponseData.forbidden(res, "akses ditolak");
      }

      await userService.deleteUserById(id);

      return ResponseData.ok(res, null);
    } catch (error) {
      return ResponseData.serverError(res, error);
    }
  },

  async getProfile(req: Request, res: Response) {
    return ResponseData.ok(res, (req as any).user);
  },
};
