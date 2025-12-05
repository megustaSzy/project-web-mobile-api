import { snap } from "../config/midtrans";

export const paymentService = {

    async createTransaction (order: any) {
        const params = {
            transaction_details: {
                order_id: "ORDER-" + Date.now(),
                gross_amount: order.total,
            },

            customer_details: {
                first_name: order.user.name,
                email: order.user.email
            },
        };

        const transaction = await snap.createTransaction(params);
        return transaction
    }

}