import { Response } from "express";
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
        message: "Order berhasil dibuat",
        data: order,
      });
    } catch (err: any) {
      return res.status(500).json({
        message: "Terjadi kesalahan",
        error: err.message,
      });
    }
  }
}