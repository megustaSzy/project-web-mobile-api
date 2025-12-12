import { Request, Response } from "express";
import { bannerService } from "../services/bannerService";
import { ResponseData } from "../utilities/Response";

export const bannerController = {

    async getBanner(req: Request, res: Response) {
        try {
            const banner = await bannerService.getAllBanner();
    
            return ResponseData.ok(res, banner, "berhasil mengambil data");
        } catch (error) {
            return ResponseData.serverError(res, error);
        }
    },

    async getByIdBanner(req: Request, res: Response) {
        try {
            const id = Number(req.params.id);
            if(isNaN(id)) return ResponseData.badRequest(res, "id tidak valid");

            const banner = await bannerService.getByIdBanner(id);

            return ResponseData.ok(res, banner);
        } catch (error) {
            return ResponseData.serverError(res, error)
        }
    },

    async create(req: Request, res: Response) {
        try {
            
            const banner = await bannerService.createBanner(req.body);

            return ResponseData.created(res, banner)

        } catch (error) {
            return ResponseData.serverError(res, error)
        }
    },

    async edit(req: Request, res: Response) {
        try {
            const id = Number(req.params.id);

            if(isNaN(id)) return ResponseData.badRequest(res, "id tidak valid");

            const banner = await bannerService.editBanner(id, req.body);

            return ResponseData.ok(res, banner);
        } catch (error) {
            return ResponseData.serverError(res, error)
        }
    },


    async deleteBanner(req: Request, res: Response) {
        try {
            const id = Number(req.params.id);

            if(isNaN(id)) return ResponseData.badRequest(res, "id tidak valid");

            const banner = await bannerService.deleteBanner(id);

            return ResponseData.ok(res, banner)
        } catch (error) {
            return ResponseData.serverError(res, error)
        }
    }

}