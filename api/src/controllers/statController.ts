import { Request, Response } from "express";
import { statService } from "../services/statsService";
import { ResponseData } from "../utilities/Response";

export const statController = {

    async getCounts (req: Request, res: Response) {
        try {
            const result = await statService.getCounts();

            return ResponseData.ok(res, result, "berhasil mengambil statistik")
        } catch (error) {
            return ResponseData.serverError(res, error)
        }
    }

}   