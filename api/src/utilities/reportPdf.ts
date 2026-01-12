import PDFDocument from "pdfkit";

function formatRupiah(value: number): string {
  return `Rp ${value.toLocaleString("id-ID")}`;
}

export function generateReportPdfText(report: any) {
  const doc = new PDFDocument({ margin: 40, size: "A4", bufferPages: true });

  // Header
  doc
    .fontSize(20)
    .font("Helvetica-Bold")
    .text("LAPORAN PENJUALAN", { align: "center" });
  doc.moveDown(0.5);
  doc
    .fontSize(11)
    .font("Helvetica")
    .text("Laporan Lengkap Transaksi & Analisis Penjualan", {
      align: "center",
    });
  doc.moveDown(0.5);
  doc
    .fontSize(10)
    .text(`Periode: ${report.header.startDate} s/d ${report.header.endDate}`, {
      align: "center",
    });
  doc.text(`Dibuat pada: ${report.header.generatedAt}`, { align: "center" });

  doc.moveDown(2);

  // Ringkasan Penjualan
  doc.fontSize(13).font("Helvetica-Bold").text("Ringkasan Penjualan");
  doc.moveDown(0.5);
  doc
    .fontSize(10)
    .font("Helvetica")
    .text(`Total Pesanan: ${report.summary.totalOrders}`);
  doc.text(`Total Tiket: ${report.summary.totalTickets}`);
  doc.text(`Total Pendapatan: ${formatRupiah(report.summary.totalRevenue)}`);
  doc.text(
    `Rata-rata Nilai Pesanan: ${formatRupiah(report.summary.avgOrderValue)}`
  );

  doc.moveDown(2);

  // Penjualan Harian
  doc.fontSize(13).font("Helvetica-Bold").text("Penjualan Harian");
  doc.moveDown(0.5);
  if (report.dailyStats.length === 0) {
    doc
      .fontSize(10)
      .font("Helvetica")
      .fillColor("#999999")
      .text("Tidak ada data tersedia");
  } else {
    report.dailyStats.forEach((d: any) => {
      const dateStr = new Date(d.date).toLocaleDateString("id-ID", {
        weekday: "short",
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
      doc
        .fontSize(10)
        .font("Helvetica")
        .fillColor("#000000")
        .text(
          `Tanggal: ${dateStr}, Pesanan: ${d.orders}, Tiket: ${
            d.tickets || "-"
          }, Pendapatan: ${formatRupiah(d.revenue)}`
        );
    });
  }

  doc.addPage();

  // Penjualan per Destinasi
  doc.fontSize(13).font("Helvetica-Bold").text("Penjualan per Destinasi");
  doc.moveDown(0.5);
  if (report.byDestination.length === 0) {
    doc.fontSize(10).fillColor("#999999").text("Tidak ada data tersedia");
  } else {
    report.byDestination.forEach((d: any) => {
      doc
        .fontSize(10)
        .fillColor("#000000")
        .text(
          `Destinasi: ${d.destinationName}, Pesanan: ${d._count.id}, Tiket: ${
            d._sum.quantity || 0
          }, Pendapatan: ${formatRupiah(d._sum.totalPrice || 0)}`
        );
    });
  }

  doc.moveDown(2);

  // Metode Pembayaran
  doc.fontSize(13).font("Helvetica-Bold").text("Metode Pembayaran");
  doc.moveDown(0.5);
  if (report.byPaymentMethod.length === 0) {
    doc.fontSize(10).fillColor("#999999").text("Tidak ada data tersedia");
  } else {
    report.byPaymentMethod.forEach((p: any) => {
      doc
        .fontSize(10)
        .font("Helvetica-Bold")
        .fillColor("#000000")
        .text(`${p.paymentMethod}`);
      doc
        .font("Helvetica")
        .text(
          `  ${p._count.id} pesanan - ${formatRupiah(p._sum.totalPrice || 0)}`
        );
      doc.moveDown(0.3);
    });
  }

  doc.moveDown(1);

  // Status Pembayaran
  doc.fontSize(13).font("Helvetica-Bold").text("Status Pembayaran");
  doc.moveDown(0.5);
  if (report.paymentStatus.length === 0) {
    doc.fontSize(10).fillColor("#999999").text("Tidak ada data tersedia");
  } else {
    report.paymentStatus.forEach((s: any) => {
      doc
        .fontSize(10)
        .font("Helvetica-Bold")
        .fillColor("#000000")
        .text(`${s.paymentStatus}`);
      doc
        .font("Helvetica")
        .fillColor("#000000")
        .text(`  ${s._count.id} transaksi`);
      doc.moveDown(0.3);
    });
  }

  doc.addPage();

  // Detail Transaksi
  doc.fontSize(13).font("Helvetica-Bold").text("Detail Transaksi");
  doc.moveDown(0.5);
  if (report.transactions.length === 0) {
    doc.fontSize(10).fillColor("#999999").text("Tidak ada transaksi");
  } else {
    report.transactions.forEach((t: any, i: number) => {
      doc
        .fontSize(11)
        .font("Helvetica-Bold")
        .text(`#${i + 1} ${t.userName}`);
      doc
        .fontSize(10)
        .font("Helvetica")
        .fillColor("#000000")
        .text(
          `Destinasi: ${t.destinationName}, Tanggal: ${new Date(
            t.date
          ).toLocaleDateString("id-ID")}, Tiket: ${t.quantity}, Metode: ${
            t.paymentMethod
          }, Status: ${t.paymentStatus}, Total: ${formatRupiah(t.totalPrice)}`
        );
      doc.moveDown(0.5);
    });
  }

  // Footer di setiap halaman
  const pages = doc.bufferedPageRange();
  for (let i = 0; i < pages.count; i++) {
    doc.switchToPage(i);
    doc
      .fontSize(8)
      .font("Helvetica")
      .fillColor("#999999")
      .text(`Dokumen ini dihasilkan secara otomatis oleh sistem`, 40, 790, {
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
