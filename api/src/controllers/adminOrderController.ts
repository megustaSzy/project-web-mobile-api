import { Request, Response } from "express";
import { adminOrderService } from "../services/adminOrderService";
import { ResponseData } from "../utilities/Response";

export const adminOrderController = {
  async createOrder(req: Request, res: Response) {
    try {
      const order = await adminOrderService.createOrder(req.body);
      return ResponseData.created(res, order);
    } catch (error) {
      return ResponseData.serverError(res, error);
    }
  },

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
