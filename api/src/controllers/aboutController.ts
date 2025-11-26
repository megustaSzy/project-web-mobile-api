import { Response, Request, response } from "express";
import { aboutService } from "../services/aboutService";
import { ResponseData } from "../utilities/Response";



export const aboutController = {

    async getAbout(req: Request, res: Response) {
        try {
            const about = await aboutService.getAbout();

            return ResponseData.ok(res, about, "about berhasil ditampilkan")
        } catch (error) {
            return ResponseData.serverError(res, error)
        }
    },
    
    // get history
    async getHistory(req: Request, res: Response) {
        try {
            const data = await aboutService.getField("history");

            if(!data) return ResponseData.notFound(res, "history tidak ditemukan");

            return ResponseData.ok(res, data)
        } catch (error) {
            return ResponseData.serverError(res, error)
        }
    },


    // get vision
    async getVision(req: Request, res: Response) {
        try {
            const data = await aboutService.getField("vision");

            if(!data) return ResponseData.notFound(res, "vision tidak ditemukan");

            return ResponseData.ok(res, data)
        } catch (error) {
            return ResponseData.serverError(res, error)
        }
    },

    // get mission
    async getMission(req: Request, res: Response) {
        try {
            const data = await aboutService.getField("mission");

            if(!data) return ResponseData.notFound(res, "mission tidak ditemukan");

            return ResponseData.ok(res, data)
        } catch (error) {
            return ResponseData.serverError(res, error)
        }
    },
    
    async createAbout(req: Request, res: Response) {
        try {
            const data = await aboutService.createAbout(req.body);
    
            return ResponseData.created(res, data);
    
        } catch (error) {
            return ResponseData.serverError(res, error)
        }
    },


    async updateAbout(req: Request, res: Response) {
        try {
            const id = Number(req.params.id);

            if(isNaN(id)) return ResponseData.badRequest(res,"id tidak valid");

            const data = await aboutService.updateAbout(id, req.body)

            return ResponseData.ok(res, data, "about berhasil diperbarui")
        } catch (error) {
            return ResponseData.serverError(res, error)
        }
    },

    async deleteAbout(req: Request, res: Response) {
        try {
            const id = Number(req.params.id);

            const data = await aboutService.deleteAbout(id);

            return ResponseData.ok(res, data)
        } catch (error) {
            return ResponseData.serverError(res, error)
        }
    }
}