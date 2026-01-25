import { Request, Response } from "express";
import { activityService } from "../services/activityService";
import { ResponseData } from "../utilities/Response";

export const activityController = {
  // ADMIN
  async getAdminLogs(req: Request, res: Response) {
    const adminId = (req as any).user.id;
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const result = await activityService.getAdminLogs(adminId, page, limit);
    return ResponseData.ok(res, result);
  },

  // USER
  async getUserLogs(req: Request, res: Response) {
    const userId = (req as any).user.id;
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const result = await activityService.getUserLogs(userId, page, limit);
    return ResponseData.ok(res, result);
  },
};
