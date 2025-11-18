import { Request, response, Response } from "express";
import { orderService } from "../services/orderService";

export const orderController =  {
  async createOrder(req: any, res: Response) {  // ← pakai any
    try {

      const userId = req.user.id; // langsung ambil dari middleware
      const { scheduleId, tickets } = req.body;

      if (!scheduleId || !tickets) {

        return res.status(400).json({
          message: "scheduleId dan tickets wajib diisi",
        });
      }

      const order = await orderService.createOrder(
        userId,
        Number(scheduleId),
        Number(tickets),
      );

      return res.status(201).json({
        message: "order berhasil dibuat",
        data: order,
      });
    } catch (err: any) {
      return res.status(500).json({
        message: "terjadi kesalahan",
        error: err.message,
      });
    }
  },

  async getMyOrders(req: any, res: Response) {
    try {
        
        const userId = req.user.id;

        const orders = await orderService.getOrdersByUser(userId);

        return res.status(200).json({
            message: "berhasil mengambil riwayat order",
            success: true,
            data: orders
        });
    } catch (error: any) {
        res.status(500).json({
            message: "gagal mengambil data order",
            error: error.message
        })
    }
  }
}