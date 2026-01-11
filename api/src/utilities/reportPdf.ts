import PDFDocument from "pdfkit";

export function generateReportPdf(report: any) {
  const doc = new PDFDocument({ margin: 40 });

  doc.fontSize(18).text("LAPORAN PENJUALAN", { align: "center" });
  doc.moveDown();

  doc
    .fontSize(12)
    .text(`Periode: ${report.header.startDate} - ${report.header.endDate}`);
  doc.text(`Generated: ${report.header.generatedAt}`);
  doc.moveDown();

  doc.fontSize(14).text("Ringkasan");
  doc.fontSize(12);
  doc.text(`Total Orders: ${report.summary.totalOrders}`);
  doc.text(`Total Tickets: ${report.summary.totalTickets}`);
  doc.text(`Total Revenue: Rp ${report.summary.totalRevenue}`);
  doc.text(`Avg Order Value: Rp ${report.summary.avgOrderValue}`);
  doc.moveDown();

  doc.fontSize(14).text("Penjualan per Destinasi");
  doc.moveDown(0.5);

  report.byDestination.forEach((d: any) => {
    doc
      .fontSize(12)
      .text(
        `${d.destinationName} - Orders: ${d._count.id}, Revenue: Rp ${d._sum.totalPrice}`
      );
  });

  doc.end();
  return doc;
}
