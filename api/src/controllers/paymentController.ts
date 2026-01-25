import { coreApi } from "../config/midtrans";
import { NextFunction, Request, Response } from "express";
import { ResponseData } from "../utilities/Response";
import { orderService } from "../services/orderService";
import { PaymentStatus, PaymentMethod } from "@prisma/client";
import { ticketService } from "../services/ticketService";
import { sendTicketEmail } from "../services/mailService";

export const paymentController = {
  // async midtransNotification(req: Request, res: Response, next: NextFunction) {
  //   try {
  //     const core = coreApi as any;
  //     const status = await core.transaction.notification(req.body);

  //     const paymentOrderId = status.order_id; // ambil string utuh
  //     const transactionStatus = status.transaction_status;
  //     const transactionId = status.transaction_id;
  //     const paymentType = status.payment_type;

  //     let paymentStatus: PaymentStatus = PaymentStatus.pending;

  //     if (
  //       transactionStatus === "settlement" ||
  //       transactionStatus === "capture"
  //     ) {
  //       paymentStatus = PaymentStatus.paid;
  //     } else if (transactionStatus === "expire") {
  //       paymentStatus = PaymentStatus.expired;
  //     } else if (
  //       transactionStatus === "cancel" ||
  //       transactionStatus === "deny"
  //     ) {
  //       paymentStatus = PaymentStatus.failed;
  //     }

  //     const paymentMethod: PaymentMethod | undefined = [
  //       "gopay",
  //       "bank_transfer",
  //       "qris",
  //       "credit_card",
  //     ].includes(paymentType)
  //       ? (paymentType as PaymentMethod)
  //       : undefined;

  //     const order = await orderService.getOrderByPaymentOrderId(paymentOrderId);
  //     if (!order) {
  //       return ResponseData.badRequest(res, "Order tidak ditemukan");
  //     }

  //     if (paymentStatus === PaymentStatus.paid) {
  //       await orderService.updateOrderPaymentData(order.id, {
  //         transactionId,
  //         paymentMethod,
  //         paymentStatus,
  //         isPaid: true,
  //         paidAt: new Date(),
  //       });

  //       const pdfBuffer = await ticketService.generateTicketPDFBuffer(order.id);

  //       await sendTicketEmail(
  //         order.userEmail,
  //         order.userName,
  //         order.ticketCode,
  //         pdfBuffer
  //       );
  //     }

  //     return ResponseData.ok(res, {
  //       paymentOrderId,
  //       transactionStatus,
  //       paymentStatus,
  //     });
  //   } catch (error) {
  //     next(error);
  //   }
  // },
  async midtransNotification(req: Request, res: Response, next: NextFunction) {
    try {
      const core = coreApi as any;
      const status = await core.transaction.notification(req.body);

      const {
        order_id: paymentOrderId,
        transaction_status,
        transaction_id,
        payment_type,
      } = status;

      let paymentStatus: PaymentStatus = PaymentStatus.pending;

      if (["settlement", "capture"].includes(transaction_status)) {
        paymentStatus = PaymentStatus.paid;
      } else if (transaction_status === "expire") {
        paymentStatus = PaymentStatus.expired;
      } else if (["cancel", "deny"].includes(transaction_status)) {
        paymentStatus = PaymentStatus.failed;
      }

      const order = await orderService.getOrderByPaymentOrderId(paymentOrderId);
      if (!order) {
        return ResponseData.badRequest(res, "Order tidak ditemukan");
      }

      if (order.isPaid) {
        return ResponseData.ok(res, "Already processed");
      }

      const allowedMethods = ["gopay", "bank_transfer", "qris", "credit_card"];

      const paymentMethod = allowedMethods.includes(payment_type)
        ? (payment_type as PaymentMethod)
        : undefined;

      if (paymentStatus !== PaymentStatus.pending) {
        await orderService.updateOrderPaymentData(order.id, {
          transactionId: transaction_id,
          paymentMethod,
          paymentStatus,
          isPaid: paymentStatus === PaymentStatus.paid,
          paidAt: paymentStatus === PaymentStatus.paid ? new Date() : undefined,
        });
      }

      if (paymentStatus === PaymentStatus.paid) {
        const pdf = await ticketService.generateTicketPDFBuffer(order.id);
        await sendTicketEmail(
          order.userEmail,
          order.userName,
          order.ticketCode,
          pdf,
        );
      }

      return ResponseData.ok(res, "OK");
    } catch (error) {
      next(error);
    }
  },
};
