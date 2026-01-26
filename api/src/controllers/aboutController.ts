import { Response, Request, NextFunction } from "express";
import { aboutService } from "../services/aboutService";
import { ResponseData } from "../utilities/Response";
import { logActivity } from "../utilities/activityLogger";
import { ActivityAction } from "@prisma/client";

export const aboutController = {
  async getAbout(req: Request, res: Response, next: NextFunction) {
    try {
      const about = await aboutService.getAbout();

      return ResponseData.ok(res, about);
    } catch (error) {
      next(error);
    }
  },

  async createAbout(req: Request, res: Response, next: NextFunction) {
    try {
      const user = (req as any).user;
      const data = await aboutService.createAbout(req.body);

      await logActivity({
        userId: user.id,
        role: user.role,
        action: ActivityAction.ADMIN_CREATE_ABOUT,
        description: `Tambah about`,
        req,
      });

      return ResponseData.created(res, data);
    } catch (error) {
      next(error);
    }
  },

  async updateAbout(req: Request, res: Response, next: NextFunction) {
    try {
      const user = (req as any).user;
      const id = Number(req.params.id);

      if (isNaN(id)) return ResponseData.badRequest(res, "id tidak valid");

      const data = await aboutService.updateAbout(id, req.body);

      await logActivity({
        userId: user.id,
        role: user.role,
        action: ActivityAction.ADMIN_UPDATE_ABOUT,
        description: `Ubah about`,
        req,
      });

      return ResponseData.ok(res, data);
    } catch (error) {
      next(error);
    }
  },

  async deleteAbout(req: Request, res: Response, next: NextFunction) {
    try {
      const user = (req as any).user;
      const id = Number(req.params.id);

      const data = await aboutService.deleteAbout(id);

      await logActivity({
        userId: user.id,
        role: user.role,
        action: ActivityAction.ADMIN_DELETE_ABOUT,
        description: `Hapus about`,
        req,
      });

      return ResponseData.ok(res, data);
    } catch (error) {
      next(error);
    }
  },
};
