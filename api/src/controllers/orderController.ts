import { Request, Response } from "express";
import { orderService } from "../services/orderService";

export const orderController = {

  // POST /orders
  // Membuat order baru untuk user yang login
  async createOrder(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id; // ambil dari middleware
      const { scheduleId, tickets } = req.body;

      if (!scheduleId || !tickets) {
        return res.status(400).json({
          success: false,
          message: "scheduleId dan tickets wajib diisi",
        });
      }

      const order = await orderService.createOrder(
        userId,
        Number(scheduleId),
        Number(tickets)
      );

      return res.status(201).json({
        success: true,
        message: "Order berhasil dibuat",
        data: order,
      });

    } catch (err: any) {
      return res.status(500).json({
        success: false,
        message: "Terjadi kesalahan",
        error: err.message,
      });
    }
  },

  // GET /orders/my
  // Mengambil riwayat order milik user yang login
  async getMyOrders(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id;

      const orders = await orderService.getOrdersByUser(userId);

      return res.status(200).json({
        success: true,
        message: "Berhasil mengambil riwayat order",
        data: orders,
      });

    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: "Gagal mengambil data order",
        error: error.message,
      });
    }
  },

};
