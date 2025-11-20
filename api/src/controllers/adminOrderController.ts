import { Request, Response } from "express";
import { adminOrderService } from "../services/adminOrderService";

export const adminOrderController = {

  // GET all orders
  // Mengambil semua data orders
  async getAllOrders(req: Request, res: Response) {
    try {
      const orders = await adminOrderService.getAllOrders();

      return res.status(200).json({
        success: true,
        message: "Berhasil mengambil data orders",
        data: orders,
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  },

  // GET order by ID
  // Mengambil detail order berdasarkan ID
  async getOrderById(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({
          success: false,
          message: "ID tidak valid",
        });
      }

      const order = await adminOrderService.getOrderById(id);

      if (!order) {
        return res.status(404).json({
          success: false,
          message: "Order tidak ditemukan",
        });
      }

      return res.status(200).json({
        success: true,
        message: "Detail order",
        data: order,
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  },

  // DELETE order by ID
  // Menghapus order berdasarkan ID
  async deleteOrderById(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({
          success: false,
          message: "ID tidak valid",
        });
      }

      const deleted = await adminOrderService.deleteById(id);

      if (!deleted) {
        return res.status(404).json({
          success: false,
          message: "Order tidak ditemukan",
        });
      }

      return res.status(200).json({
        success: true,
        message: "Order berhasil dihapus",
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  },
};
