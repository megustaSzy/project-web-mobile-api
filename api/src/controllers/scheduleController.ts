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
            next(error);
        }
    },

    async getScheduleById(req: Request, res: Response, next: NextFunction) {
        try {
            const id = Number(req.params.id);

            const schedule = await scheduleService.getScheduleById(id);

            if(!schedule)

            return res.status(200).json({
                success: true,
                schedule
            })
        } catch (error) {
            next(error)
        }
    },

    // controller POST
    async createSchedule(req: Request, res: Response, next: NextFunction) {
        try {
            
            const schedule = await scheduleService.createSchedule(req.body);
    
            return res.status(201).json({
                success: true,
                message: "schedule berhasil dibuat",
            });
        } catch (error) {
            next(error)
        }
    },

    async editScheduleById(req: Request, res: Response, next: NextFunction) {
        const id = Number(req.params.id);

        const schedule = await scheduleService.updateSchedule(id, req.body);

        return res.status(200).json({
            success: true,
            message: "schedule berhasil diubah",
            data: schedule
        })
    },

    async deleteScheduleById(req: Request, res: Response, next: NextFunction) {
        try {
            const id = Number(req.params.id);
    
            const schedule = await scheduleService.deleteSchedule(id);
    
            return res.status(200).json({
                success: true,
                message: "schedule berhasil dihapus"
            });
            
        } catch (error) {
            next(error);
        }
    },

    async searchSchedule(req: Request, res: Response, next: NextFunction) {
        try {
            const filters: any = req.query;

            const schedules = await scheduleService.searchSchedule(filters);

            return res.status(200).json({
                success: true,
                data: schedules,
            });
        } catch (error) {
            next(error);
        }
    }


}