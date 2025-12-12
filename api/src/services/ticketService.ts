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

    // QR Code
    const qrDataUrl = await QRCode.toDataURL(order.ticketCode);
    const qrBase64 = qrDataUrl.replace(/^data:image\/png;base64,/, "");

    // Custom ticket size (mirip tiket KAI)
    const WIDTH = 900;
    const HEIGHT = 350;

    const doc = new PDFDocument({
      size: [WIDTH, HEIGHT],
      margin: 0,
    });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="ticket-${order.ticketCode}.pdf"`
    );

    doc.pipe(res);

    // Colors
    const orange = "#f97316";
    const dark = "#111827";
    const gray = "#4b5563";

    // ================================
    // HEADER ORANGE (seperti KAI)
    // ================================
    doc.rect(0, 0, WIDTH, 80).fill(orange);

    doc
      .fillColor("white")
      .font("Helvetica-Bold")
      .fontSize(26)
      .text("BOARDING PASS", 30, 25);

    // Garis putih tipis
    doc
      .moveTo(0, 80)
      .lineTo(WIDTH, 80)
      .strokeColor("#ffffff")
      .lineWidth(1)
      .stroke();

    // ================================
    // KIRI — INFORMASI UTAMA
    // ================================
    const leftX = 30;
    let y = 100;

    doc
      .fontSize(12)
      .fillColor(gray)
      .font("Helvetica")
      .text("Nama / Name", leftX, y);
    doc
      .font("Helvetica-Bold")
      .fillColor(dark)
      .fontSize(16)
      .text(order.userName, leftX, y + 15);

    y += 55;

    doc
      .font("Helvetica")
      .fontSize(12)
      .fillColor(gray)
      .text("No. Telepon", leftX, y);
    doc
      .font("Helvetica-Bold")
      .fontSize(16)
      .fillColor(dark)
      .text(order.userPhone, leftX, y + 15);

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
      .text(order.destinationName, leftX, y + 15, {
        width: 380,
      });

    y += 70;

    doc
      .font("Helvetica")
      .fontSize(12)
      .fillColor(gray)
      .text("Tanggal", leftX, y);
    doc
      .font("Helvetica-Bold")
      .fontSize(15)
      .fillColor(dark)
      .text(
        order.date.toLocaleDateString("id-ID", {
          weekday: "long",
          day: "numeric",
          month: "long",
          year: "numeric",
        }),
        leftX,
        y + 15
      );

    y += 55;

    doc.font("Helvetica").fontSize(12).fillColor(gray).text("Waktu", leftX, y);
    doc
      .font("Helvetica-Bold")
      .fontSize(15)
      .fillColor(dark)
      .text(order.time, leftX, y + 15);

    // ================================
    // KANAN — TICKET INFO + QR
    // ================================
    const rightX = 520;

    // Box Kanan
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

    doc
      .font("Helvetica")
      .fontSize(12)
      .fillColor(gray)
      .text("Jumlah Orang", rightX, 180);
    doc
      .font("Helvetica-Bold")
      .fontSize(18)
      .fillColor(dark)
      .text(`${order.quantity} Orang`, rightX, 200);

    doc
      .font("Helvetica")
      .fontSize(12)
      .fillColor(gray)
      .text("Total Harga", rightX, 235);
    doc
      .font("Helvetica-Bold")
      .fontSize(18)
      .fillColor(dark)
      .text(`Rp ${order.totalPrice.toLocaleString("id-ID")}`, rightX, 255);

    // QR Code (di kanan seperti boarding pass)
    doc.image(Buffer.from(qrBase64, "base64"), rightX + 200, 140, {
      width: 130,
      height: 130,
    });

    // Footer tipis
    doc
      .fontSize(10)
      .fillColor(gray)
      .text("Tunjukkan tiket ini saat memasuki lokasi wisata", 0, HEIGHT - 30, {
        width: WIDTH,
        align: "center",
      });

    doc.end();
  },
};
