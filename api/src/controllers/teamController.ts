import { NextFunction, Request, Response } from "express";
import { teamService } from "../services/teamService";
import { ResponseData } from "../utilities/Response";
import { uploadToCloudinary } from "../utilities/uploadToCloudinary";
import cloudinary from "../config/cloudinary";
import { logActivity } from "../utilities/activityLogger";
import { ActivityAction } from "@prisma/client";

// testing
export const teamController = {
  async getTeam(req: Request, res: Response, next: NextFunction) {
    try {
      const team = await teamService.getTeam();

      return ResponseData.ok(res, team);
    } catch (error) {
      next(error);
    }
  },

  async getByIdTeam(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);

      if (isNaN(id)) return ResponseData.badRequest(res, "id tidak valid");

      const team = await teamService.getTeamById(id);

      return ResponseData.ok(res, team);
    } catch (error) {
      next(error);
    }
  },

  async createTeam(req: Request, res: Response, next: NextFunction) {
    try {
      const user = (req as any).user;
      if (!req.file) {
        return ResponseData.badRequest(res, "image wajib diupload");
      }

      const result: any = await uploadToCloudinary(req.file.buffer);

      const team = await teamService.createTeam({
        name: req.body.name,
        job: req.body.job,
        imageUrl: result.secure_url,
        imagePublicId: result.public_id,
      });

      await logActivity({
        userId: user.id,
        role: user.role,
        action: ActivityAction.ADMIN_CREATE_TEAM,
        description: `Tambah team`,
        req,
      });

      return ResponseData.created(res, team);
    } catch (error) {
      next(error);
    }
  },

  async editTeam(req: Request, res: Response, next: NextFunction) {
    try {
      const user = (req as any).user;

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

      await logActivity({
        userId: user.id,
        role: user.role,
        action: ActivityAction.ADMIN_UPDATE_TEAM,
        description: `Ubah value`,
        req,
      });

      return ResponseData.ok(res, updateTeam);
    } catch (error) {
      next(error);
    }
  },

  async deleteTeamById(req: Request, res: Response, next: NextFunction) {
    try {
      const user = (req as any).user;
      const id = Number(req.params.id);

      if (isNaN(id)) return ResponseData.badRequest(res, "id tidak valid");

      const team = await teamService.deleteIdTeam(id);

      await logActivity({
        userId: user.id,
        role: user.role,
        action: ActivityAction.ADMIN_DELETE_TEAM,
        description: `Hapus team`,
        req,
      });

      return ResponseData.ok(res, team);
    } catch (error) {
      next(error);
    }
  },
};
