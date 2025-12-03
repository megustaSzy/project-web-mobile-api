import PDFDocument from "pdfkit";
import QRCode from "qrcode";
import { Response } from "express";
import prisma from "../lib/prisma";
import { createError } from "../utilities/createError";

export const ticketService = {
  async generateTicketPDF(orderId: number, userId: number, res: Response) {
    const order = await prisma.tb_orders.findUnique({
      where: { id: orderId },
    });

    if (!order) throw createError("Order tidak ditemukan", 404);
    if (order.userId !== userId) throw createError("Akses ditolak", 403);

    // Generate QR
    const qrImage = await QRCode.toDataURL(order.ticketCode);

    // Buat PDF
    const doc = new PDFDocument({
      margin: 40,
      size: "A4",
    });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="ticket-${order.ticketCode}.pdf"`
    );

    doc.pipe(res);

    // Judul
    doc.fontSize(22).text("E-Ticket Wisata", { align: "center" });
    doc.moveDown();

    // Ticket Code
    doc.fontSize(14).text(`Ticket Code: ${order.ticketCode}`);
    doc.moveDown();

    // Info User
    doc.text(`Nama Pemesan: ${order.userName}`);
    doc.text(`No. Telepon: ${order.userPhone}`);
    doc.moveDown();

    // Info Wisata
    doc.text(`Destinasi: ${order.destinationName}`);
    doc.text(`Tanggal: ${order.date.toISOString().split("T")[0]}`);
    doc.text(`Waktu: ${order.time}`);
    doc.moveDown();

    // Info Order
    doc.text(`Jumlah Orang: ${order.quantity}`);
    doc.text(`Total Harga: Rp ${order.totalPrice.toLocaleString("id-ID")}`);
    doc.moveDown(2);

    // QR Code
    const qr = qrImage.replace(/^data:image\/png;base64,/, "");
    doc.image(Buffer.from(qr, "base64"), {
      fit: [150, 150],
      align: "center",
      valign: "center",
    });

    doc.end();
  },
};
