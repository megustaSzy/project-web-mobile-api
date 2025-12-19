import { snap } from "../config/midtrans";
import { orderService } from "./orderService";

export const paymentService = {
  async createTransaction(order: {
    id: number;
    paymentOrderId: string;
    totalPrice: number;
    userName: string;
    userEmail: string;
  }) {
    const params = {
      transaction_details: {
        order_id: order.paymentOrderId, 
        gross_amount: order.totalPrice,
      },
      customer_details: {
        first_name: order.userName,
        email: order.userEmail,
      },
      enabled_payments: ["gopay", "bank_transfer", "qris", "credit_card"],
    };

    const transaction = await snap.createTransaction(params);

    await orderService.updateOrderPaymentData(order.id, {
      snapToken: transaction.token,
      snapRedirectUrl: transaction.redirect_url,
    });

    return {
      snapToken: transaction.token,
      redirectUrl: transaction.redirect_url,
    };
  },
};
