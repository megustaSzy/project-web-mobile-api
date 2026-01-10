"use client";

import type { AdminOrderItem } from "@/types/admin/admin-orders";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Ticket,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Clock,
  Users,
  Banknote,
  CreditCard,
} from "lucide-react";

type Props = {
  orders: AdminOrderItem[];
};

export default function OrdersTable({ orders }: Props) {
  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <p className="text-gray-500 text-sm">Tidak ada pesanan</p>
      </div>
    );
  }

  const getPaymentStatusBadge = (status: string, isPaid: boolean) => {
    if (isPaid || status === "paid") {
      return (
        <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
          Lunas
        </Badge>
      );
    }

    const statusMap = {
      pending: {
        label: "Pending",
        className: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100",
      },
      failed: {
        label: "Gagal",
        className: "bg-red-100 text-red-800 hover:bg-red-100",
      },
      expired: {
        label: "Kadaluarsa",
        className: "bg-gray-100 text-gray-800 hover:bg-gray-100",
      },
    };

    const config =
      statusMap[status as keyof typeof statusMap] || statusMap.pending;

    return <Badge className={config.className}>{config.label}</Badge>;
  };

  const getPaymentMethodLabel = (method: string) => {
    const methodMap = {
      qris: "QRIS",
      bank_transfer: "Transfer Bank",
      gopay: "GoPay",
      credit_card: "Kartu Kredit",
    };
    return methodMap[method as keyof typeof methodMap] || method;
  };

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50 hover:bg-gray-50">
            <TableHead className="w-16 text-center font-semibold">No</TableHead>
            <TableHead className="text-left font-semibold">Ticket</TableHead>
            <TableHead className="text-left font-semibold">Email</TableHead>
            <TableHead className="text-left font-semibold">No HP</TableHead>
            <TableHead className="text-left font-semibold">Tujuan</TableHead>
            <TableHead className="text-left font-semibold">Pickup</TableHead>
            <TableHead className="text-left font-semibold">Tanggal</TableHead>
            <TableHead className="text-left font-semibold">Jam</TableHead>
            <TableHead className="w-20 text-center font-semibold">
              Qty
            </TableHead>
            <TableHead className="text-right font-semibold">Total</TableHead>
            <TableHead className="text-left font-semibold">Metode</TableHead>
            <TableHead className="w-32 text-center font-semibold">
              Status
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {orders.map((o, index) => (
            <TableRow
              key={o.id}
              className="hover:bg-gray-50/50 transition-colors"
            >
              <TableCell className="text-center">
                <Badge variant="outline" className="font-normal">
                  {index + 1}
                </Badge>
              </TableCell>

              <TableCell className="font-medium text-gray-900">
                <div className="flex items-center gap-2">
                  <Ticket className="h-3.5 w-3.5 text-blue-600 flex-shrink-0" />
                  {o.ticketCode}
                </div>
              </TableCell>

              <TableCell className="text-gray-600">
                <div className="flex items-center gap-2 max-w-xs">
                  <Mail className="h-3.5 w-3.5 text-gray-400 flex-shrink-0" />
                  <span className="truncate" title={o.userEmail}>
                    {o.userEmail}
                  </span>
                </div>
              </TableCell>

              <TableCell className="text-gray-600">
                <div className="flex items-center gap-2">
                  <Phone className="h-3.5 w-3.5 text-gray-400 flex-shrink-0" />
                  {o.userPhone}
                </div>
              </TableCell>

              <TableCell className="font-medium text-gray-900">
                <div className="flex items-center gap-2">
                  <MapPin className="h-3.5 w-3.5 text-red-600 flex-shrink-0" />
                  {o.destinationName}
                </div>
              </TableCell>

              <TableCell className="text-gray-600">
                <div className="flex items-center gap-2">
                  <MapPin className="h-3.5 w-3.5 text-gray-400 flex-shrink-0" />
                  {o.pickupLocationName}
                </div>
              </TableCell>

              <TableCell className="text-gray-600">
                <div className="flex items-center gap-2">
                  <Calendar className="h-3.5 w-3.5 text-gray-400 flex-shrink-0" />
                  {new Date(o.date).toLocaleDateString("id-ID")}
                </div>
              </TableCell>

              <TableCell className="text-gray-600">
                <div className="flex items-center gap-2">
                  <Clock className="h-3.5 w-3.5 text-gray-400 flex-shrink-0" />
                  <span className="whitespace-nowrap">
                    {o.departureTime} - {o.returnTime}
                  </span>
                </div>
              </TableCell>

              <TableCell className="text-center">
                <Badge variant="secondary" className="gap-1">
                  <Users className="h-3 w-3" />
                  {o.quantity}
                </Badge>
              </TableCell>

              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-1.5">
                  <Banknote className="h-3.5 w-3.5 text-green-600" />
                  <span className="font-medium text-gray-900">
                    Rp {o.totalPrice.toLocaleString("id-ID")}
                  </span>
                </div>
              </TableCell>

              <TableCell className="text-gray-600">
                <div className="flex items-center gap-2">
                  <CreditCard className="h-3.5 w-3.5 text-gray-400 flex-shrink-0" />
                  {getPaymentMethodLabel(o.paymentMethod)}
                </div>
              </TableCell>

              <TableCell className="text-center">
                {getPaymentStatusBadge(o.paymentStatus, o.isPaid)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
