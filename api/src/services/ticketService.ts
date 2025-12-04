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

    const doc = new PDFDocument({ size: "A4", margin: 0 });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="ticket-${order.ticketCode}.pdf"`
    );

    doc.pipe(res);

    const pageWidth = doc.page.width;
    const pageHeight = doc.page.height;

    const marginX = 40;
    let y = 0;

    // Color presets
    const colors = {
      primary: "#1e3a8a",
      infoText: "#475569",
      darkText: "#0f172a",
      boxBorder: "#bfdbfe",
    };

    doc.rect(0, 0, pageWidth, 180).fill(colors.primary);
    doc.rect(0, 160, pageWidth, 20).fill("#3b82f6");

    // Decorations
    doc.fillOpacity(0.3)
      .circle(pageWidth - 50, 50, 60)
      .fill("#60a5fa")
      .circle(70, 120, 40)
      .fill("#93c5fd")
      .fillOpacity(1);

    // Logo
    doc.circle(50, 50, 25).fill("#ffffff");
    doc.fontSize(20).fillColor(colors.primary).text("🎫", 33, 35);

    // Title
    doc.font("Helvetica-Bold")
      .fontSize(28)
      .fillColor("#ffffff")
      .text("E-TICKET WISATA", 100, 50);

    doc.font("Helvetica")
      .fontSize(12)
      .fillColor("#e0e7ff")
      .text("Tiket Digital Anda", 100, 85);

    // Ticket Code Badge
    doc.roundedRect(40, 120, 200, 40, 5).fill("#ffffff");

    doc.fontSize(10)
      .fillColor("#64748b")
      .text("KODE TIKET", 50, 130);

    doc.font("Helvetica-Bold")
      .fontSize(14)
      .fillColor(colors.primary)
      .text(order.ticketCode, 50, 145);

    y = 220;

    doc.font("Helvetica-Bold")
      .fontSize(16)
      .fillColor(colors.primary)
      .text("Informasi Pemesan", marginX, y);

    y += 30;

    const infoBoxHeight = 90;

    doc.roundedRect(marginX, y, pageWidth - marginX * 2, infoBoxHeight, 8)
      .fillAndStroke("#f0f9ff", colors.boxBorder);

    doc.font("Helvetica")
      .fontSize(11)
      .fillColor(colors.infoText)
      .text("Nama", marginX + 20, y + 20);

    doc.font("Helvetica-Bold")
      .fontSize(12)
      .fillColor(colors.darkText)
      .text(order.userName, marginX + 20, y + 38);

    doc.font("Helvetica")
      .fontSize(11)
      .fillColor(colors.infoText)
      .text("No. Telepon", marginX + 20, y + 60);

    doc.font("Helvetica-Bold")
      .fontSize(12)
      .fillColor(colors.darkText)
      .text(order.userPhone, marginX + 20, y + 78);

    y += infoBoxHeight + 30;

    doc.font("Helvetica-Bold")
      .fontSize(16)
      .fillColor(colors.primary)
      .text("Detail Destinasi", marginX, y);

    y += 30;

    const destBoxHeight = 130;

    doc.roundedRect(marginX, y, pageWidth - marginX * 2, destBoxHeight, 8)
      .fill("#fef3c7");

    // Destinasi
    doc.font("Helvetica")
      .fontSize(11)
      .fillColor("#78350f")
      .text("🏝️  Destinasi", marginX + 20, y + 20);

    doc.font("Helvetica-Bold")
      .fontSize(14)
      .fillColor("#78350f")
      .text(order.destinationName, marginX + 20, y + 40, {
        width: pageWidth - 120,
      });

    // Date
    doc.fontSize(11)
      .font("Helvetica")
      .text("📅  Tanggal", marginX + 20, y + 75);

    doc.font("Helvetica-Bold")
      .fontSize(12)
      .text(
        order.date.toLocaleDateString("id-ID", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
        marginX + 20,
        y + 93
      );

    // Time
    doc.fontSize(11)
      .font("Helvetica")
      .text("🕐  Waktu", pageWidth / 2 + 20, y + 75);

    doc.font("Helvetica-Bold")
      .fontSize(12)
      .text(order.time, pageWidth / 2 + 20, y + 93);

    y += destBoxHeight + 30;

    const boxWidth = (pageWidth - marginX * 2) / 2 - 10;

    // Quantity
    doc.roundedRect(marginX, y, boxWidth, 80, 8).fill("#dcfce7");

    doc.fontSize(11)
      .fillColor("#166534")
      .text("👥  Jumlah Orang", marginX + 20, y + 20);

    doc.font("Helvetica-Bold")
      .fontSize(18)
      .fillColor("#166534")
      .text(`${order.quantity} Orang`, marginX + 20, y + 42);

    // Price
    doc.roundedRect(pageWidth / 2 + 10, y, boxWidth, 80, 8).fill("#fee2e2");

    doc.fontSize(11)
      .fillColor("#991b1b")
      .text("💰  Total Harga", pageWidth / 2 + 30, y + 20);

    doc.font("Helvetica-Bold")
      .fontSize(18)
      .fillColor("#991b1b")
      .text(
        `Rp ${order.totalPrice.toLocaleString("id-ID")}`,
        pageWidth / 2 + 30,
        y + 42
      );

    y += 120;

    doc.font("Helvetica-Bold")
      .fontSize(14)
      .fillColor(colors.primary)
      .text("Scan QR Code", marginX, y, {
        align: "center",
        width: pageWidth - marginX * 2,
      });

    y += 30;

    const qrSize = 180;
    const qrX = (pageWidth - qrSize) / 2;

    // QR Background
    doc.roundedRect(qrX - 15, y - 15, qrSize + 30, qrSize + 30, 10)
      .fill("#ffffff");

    doc.image(Buffer.from(qrBase64, "base64"), qrX, y, {
      width: qrSize,
      height: qrSize,
    });

    const footerY = pageHeight - 60;

    doc.font("Helvetica")
      .fontSize(9)
      .fillColor("#94a3b8")
      .text(
        "Tunjukkan tiket ini saat memasuki lokasi wisata",
        marginX,
        footerY,
        { align: "center", width: pageWidth - marginX * 2 }
      );

    doc.fontSize(8)
      .text(
        "Simpan tiket ini dengan baik. Tiket yang sudah dibeli tidak dapat dikembalikan.",
        marginX,
        footerY + 20,
        { align: "center", width: pageWidth - marginX * 2 }
      );

    doc.end();
  },
};
