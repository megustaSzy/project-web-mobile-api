export type Ticket = {
  id: number;
  ticketCode: string;
  destinationName: string;
  date: string;
  departureTime: string;
  returnTime: string;
  quantity: number;
  totalPrice: number;
  paymentStatus: "paid" | "pending" | "failed" | "expired";
  isPaid: boolean;
};
