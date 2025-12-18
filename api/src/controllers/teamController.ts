import { Request, Response } from "express";
import { teamService } from "../services/teamService";
import { ResponseData } from "../utilities/Response";
import { uploadToCloudinary } from "../utilities/uploadToCloudinary";
import cloudinary from "../config/cloudinary";

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
        imageUrl: result.secure_url,
        imagePublicId: result.public_id
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

      const team = await teamService.getTeamById(id);
      if (!team) return ResponseData.notFound(res, "team tidak ditemukan");

      let imageUrl: string | undefined;
      let imagePublicId: string | undefined;

      if (req.file) {
        const result: any = await uploadToCloudinary(req.file.buffer);
        imageUrl = result.secure_url;
        imagePublicId = result.public_id;

        if (team.imagePublicId) {
          await cloudinary.uploader.destroy(team.imagePublicId);
        }
      }

      const updateTeam = await teamService.editTeam(id, {
        ...req.body,
        ...(imageUrl && { imageUrl }),
        ...(imagePublicId && { imagePublicId }),
      });

      return ResponseData.ok(res, updateTeam);
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
