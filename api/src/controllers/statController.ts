import { Request, Response } from "express";
import { statService } from "../services/statService";
import { ResponseData } from "../utilities/Response";

export const statController = {
  async getStats(req: Request, res: Response) {
    try {
      const data = await statService.getStats();
      return res.json({
        success: true,
        message: "Berhasil mengambil statistik",
        data,
      });
    } catch (error) {
      return res.status(500).json({ success: false, message: "Error" });
    }
  },
};
