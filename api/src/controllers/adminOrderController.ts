import { Request, Response } from "express";
import { adminOrderService } from "../services/adminOrderService"

export const adminOrderController = {

    async getAllOrders(req: Request, res: Response) {

        try {
            
            const orders = await adminOrderService.getAllOrders();

            return res.status(200).json({
                message: "berhasil mengamnil data orders",
                success: true,
                data: orders
            })

        } catch (error: any) {
            res.status(500).json({
                message: error.message
            })
        }

    }

}