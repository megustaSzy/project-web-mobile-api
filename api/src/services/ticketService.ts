import PDFDocument from "pdfkit";
import QRCode from "qrcode";
import prisma from "../lib/prisma";
import { createError } from "../utilities/createError";

export const ticketService = {
  async generateTicketPDFBuffer(orderId: number) {
    const order = await prisma.tb_orders.findUnique({
      where: { id: orderId },
    });

    if (!order) throw createError("Order tidak ditemukan", 404);
    if (!order.isPaid) throw createError("Order belum dibayar", 400);

    const qrDataUrl = await QRCode.toDataURL(order.ticketCode);
    const qrBase64 = qrDataUrl.replace(/^data:image\/png;base64,/, "");

    const WIDTH = 900;
    const HEIGHT = 350;

    const doc = new PDFDocument({ size: [WIDTH, HEIGHT], margin: 0 });

    const buffers: Buffer[] = [];
    doc.on("data", buffers.push.bind(buffers));

    doc.on("end", () => {});

    // === DESIGN (SAMA DENGAN PUNYA KAMU) ===
    const orange = "#f97316";
    const dark = "#111827";
    const gray = "#4b5563";

    doc.rect(0, 0, WIDTH, 80).fill(orange);
    doc
      .fillColor("white")
      .font("Helvetica-Bold")
      .fontSize(26)
      .text("BOARDING PASS", 30, 25);

    doc
      .moveTo(0, 80)
      .lineTo(WIDTH, 80)
      .strokeColor("#ffffff")
      .lineWidth(1)
      .stroke();

    const leftX = 30;
    let y = 100;

    doc.fontSize(12).fillColor(gray).text("Nama", leftX, y);
    doc
      .font("Helvetica-Bold")
      .fontSize(16)
      .fillColor(dark)
      .text(order.userName, leftX, y + 15);

    y += 55;

    doc
      .font("Helvetica")
      .fontSize(12)
      .fillColor(gray)
      .text("Destinasi", leftX, y);
    doc
      .font("Helvetica-Bold")
      .fontSize(18)
      .fillColor(dark)
      .text(order.destinationName, leftX, y + 15, { width: 380 });

    const rightX = 520;

    doc
      .rect(rightX - 20, 100, 360, 230)
      .strokeColor("#e5e7eb")
      .lineWidth(1)
      .stroke();

    doc
      .font("Helvetica")
      .fontSize(12)
      .fillColor(gray)
      .text("Kode Tiket", rightX, 120);
    doc
      .font("Helvetica-Bold")
      .fontSize(22)
      .fillColor(orange)
      .text(order.ticketCode, rightX, 140);

    doc.image(Buffer.from(qrBase64, "base64"), rightX + 200, 140, {
      width: 130,
      height: 130,
    });

    doc.end();

    return Buffer.concat(buffers);
  },
};
