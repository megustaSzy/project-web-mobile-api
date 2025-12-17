import { Request, Response } from "express";
import { teamService } from "../services/teamService";
import { ResponseData } from "../utilities/Response";
import { uploadToCloudinary } from "../utilities/uploadToCloudinary";

// testing
export const teamController = {
  async getTeam(req: Request, res: Response) {
    try {
      const team = await teamService.getTeam();

      return ResponseData.ok(res, team);
    } catch (error) {
      return ResponseData.serverError(res, error);
    }
  },

  async getByIdTeam(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);

      if (isNaN(id)) return ResponseData.badRequest(res, "id tidak valid");

      const team = await teamService.getTeamById(id);

      return ResponseData.ok(res, team);
    } catch (error) {
      return ResponseData.serverError(res, error);
    }
  },

  async createTeam(req: Request, res: Response) {
    try {
      if (!req.file) {
        return ResponseData.badRequest(res, "image wajib diupload");
      }

      const result: any = await uploadToCloudinary(req.file.buffer);

      const team = await teamService.createTeam({
        ...req.body,
        imageUrl: result.secure_url, // simpan URL Cloudinary
      });

      return ResponseData.created(res, team);
    } catch (error) {
      return ResponseData.serverError(res, error);
    }
  },

  async editTeam(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) return ResponseData.badRequest(res, "id tidak valid");

      let imageUrl: string | undefined;

      if (req.file) {
        const result: any = await uploadToCloudinary(req.file.buffer);
        imageUrl = result.secure_url;
      }

      const updateData = {
        ...req.body,
        ...(imageUrl && { imageUrl }),
      };

      const team = await teamService.editTeam(id, updateData);

      return ResponseData.ok(res, team);
    } catch (error) {
      return ResponseData.serverError(res, error);
    }
  },
  
  async deleteTeamById(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);

      if (isNaN(id)) return ResponseData.badRequest(res, "id tidak valid");

      const team = await teamService.deleteIdTeam(id);

      return ResponseData.ok(res, team);
    } catch (error) {
      return ResponseData.serverError(res, error);
    }
  },
};
