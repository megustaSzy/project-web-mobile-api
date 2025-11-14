import { Request, Response, NextFunction } from "express";
import { scheduleService } from "../services/scheduleService"


export const scheduleController = {

    async getAllSchedules(req: Request, res: Response, next: NextFunction) {
        try {
            
            const schedule = await scheduleService.getAllSchedules();

            return res.status(200).json({
                success: true,
                data: schedule
            })

        } catch (error) {
            next: error
        }
    }

}