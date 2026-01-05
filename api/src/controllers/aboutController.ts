import { Response, Request, NextFunction } from "express";
import { aboutService } from "../services/aboutService";
import { ResponseData } from "../utilities/Response";



export const aboutController = {

    async getAbout(req: Request, res: Response, next: NextFunction) {
        try {
            const about = await aboutService.getAbout();

            return ResponseData.ok(res, about)
        } catch (error) {
            next(error)
        }
    },
    
    async createAbout(req: Request, res: Response, next: NextFunction) {
        try {
            const data = await aboutService.createAbout(req.body);
    
            return ResponseData.created(res, data);
    
        } catch (error) {
            next(error)
        }
    },

    async updateAbout(req: Request, res: Response, next: NextFunction) {
        try {
            const id = Number(req.params.id);

            if(isNaN(id)) return ResponseData.badRequest(res,"id tidak valid");

            const data = await aboutService.updateAbout(id, req.body)

            return ResponseData.ok(res, data)
        } catch (error) {
            next(error)
        }
    },

    async deleteAbout(req: Request, res: Response, next: NextFunction) {
        try {
            const id = Number(req.params.id);

            const data = await aboutService.deleteAbout(id);

            return ResponseData.ok(res, data)
        } catch (error) {
            next(error)
        }
    }
}