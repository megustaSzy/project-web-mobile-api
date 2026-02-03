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
    const HEIGHT = 480; // FIX: cukup untuk 1 halaman

    return new Promise((resolve, reject) => {
      const doc = new PDFDocument({
        size: [WIDTH, HEIGHT],
        margin: 0,
      });

      const buffers: Buffer[] = [];
      doc.on("data", (b) => buffers.push(b));
      doc.on("end", () => resolve(Buffer.concat(buffers)));
      doc.on("error", reject);

      /* ===== COLOR THEME ===== */
      const navy = "#0f172a";
      const navySoft = "#1e293b";
      const blue = "#2563eb";
      const gray = "#64748b";
      const light = "#e5e7eb";

      /* ===== HEADER ===== */
      doc.rect(0, 0, WIDTH, 80).fill(navy);
      doc
        .fillColor("white")
        .font("Helvetica-Bold")
        .fontSize(24)
        .text("E - TICKET", 30, 28);

      doc
        .fontSize(12)
        .font("Helvetica")
        .fillColor("#c7d2fe")
        .text("Tiket Pass", WIDTH - 160, 32);

      /* ===== HELPERS ===== */
      const label = (text: string, x: number, y: number) =>
        doc.font("Helvetica").fontSize(10).fillColor(gray).text(text, x, y);

      const value = (text: string, x: number, y: number, size = 14) =>
        doc
          .font("Helvetica-Bold")
          .fontSize(size)
          .fillColor(navySoft)
          .text(text, x, y);

      /* ===== LEFT CONTENT ===== */
      const leftX = 30;
      let y = 100;

      label("Nama Pemesan", leftX, y);
      value(order.userName, leftX, y + 14, 16);

      y += 40;
      label("Email", leftX, y);
      value(order.userEmail, leftX, y + 14);

      y += 36;
      label("No. Telepon", leftX, y);
      value(order.userPhone, leftX, y + 14);

      y += 36;
      label("Destinasi", leftX, y);
      value(order.destinationName, leftX, y + 14, 16);

      y += 44;
      label("Tanggal Perjalanan", leftX, y);
      value(formatDate(order.date), leftX, y + 14);

      y += 36;
      label("Jam Berangkat", leftX, y);
      value(order.departureTime, leftX, y + 14);

      y += 36;
      label("Jam Pulang", leftX, y);
      value(order.returnTime ?? "-", leftX, y + 14);

      y += 36;
      label("Jumlah Tiket", leftX, y);
      value(`${order.quantity} Orang`, leftX, y + 14);

      /* ===== RIGHT CARD ===== */
      const rightX = 520;

      doc
        .roundedRect(rightX - 20, 100, 360, 300, 14)
        .fill("#f8fafc")
        .strokeColor(light)
        .lineWidth(1)
        .stroke();

      label("Kode Tiket", rightX, 120);

      doc
        .font("Helvetica-Bold")
        .fontSize(20)
        .fillColor(blue)
        .text(order.ticketCode, rightX, 138, {
          width: 200, // ⬅️ batasi lebar teks
          ellipsis: true, // ⬅️ kalau kepanjangan, jadi ...
        });

      doc.image(Buffer.from(qrBase64, "base64"), rightX + 230, 140, {
        width: 110,
        height: 110,
      });

      label("Total Pembayaran", rightX, 280);
      doc
        .font("Helvetica-Bold")
        .fontSize(18)
        .fillColor(navy)
        .text(formatRupiah(order.totalPrice), rightX, 298);

      /* ===== FOOTER ===== */
      doc
        .font("Helvetica")
        .fontSize(9)
        .fillColor(gray)
        .text(
          "Tunjukkan e-ticket ini saat check-in. QR Code hanya berlaku 1 kali.",
          30,
          HEIGHT - 40,
        );

      doc.end();
    });
  },
};
