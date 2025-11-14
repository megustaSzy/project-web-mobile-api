import { NextFunction, Request, Response } from "express"
import { destinationService } from "../services/destinationService";
import { createError } from "../utils/createError";
import prisma from "../lib/prisma";


export const destinationController = {
    async getDestinations(req: Request, res: Response, next: NextFunction) {
        try {
            const destination = await destinationService.getAllDestinations();
            return res.status(200).json({
                message: true,
                destination,
            })

        } catch (error) {
            next(error);
        }
    },

    async getDestinationById(req: Request, res: Response, next: NextFunction) {
        
        try {
            const id = Number(req.params.id);

            if(isNaN(id)) createError("id tidak valid", 400);

            const destination = await destinationService.getDestinationById(id);
            if(!destination) createError("user tidak ditemukan", 400);

            return res.status(200).json({
                success: true,
                destination
            })

        } catch (error) {
            next(error)
        }
    },

    async addDestination(req: Request, res: Response, next: NextFunction) {
        try {

            const destination = await destinationService.addDestination(req.body);

            return res.status(201).json({
                message: "berhasil menambahkan pantai",
                success: true,
            })

        } catch (error) {
            next(error)
        }
    },

    async updateDestination(req: Request, res: Response, next: NextFunction) {
        try {
          const id = Number(req.params.id);
          
          if(isNaN(id)) createError("id tidak valid", 400);

          const existingDestination = await destinationService.editDestination(id, req.body);

          return res.status(200).json({
            success: true,
            message: "destinasi berhasil diperbarui",
          })

        } catch (error) {
            next(error)
        }
    },

    async deleteDestination(req: Request, res: Response, next: NextFunction) {
        try {
            const id = Number(req.params.id);

            if(isNaN(id)) createError("id tidak valid", 400);

            await destinationService.deleteDestinationById(id);

            return res.status(200).json({
                success: true,
                message: "destinasi berhasil dihapus"
            })

        } catch (error) {
            next(error)
        }
    }
}