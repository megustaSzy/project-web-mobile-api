// import { coreApi } from "../config/midtrans";
// import { Request, Response } from "express";
// import { ResponseData } from "../utilities/Response";
// import { orderService } from "../services/orderService";

// type PaymentStatusType = "pending" | "paid" | "failed" | "expired";
// type PaymentMethodType =
//   | "gopay"
//   | "bank_transfer"
//   | "qris"
//   | "credit_card"
//   | null;

// export const paymentController = {
//   async midtransNotification(req: Request, res: Response) {
//     try {
//       const core = coreApi as any;
//       const status = await core.transaction.notification(req.body);

//       console.log("MIDTRANS STATUS:", status);

//       const orderIdRaw = status.order_id; // contoh: "ORDER-123"
//       const transactionStatus = status.transaction_status;
//       const transactionId = status.transaction_id;
//       const paymentType = status.payment_type;

//       const orderId = Number(orderIdRaw.replace("ORDER-", ""));
//       if (isNaN(orderId)) throw new Error("order_id tidak valid");

//       // Convert status Midtrans ke enum
//       let paymentStatus: PaymentStatusType = "pending";
//       if (
//         transactionStatus === "settlement" ||
//         transactionStatus === "capture"
//       ) {
//         paymentStatus = "paid";
//       } else if (transactionStatus === "expire") {
//         paymentStatus = "expired";
//       } else if (transactionStatus === "cancel") {
//         paymentStatus = "failed";
//       }

//       const paymentMethod: PaymentMethodType = [
//         "gopay",
//         "bank_transfer",
//         "qris",
//         "credit_card",
//       ].includes(paymentType)
//         ? (paymentType as PaymentMethodType)
//         : null;

//       await orderService.updateOrderPaymentData(orderId, {
//         transactionId,
//         paymentMethod,
//         paymentStatus,
//         isPaid: paymentStatus === "paid",
//         paidAt: paymentStatus === "paid" ? new Date() : undefined,
//       });

//       return ResponseData.ok(
//         res,
//         { orderId, transactionStatus, paymentStatus },
//         "Notifikasi berhasil diproses"
//       );
//     } catch (error) {
//       return ResponseData.serverError(res, error);
//     }
//   },
// };

import { Request, Response } from "express";
import { ResponseData } from "../utilities/Response";
import { orderService } from "../services/orderService";

type PaymentStatusType = "pending" | "paid" | "failed" | "expired";
type PaymentMethodType =
  | "gopay"
  | "bank_transfer"
  | "qris"
  | "credit_card"
  | null;

export const paymentController = {
  // Untuk backend testing Postman, langsung proses payload
  async midtransNotification(req: Request, res: Response) {
    try {
      const { order_id, transaction_status, transaction_id, payment_type } = req.body;

      // Extract numeric ID dari "ORDER-123"
      const orderId = Number(order_id.replace("ORDER-", ""));
      if (isNaN(orderId)) throw new Error("order_id tidak valid");

      // Convert status Midtrans ke enum
      let paymentStatus: PaymentStatusType = "pending";
      if (transaction_status === "settlement" || transaction_status === "capture") {
        paymentStatus = "paid";
      } else if (transaction_status === "expire") {
        paymentStatus = "expired";
      } else if (transaction_status === "cancel") {
        paymentStatus = "failed";
      }

      const paymentMethod: PaymentMethodType = ["gopay", "bank_transfer", "qris", "credit_card"].includes(payment_type)
        ? (payment_type as PaymentMethodType)
        : null;

      // Update order di DB
      await orderService.updateOrderPaymentData(orderId, {
        transactionId: transaction_id,
        paymentMethod,
        paymentStatus,
        isPaid: paymentStatus === "paid",
        paidAt: paymentStatus === "paid" ? new Date() : undefined,
      });

      return ResponseData.ok(
        res,
        { orderId, transactionStatus: transaction_status, paymentStatus },
        "Notifikasi berhasil diproses"
      );
    } catch (error) {
      return ResponseData.serverError(res, error);
    }
  },
};

