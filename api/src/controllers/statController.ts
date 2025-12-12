import { Request, Response } from "express";
import { statService } from "../services/statService";
import { ResponseData } from "../utilities/Response";

export const statController = {
  async getStats(req: Request, res: Response) {
    try {
      const data = await statService.getStats();
      return ResponseData.ok(res, data)
    } catch (error) {
      return ResponseData.serverError(res, error)
    }
  },
};
