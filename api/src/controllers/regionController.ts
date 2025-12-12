import { Request, Response } from "express";
import { regionService } from "../services/regionService";
import { ResponseData } from "../utilities/Response";

export const regionController = {
  async getRegenciesByProvinsi(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const regencies = await regionService.getRegencies(id);

      return ResponseData.ok(res, regencies, "berhasil menampilkan data");

    } catch (error) {
        return ResponseData.serverError(res, error)
    }
  }
};
