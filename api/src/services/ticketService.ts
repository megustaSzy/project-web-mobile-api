import PDFDocument from "pdfkit";
import QRCode from "qrcode";
import prisma from "../lib/prisma";
import { createError } from "../utilities/createError";

const formatRupiah = (value: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);

const formatDate = (date: Date) =>
  new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(date);

export const ticketService = {
  async generateTicketPDFBuffer(orderId: number): Promise<Buffer> {
    const order = await prisma.tb_orders.findUnique({
      where: { id: orderId },
    });

    if (!order) throw createError("Order tidak ditemukan", 404);
    if (!order.isPaid) throw createError("Order belum dibayar", 400);

    const qrDataUrl = await QRCode.toDataURL(order.ticketCode);
    const qrBase64 = qrDataUrl.replace(/^data:image\/png;base64,/, "");

    const WIDTH = 900;
    const HEIGHT = 420;

    return new Promise((resolve, reject) => {
      const doc = new PDFDocument({ size: [WIDTH, HEIGHT], margin: 0 });
      const buffers: Buffer[] = [];

      doc.on("data", (chunk) => buffers.push(chunk));
      doc.on("end", () => resolve(Buffer.concat(buffers)));
      doc.on("error", reject);

      const orange = "#f97316";
      const dark = "#111827";
      const gray = "#6b7280";

      /* ===== HEADER ===== */
      doc.rect(0, 0, WIDTH, 90).fill(orange);
      doc
        .fillColor("white")
        .font("Helvetica-Bold")
        .fontSize(26)
        .text("BOARDING PASS", 30, 30);

      /* ===== LEFT CONTENT ===== */
      const leftX = 30;
      let y = 110;

      const label = (text: string, x: number, y: number) =>
        doc.font("Helvetica").fontSize(11).fillColor(gray).text(text, x, y);

      const value = (text: string, x: number, y: number, size = 14) =>
        doc
          .font("Helvetica-Bold")
          .fontSize(size)
          .fillColor(dark)
          .text(text, x, y);

      label("Nama Penumpang", leftX, y);
      value(order.userName, leftX, y + 14, 16);

      y += 45;
      label("Email", leftX, y);
      value(order.userEmail, leftX, y + 14);

      y += 40;
      label("No. Telepon", leftX, y);
      value(order.userPhone, leftX, y + 14);

      y += 40;
      label("Destinasi", leftX, y);
      value(order.destinationName, leftX, y + 14, 16);

      y += 50;
      label("Tanggal Perjalanan", leftX, y);
      value(formatDate(order.date), leftX, y + 14);

      y += 40;
      label("Jam Berangkat", leftX, y);
      value(order.departureTime, leftX, y + 14);

      y += 40;
      label("Jam Pulang", leftX, y);
      value(order.returnTime ?? "-", leftX, y + 14);

      y += 40;
      label("Jumlah Tiket", leftX, y);
      value(`${order.quantity} Orang`, leftX, y + 14);

      /* ===== RIGHT CARD ===== */
      const rightX = 520;

      doc
        .roundedRect(rightX - 20, 110, 360, 260, 12)
        .strokeColor("#e5e7eb")
        .lineWidth(1)
        .stroke();

      label("Kode Tiket", rightX, 130);
      doc
        .font("Helvetica-Bold")
        .fontSize(22)
        .fillColor(orange)
        .text(order.ticketCode, rightX, 150);

      doc.image(Buffer.from(qrBase64, "base64"), rightX + 200, 150, {
        width: 120,
        height: 120,
      });

      label("Total Pembayaran", rightX, 300);
      doc
        .font("Helvetica-Bold")
        .fontSize(18)
        .fillColor(dark)
        .text(formatRupiah(order.totalPrice), rightX, 320);

      doc.end();
    });
  },
};
