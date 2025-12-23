import { coreApi } from "../config/midtrans";
import { Request, Response } from "express";
import { ResponseData } from "../utilities/Response";
import { orderService } from "../services/orderService";
import { PaymentStatus, PaymentMethod } from "@prisma/client";
import { ticketService } from "../services/ticketService";
import { sendTicketEmail } from "../services/mailService";

export const paymentController = {
  async midtransNotification(req: Request, res: Response) {
    try {
      const core = coreApi as any;
      const status = await core.transaction.notification(req.body);

      // console.log("MIDTRANS STATUS:", status);

      const paymentOrderId = status.order_id; // ambil string utuh
      const transactionStatus = status.transaction_status;
      const transactionId = status.transaction_id;
      const paymentType = status.payment_type;

      let paymentStatus: PaymentStatus = PaymentStatus.pending;

      if (
        transactionStatus === "settlement" ||
        transactionStatus === "capture"
      ) {
        paymentStatus = PaymentStatus.paid;
      } else if (transactionStatus === "expire") {
        paymentStatus = PaymentStatus.expired;
      } else if (
        transactionStatus === "cancel" ||
        transactionStatus === "deny"
      ) {
        paymentStatus = PaymentStatus.failed;
      }

      const paymentMethod: PaymentMethod | undefined = [
        "gopay",
        "bank_transfer",
        "qris",
        "credit_card",
      ].includes(paymentType)
        ? (paymentType as PaymentMethod)
        : undefined;

      const order = await orderService.getOrderByPaymentOrderId(paymentOrderId);
      if (!order) {
        return ResponseData.badRequest(res, "Order tidak ditemukan");
      }

      if (paymentStatus === PaymentStatus.paid) {
        await orderService.updateOrderPaymentData(order.id, {
          transactionId,
          paymentMethod,
          paymentStatus,
          isPaid: true,
          paidAt: new Date(),
        });

        const pdfBuffer = await ticketService.generateTicketPDFBuffer(order.id);

        await sendTicketEmail(
          order.userEmail,
          order.userName,
          order.ticketCode,
          pdfBuffer
        )
      }

      return ResponseData.ok(res, {
        paymentOrderId,
        transactionStatus,
        paymentStatus,
      });
    } catch (error) {
      return ResponseData.serverError(res, error);
    }
  },
};
