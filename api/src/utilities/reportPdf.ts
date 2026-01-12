import PDFDocument from "pdfkit";
import type PDFKit from "pdfkit";

function formatRupiah(value: number): string {
  return `Rp ${value.toLocaleString("id-ID")}`;
}

function drawLine(doc: PDFKit.PDFDocument, y?: number) {
  const currentY = y || doc.y;
  doc
    .strokeColor("#e0e0e0")
    .lineWidth(0.5)
    .moveTo(40, currentY)
    .lineTo(555, currentY)
    .stroke();
}

function sectionTitle(doc: PDFKit.PDFDocument, title: string, icon?: string) {
  doc.moveDown(0.8);
  doc
    .fontSize(13)
    .font("Helvetica-Bold")
    .fillColor("#1a1a1a")
    .text(icon ? `${icon} ${title}` : title);

  doc.moveDown(0.3);
  drawLine(doc);
  doc.moveDown(0.5);
  doc.font("Helvetica").fillColor("#333333");
}

function addTableRow(
  doc: PDFKit.PDFDocument,
  columns: { text: string; width: number; align?: string }[],
  isHeader = false
) {
  const startX = 60;
  const startY = doc.y;
  let currentX = startX;

  if (isHeader) {
    doc.fontSize(10).font("Helvetica-Bold").fillColor("#ffffff");
    doc.rect(40, startY - 3, 515, 20).fillAndStroke("#4a5568", "#4a5568");
    doc.y = startY;
  } else {
    doc.fontSize(10).font("Helvetica").fillColor("#333333");
  }

  columns.forEach((col) => {
    doc.text(col.text, currentX, doc.y, {
      width: col.width,
      align: (col.align as any) || "left",
    });
    currentX += col.width;
  });

  if (!isHeader) {
    doc.moveDown(0.3);
    drawLine(doc);
  }
  doc.moveDown(0.5);
}

function addSummaryBox(
  doc: PDFKit.PDFDocument,
  label: string,
  value: string,
  x: number,
  y: number,
  color: string
) {
  // Box background
  doc.roundedRect(x, y, 120, 60, 5).fillAndStroke(color, color);

  // Label
  doc
    .fontSize(9)
    .font("Helvetica")
    .fillColor("#ffffff")
    .text(label, x + 10, y + 12, { width: 100, align: "left" });

  // Value
  doc
    .fontSize(14)
    .font("Helvetica-Bold")
    .fillColor("#ffffff")
    .text(value, x + 10, y + 30, { width: 100, align: "left" });
}

export function generateReportPdf(report: any) {
  const doc = new PDFDocument({
    margin: 40,
    size: "A4",
    bufferPages: true,
  });

  // Header background
  doc.rect(0, 0, 595, 120).fillAndStroke("#2d3748", "#2d3748");

  // Company/System name
  doc
    .fontSize(24)
    .font("Helvetica-Bold")
    .fillColor("#ffffff")
    .text("LAPORAN PENJUALAN", 40, 35, { align: "center" });

  // Subtitle
  doc
    .fontSize(11)
    .font("Helvetica")
    .fillColor("#e2e8f0")
    .text("Laporan Lengkap Transaksi & Analisis Penjualan", {
      align: "center",
    });

  doc.moveDown();
  doc
    .fontSize(10)
    .fillColor("#cbd5e0")
    .text(`Periode: ${report.header.startDate} s/d ${report.header.endDate}`, {
      align: "center",
    });
  doc.text(`Dibuat pada: ${report.header.generatedAt}`, { align: "center" });

  doc.y = 140;

  sectionTitle(doc, "Ringkasan Penjualan", "📊");

  const boxY = doc.y;
  addSummaryBox(
    doc,
    "Total Pesanan",
    report.summary.totalOrders.toString(),
    60,
    boxY,
    "#3182ce"
  );
  addSummaryBox(
    doc,
    "Total Tiket",
    report.summary.totalTickets.toString(),
    200,
    boxY,
    "#38a169"
  );
  addSummaryBox(
    doc,
    "Total Pendapatan",
    formatRupiah(report.summary.totalRevenue),
    340,
    boxY,
    "#d69e2e"
  );

  doc.y = boxY + 70;
  doc
    .fontSize(10)
    .font("Helvetica")
    .fillColor("#666666")
    .text(
      `Rata-rata Nilai Pesanan: ${formatRupiah(report.summary.avgOrderValue)}`,
      {
        align: "center",
      }
    );

  sectionTitle(doc, "Penjualan Harian", "📅");

  if (report.dailyStats.length === 0) {
    doc.fontSize(10).fillColor("#999999").text("Tidak ada data tersedia");
  } else {
    addTableRow(
      doc,
      [
        { text: "Tanggal", width: 150 },
        { text: "Pesanan", width: 120, align: "center" },
        { text: "Tiket", width: 120, align: "center" },
        { text: "Pendapatan", width: 125, align: "right" },
      ],
      true
    );

    report.dailyStats.forEach((d: any) => {
      addTableRow(doc, [
        {
          text: new Date(d.date).toLocaleDateString("id-ID", {
            weekday: "short",
            day: "2-digit",
            month: "short",
            year: "numeric",
          }),
          width: 150,
        },
        { text: d.orders.toString(), width: 120, align: "center" },
        { text: d.tickets?.toString() || "-", width: 120, align: "center" },
        { text: formatRupiah(d.revenue), width: 125, align: "right" },
      ]);
    });
  }

  doc.addPage();
  sectionTitle(doc, "Penjualan per Destinasi", "🗺️");

  if (report.byDestination.length === 0) {
    doc.fontSize(10).fillColor("#999999").text("Tidak ada data tersedia");
  } else {
    addTableRow(
      doc,
      [
        { text: "Nama Destinasi", width: 200 },
        { text: "Pesanan", width: 100, align: "center" },
        { text: "Tiket", width: 100, align: "center" },
        { text: "Pendapatan", width: 115, align: "right" },
      ],
      true
    );

    report.byDestination.forEach((d: any) => {
      addTableRow(doc, [
        { text: d.destinationName, width: 200 },
        { text: d._count.id.toString(), width: 100, align: "center" },
        {
          text: d._sum.quantity?.toString() || "0",
          width: 100,
          align: "center",
        },
        {
          text: formatRupiah(d._sum.totalPrice || 0),
          width: 115,
          align: "right",
        },
      ]);
    });
  }

  sectionTitle(doc, "Metode Pembayaran", "💳");

  if (report.byPaymentMethod.length === 0) {
    doc.fontSize(10).fillColor("#999999").text("Tidak ada data tersedia");
  } else {
    const methodStartY = doc.y;

    report.byPaymentMethod.forEach((p: any) => {
      doc
        .fontSize(10)
        .font("Helvetica-Bold")
        .fillColor("#333333")
        .text(`• ${p.paymentMethod}`, 60);
      doc
        .font("Helvetica")
        .fillColor("#666666")
        .text(
          `  ${p._count.id} pesanan - ${formatRupiah(p._sum.totalPrice || 0)}`,
          60
        );
      doc.moveDown(0.3);
    });
  }

  doc.moveDown();
  sectionTitle(doc, "Status Pembayaran", "✓");

  if (report.paymentStatus.length === 0) {
    doc.fontSize(10).fillColor("#999999").text("Tidak ada data tersedia");
  } else {
    report.paymentStatus.forEach((s: any) => {
      const statusColor = s.paymentStatus === "PAID" ? "#38a169" : "#e53e3e";
      doc
        .fontSize(10)
        .font("Helvetica-Bold")
        .fillColor(statusColor)
        .text(`• ${s.paymentStatus}`, 60);
      doc
        .font("Helvetica")
        .fillColor("#666666")
        .text(`  ${s._count.id} transaksi`, 60);
      doc.moveDown(0.3);
    });
  }

  doc.addPage();
  sectionTitle(doc, "Detail Transaksi", "📋");

  if (report.transactions.length === 0) {
    doc.fontSize(10).fillColor("#999999").text("Tidak ada transaksi");
  } else {
    report.transactions.forEach((t: any, i: number) => {
      // Transaction card
      const cardY = doc.y;
      doc
        .roundedRect(50, cardY, 495, 85, 3)
        .fillAndStroke("#f7fafc", "#e2e8f0");

      doc
        .fontSize(11)
        .font("Helvetica-Bold")
        .fillColor("#2d3748")
        .text(`#${i + 1} ${t.userName}`, 65, cardY + 12);

      doc.fontSize(9).font("Helvetica").fillColor("#4a5568");

      doc.text(`📍 ${t.destinationName}`, 65, cardY + 30);
      doc.text(
        `📅 ${new Date(t.date).toLocaleDateString("id-ID")}`,
        65,
        cardY + 45
      );
      doc.text(`🎫 ${t.quantity} tiket`, 65, cardY + 60);

      doc.text(`💳 ${t.paymentMethod}`, 280, cardY + 30);
      doc.text(
        `${t.paymentStatus === "PAID" ? "✓" : "⏳"} ${t.paymentStatus}`,
        280,
        cardY + 45
      );

      doc
        .fontSize(12)
        .font("Helvetica-Bold")
        .fillColor("#2d3748")
        .text(formatRupiah(t.totalPrice), 400, cardY + 30, {
          width: 130,
          align: "right",
        });

      doc.y = cardY + 95;
      doc.moveDown(0.3);
    });
  }

  const pages = doc.bufferedPageRange();
  for (let i = 0; i < pages.count; i++) {
    doc.switchToPage(i);

    // Footer line
    doc
      .strokeColor("#e0e0e0")
      .lineWidth(0.5)
      .moveTo(40, 780)
      .lineTo(555, 780)
      .stroke();

    // Footer text
    doc
      .fontSize(8)
      .font("Helvetica")
      .fillColor("#999999")
      .text("Dokumen ini dihasilkan secara otomatis oleh sistem", 40, 790, {
        align: "center",
        width: 515,
      });

    doc.text(`Halaman ${i + 1} dari ${pages.count}`, 40, 805, {
      align: "center",
      width: 515,
    });
  }

  return doc;
}
