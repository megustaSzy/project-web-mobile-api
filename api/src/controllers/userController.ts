import { userService } from "../services/userService"
import { Request, Response } from "express";
import { createError } from "../utils/createError";

export const getAllUsers = {
    
    async getAllUsers(req: Request, res: Response) {
        const user = await userService.getAllUsers();

        return res.status(200).json({
            message: true,
            user
        });
    },

    async getUserById(req: Request, res: Response) {
        const id = Number(req.params.id);

        if(isNaN(id)) createError("id tidak valid", 400);

        const user = await userService.getUserById(id);

        if(!user) createError("user tidak ditemukan", 404);

        return res.status(200).json({
            success: true,
            user
        })
    }
}