import { pickupLocationService } from "../services/pickupLocationService";
import { NextFunction, Request, Response } from "express";
import { createError } from "../utils/createError";



export const pickupLocationController = {
    
    async getAllPickup (req: Request, res: Response, next: NextFunction) {
        try {
            const pickupLocation = await pickupLocationService.getAllPickups();
            
            return res.status(200).json({
                success: true,
                pickupLocation
            });
            
        } catch (error) {
            next(error)
        }
    },

    async getPickupById (req: Request, res: Response, next: NextFunction) {
        try {
            const id = Number(req.params.id);
        
            if(isNaN(id)) createError("id tidak valid", 400);
        
            const pickUp = await pickupLocationService.getPickupById(id);
            if(!pickUp) createError("user tidak ditemukan", 400);
        
            return res.status(200).json({
                success: true,
                pickUp
            })
        
        } catch (error) {
            next(error)
        }
    },

    async addPickup (req: Request, res: Response, next: NextFunction) {
        try {
            const pickUp = await pickupLocationService.createPickupLocation(req.body);

            return res.status(201).json({
                message: "berhasil menambah lokasi penjemputan",
                success: true
            })
        } catch (error) {
            next(error)
        }
    },

    async updatePickupLocation(req: Request, res: Response, next: NextFunction) {
        try {
            const id = Number(req.params.id);
    
            if(isNaN(id)) createError("id tidak valid", 400);
    
            const existingPickup = await pickupLocationService.editPickupLocation(id, req.body);
    
            return res.status(200).json({
                message: "lokasi berhasil diperbarui",
                success: true
            })        
            
        } catch (error) {
            next(error)
        }
    },

    async deletePickup(req: Request, res: Response, next: NextFunction) {
        try {
            const id = Number(req.params.id);

            if(isNaN(id)) createError("id tidak valid", 400);
            
            await pickupLocationService.deletePickupById(id);
            
            return res.status(200).json({
                message: "lokasi berhasil dihapus",
                success: true
            })

        } catch (error) {
            next(error)
        }
    }

}