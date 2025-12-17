import { Request, Response } from "express";
import { orderService } from "../services/orderService";
import { ResponseData } from "../utilities/Response";
import { ticketService } from "../services/ticketService";

export const orderController = {
  async createOrder(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id;

      const order = await orderService.createOrder({
        userId,
        ...req.body,
      });

      return ResponseData.created(res, order);
    } catch (error) {
      return ResponseData.serverError(res, error);
    }
  },

  async getMyOrders(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id;
      const orders = await orderService.getOrdersByUser(userId);
      return ResponseData.ok(res, orders);
    } catch (error) {
      return ResponseData.serverError(res, error);
    }
  },

  async getOrderById(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) return ResponseData.badRequest(res, "id tidak valid");

      const userId = (req as any).user.id;

      const order = await orderService.getOrderById(id, userId);
      return ResponseData.ok(res, order);
    } catch (error) {
      return ResponseData.serverError(res, error);
    }
  },

  async getTicketDetail(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) return ResponseData.badRequest(res, "id tidak valid");

      const userId = (req as any).user.id;

      const order = await orderService.getOrderById(id, userId);

      const ticketData = {
        ticketCode: order.ticketCode,
        isPaid: order.isPaid,
        userName: order.userName,
        userPhone: order.userPhone,
        destinationName: order.destinationName,
        destinationPrice: order.destinationPrice,
        quantity: order.quantity,
        totalPrice: order.totalPrice,
        date: order.date,
        time: order.time,
        createdAt: order.createdAt,
      };

      return ResponseData.ok(res, ticketData);
    } catch (error) {
      return ResponseData.serverError(res, error);
    }
  },

  async getTicketPDF(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const userId = (req as any).user.id;

      await ticketService.generateTicketPDF(id, userId, res);
      // (Tidak perlu return ResponseData karena PDF langsung dikirim)
    } catch (error) {
      return ResponseData.serverError(res, error);
    }
  },
};
