import { Request, Response } from "express";
import { adminOrderService } from "../services/adminOrderService";
import { ResponseData } from "../utilities/Response";

export const adminOrderController = {
  // GET all orders
  // Mengambil semua data orders
  async getAllOrders(req: Request, res: Response) {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;

      const orders = await adminOrderService.getAllOrders(page, limit);

      return ResponseData.ok(res, orders, "daftar order berhasil diambil");
    } catch (error) {
      return ResponseData.serverError(res, error);
    }
  },

  // GET order by ID
  // Mengambil detail order berdasarkan ID
  async getOrderById(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) return ResponseData.badRequest(res, "id tidak valid");

      const order = await adminOrderService.getOrderById(id);

      return ResponseData.ok(res, order, "detail order berhasil diambil");
    } catch (error) {
      return ResponseData.serverError(res, error);
    }
  },

  // DELETE order by ID
  // Menghapus order berdasarkan ID
  async deleteOrderById(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) return ResponseData.badRequest(res, "id tidak valid");

      const deleted = await adminOrderService.deleteById(id);

      return ResponseData.ok(res, deleted, "order berhasil dihapus");
    } catch (error) {
      return ResponseData.serverError(res, error);
    }
  },
};
