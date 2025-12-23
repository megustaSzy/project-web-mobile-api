import { Request, Response } from "express";
import { orderService } from "../services/orderService";
import { ResponseData } from "../utilities/Response";
import { ticketService } from "../services/ticketService";
import { paymentService } from "../services/paymentService";

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
      if (isNaN(id)) {
        return ResponseData.badRequest(res, "id tidak valid");
      }

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
      if (isNaN(id)) {
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
        departureTime: order.departureTime,
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
      if (isNaN(id)) {
        return ResponseData.badRequest(res, "id tidak valid");
      }

      const userId = (req as any).user.id;
      const order = await orderService.getOrderById(id, userId);

      if (!order.isPaid) {
        return ResponseData.badRequest(res, "tiket belum dibayar");
      }

      const pdfBuffer = await ticketService.generateTicketPDFBuffer(id);

      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="ticket-${order.ticketCode}.pdf"`
      );

      return res.send(pdfBuffer);
    } catch (error) {
      return ResponseData.serverError(res, error);
    }
  },
  async payOrder(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) {
        return ResponseData.badRequest(res, "id tidak valid");
      }

      const userId = (req as any).user.id;
      const order = await orderService.getOrderById(id, userId);

      if (order.isPaid) {
        return ResponseData.badRequest(res, "order sudah dibayar");
      }

      if (order.paymentStatus === "expired") {
        return ResponseData.badRequest(res, "order sudah kedaluwarsa");
      }

      if (order.snapToken) {
        return ResponseData.ok(res, {
          snapToken: order.snapToken,
          redirectUrl: order.snapRedirectUrl,
        });
      }

      const payment = await paymentService.createTransaction(order);
      return ResponseData.ok(res, payment);
    } catch (error) {
      return ResponseData.serverError(res, error);
    }
  },
};
