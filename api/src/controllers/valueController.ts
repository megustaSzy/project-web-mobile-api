import { Request, Response } from "express"
import { valueService } from "../services/valueService";
import { ResponseData } from "../utilities/Response";

export const valueController = {

    async getAll(req: Request, res: Response) {
        try {

            const page = Number(req.query.page) || 1;
            const limit = Number(req.query.limit) || 5;
    
            const values = await valueService.getAllValue(page, limit);
            return ResponseData.ok(res, values, "berhasil menampilkan values");

        } catch (error) {
            return ResponseData.serverError(res, error)
        }
    },

    async getValueById(req: Request, res: Response) {
        try {
            const id = Number(req.params.id);

            if(isNaN(id)) return ResponseData.badRequest(res, "id tidak valid");

            const value = await valueService.valueById(id);
            return ResponseData.ok(res, value, "berhasil menampilkan value");

        } catch (error) {
            return ResponseData.serverError(res, error)
        }
    },

    async createValue(req: Request, res: Response) {
        try {
            const value = await valueService.createValue(req.body);

            return ResponseData.created(res, value, "value berhasil ditambahkan");
        } catch (error) {
            return ResponseData.serverError(res, error)
        }
    },

    async editById(req: Request, res: Response) {
        try {
            const id = Number(req.params.id);
    
            if(isNaN(id)) return ResponseData.badRequest(res, "id tidak valid");
    
            const updateValue = await valueService.editValue(id, req.body);
    
            return ResponseData.ok(res, updateValue, "value berhasil diperbarui");
            
        } catch (error) {
            return ResponseData.serverError(res, error)
        }
    },

    async deleteById(req: Request, res: Response) {
        try {
            const id = Number(req.params.id);
    
            if(isNaN(id)) return ResponseData.badRequest(res, "id tidak valid");
    
            const value = await valueService.deleteById(id);
    
            return ResponseData.ok(res, value, "value berhasil dihapus");
            
        } catch (error) {
            return ResponseData.serverError(res, error)
        }
    }

}