import { Request, Response } from "express";
import { orderService } from "../services/orderService";
import { ResponseData } from "../utilities/Response";

export const orderController = {
  // POST /orders
  async createOrder(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id; // ambil dari middleware
      const { scheduleId, quantity } = req.body;

      if (!scheduleId || !quantity) {
        return ResponseData.badRequest(
          res,
          "scheduleId dan quantity wajib diisi"
        );
      }

      const order = await orderService.createOrder(
        userId,
        Number(scheduleId),
        Number(quantity)
      );

      return ResponseData.created(res, order, "order berhasil dibuat");
    } catch (error) {
      return ResponseData.serverError(res, error);
    }
  },

  // GET /orders/my
  async getMyOrders(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id;

      const orders = await orderService.getOrdersByUser(userId);

      return ResponseData.ok(res, orders, "data order berhasil diambil");
    } catch (error) {
      return ResponseData.serverError(res, error);
    }
  },

  async getOrderById(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) {
        return ResponseData.badRequest(res, "id tidak valid");
      }

      const userId = (req as any).user.id; // ambil dari middleware

      // Panggil service dengan userId untuk cek kepemilikan order
      const order = await orderService.getOrderById(id, userId);

      return ResponseData.ok(res, order, "data order berhasil diambil");
    } catch (error) {
      return ResponseData.serverError(res, error);
    }
  },

  async getTicketDetail(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      if(isNaN(id)) {
        return ResponseData.badRequest(res, "id tidak valid");
      }

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
        createdAt: order.createdAt
      };

      return ResponseData.ok(res, ticketData, "data tiket berhasil ditambah");

    } catch (error) {
      return ResponseData.serverError(res, error)
    }
  }
};
