import { Request, Response } from "express";
import { adminOrderService } from "../services/adminOrderService"
import { orderService } from "../services/orderService";

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
                message: error.message,
                success: false
            })
        }

    },

    async getOrderById(req: Request, res: Response) {
        try {
            const id = Number(req.params.id);
            const order = await adminOrderService.getOrderById(id);
    
            res.status(200).json({
                message: "detail order",
                success: true,
                data: order
            });
        } catch (error: any) {
            res.status(404).json({
                message: error.message,
                success: false
            })
        }
    },

    async deleteOrderById(req: Request, res: Response) {
        try {
            
            const id = Number(req.params.id);
            const order = await adminOrderService.deleteById(id);

            res.status(200).json({
                message: "order berhasil dihapus",
                success: true
            })

        } catch (error: any) {
            res.status(404).json({
                message: error.message,
                success: false
            })
        }
    }

}