import { Request, Response } from "express";
import { regionService } from "../services/regionService";
import { ResponseData } from "../utilities/Response";

export const regionController = {
  async getRegencies(req: Request, res: Response) {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;

      const region = await regionService.getAll(page, limit);

      return ResponseData.ok(res, region);
    } catch (error) {
      return ResponseData.serverError(res, error);
    }
  },

  async getById(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);

      if(isNaN(id)) return ResponseData.badRequest(res, "id tidak valid");

      const region = await regionService.getById(id);

      return ResponseData.ok(res, region);
    } catch (error) {
      return ResponseData.serverError(res, error);
    }
  },

  async create(req: Request, res: Response) {
    try {
      const { name } = req.body;

      if(!name) {
        return ResponseData.badRequest(res, "nama region wajib diisi")
      }

      const region = await regionService.createRegion(req.body);

      return ResponseData.ok(res, region);
    } catch (error) {
      return ResponseData.serverError(res, error)
    }
  },

  async edit(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);

      if(isNaN(id)) return ResponseData.badRequest(res, "id tidak valid");

      const region = await regionService.editRegion(id, req.body);

      return ResponseData.ok(res, region)
    } catch (error) {
      return ResponseData.serverError(res, error)
    }
  },

  async deleteRegion(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);

      if(isNaN(id)) return ResponseData.badRequest(res, "id tidak valid");

      const region = await regionService.deleteRegion(id);

      return ResponseData.ok(res, region)
    } catch (error) {
      return ResponseData.serverError(res, error)
    }
  }
};
