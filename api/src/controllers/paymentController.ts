import { coreApi } from "../config/midtrans";
import { Request, Response } from "express";
import { ResponseData } from "../utilities/Response";

export const paymentController = {

    async midtransNotification (req: Request, res: Response) {
        try {

            const core = coreApi as any;
            const status = await core.transaction.notification(req.body);
            console.log("MIDTRANS STATUS:", status);


            const orderId = status.order_id;
            const transactionStatus = status.transaction_status;

            // TODO: update database berdasarkan orderId & transactionStatus

            return ResponseData.ok(res, {
                orderId,
                transactionStatus
            }, "Notifikasi berhasil diproses");

        } catch (error) {
            return ResponseData.serverError(res, error)
        }
    }

}
