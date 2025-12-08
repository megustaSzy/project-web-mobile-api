import { Request, Response } from "express";
import { teamService } from "../services/teamService";
import { ResponseData } from "../utilities/Response";


export const teamController = {

    async getTeam(req: Request, res: Response) {
        try {
            const team = await teamService.getTeam();

            return ResponseData.ok(res, team, "berhasil mengambil team");
        } catch (error) {
            return ResponseData.serverError(res, error)
        }
    },

    async getByIdTeam(req: Request, res: Response) {
        try {
            const id = Number(req.params.id);
    
            if(isNaN(id)) return ResponseData.badRequest(res, "id tidak valid");

            const team = await teamService.getTeamById(id);

            return ResponseData.ok(res, team)
            
        } catch (error) {
            return ResponseData.serverError(res, error)
        }
    },

    async createTeam(req: Request, res: Response) {

        try {
            const image = req.file ? `/uploads/${req.file.filename}` : null;
            
                const team = await teamService.createTeam({
                    ...req.body,
                    imageUrl: image,
                  });
            
                return ResponseData.created(res, team, "team berhasil ditambahkan");
        } catch (error) {
            return ResponseData.serverError(res, error)
        }

    },

    async editTeam(req: Request, res: Response) {
        try {
            const id = Number(req.params.id);
    
            if(isNaN(id)) return ResponseData.badRequest(res, "id tidak valid");
    
            const team = await teamService.editTeam(id, req.body);
    
            return ResponseData.ok(res, team, "data team berhasil diperbarui");
            
        } catch (error) {
            return ResponseData.serverError(res, error)
        }
    },

    async deleteTeamById(req: Request, res: Response) {
        try {
            
            const id = Number(req.params.id);
    
            if(isNaN(id)) return ResponseData.badRequest(res, "id tidak valid");
    
            const team = await teamService.deleteIdTeam(id);
    
            return ResponseData.ok(res, team, "berhasil menghapus team");
        } catch (error) {
            return ResponseData.serverError(res, error)
        }
    }

}