  import { userService } from "../services/userService";
  import { Request, Response } from "express";
  import { ResponseData } from "../utilities/Response";

  export const userController = {
    async getAllUsers(req: Request, res: Response) {
      try {
        const page = Number(req.query.page) || 1;
        const limit =  Number(req.query.limit) || 10;

        const users = await userService.getAllUsers(page, limit);

        return ResponseData.ok(res, users, "daftar user berhasil diambil");
      } catch (error) {
        return ResponseData.serverError(res, error);
      }
    },

    async getUserById(req: Request, res: Response) {
      try {
        const id = Number(req.params.id);

        if (isNaN(id)) return ResponseData.badRequest(res, "id tidak valid");

        const user = await userService.getUserById(id);

        return ResponseData.ok(res, user, "user berhasil diambil");
      } catch (error) {
        return ResponseData.serverError(res, error);
      }
    },

    async editUser(req: Request, res: Response) {
      try {
        const id = Number(req.params.id);

        if (isNaN(id)) return ResponseData.badRequest(res, "id tidak valid");

        const currentUser = (req as any).user;

        if (currentUser.role !== "Admin" && Number(currentUser.id) !== id) {
          return ResponseData.forbidden(res, "akses ditolak");
        }

        const updatedUser = await userService.updateUserById(id, req.body);

        return ResponseData.ok(res, updatedUser, "user berhasil diperbarui");
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

        return ResponseData.ok(res, null, "user berhasil dihapus");
      } catch (error) {
        return ResponseData.serverError(res, error);
      }
    },

    async getProfile(req: Request, res: Response) {
      return ResponseData.ok(res, (req as any).user, "profil berhasil diambil");
    },
  };
