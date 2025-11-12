import { NextFunction, Request, Response } from "express"
import { destinationService } from "../services/destinationService";


export const destinationController = {
    async getDestination(req: Request, res: Response, next: NextFunction) {
        try {
            const destination = await destinationService.getAllDestinations();
            return res.status(200).json({
                message: true,
                destination,
            })

        } catch (error) {
            next(error);
        }
    }
}