import { snap } from "../config/midtrans";
import { orderService } from "./orderService";
import { PaymentStatus } from "@prisma/client";
import { tb_orders } from "@prisma/client";

export const paymentService = {
  async createTransaction(order: tb_orders) {
    const params = {
      transaction_details: {
        order_id: order.paymentOrderId,
        gross_amount: order.totalPrice,
      },
      customer_details: {
        first_name: order.userName,
        email: order.userEmail,
        phone: order.userPhone,
      },
      enabled_payments: ["gopay", "bank_transfer", "qris", "credit_card"],
    };

    const transaction = await snap.createTransaction(params);

    await orderService.updateOrderPaymentData(order.id, {
      snapToken: transaction.token,
      snapRedirectUrl: transaction.redirect_url,
      paymentStatus: PaymentStatus.pending,
    });

    return {
      snapToken: transaction.token,
      redirectUrl: transaction.redirect_url,
    };
  },
};
