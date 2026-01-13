import ExcelJS from "exceljs";

export async function generateReportExcel(report: any) {
  const wb = new ExcelJS.Workbook();

  // summary sheet
  const summarySheet = wb.addWorksheet("Summary");
  summarySheet.addRows([
    ["Periode", `${report.header.startDate} - ${report.header.endDate}`],
    ["Total Orders", report.summary.totalOrders],
    ["Total Tickets", report.summary.totalTickets],
    ["Total Revenue", report.summary.totalRevenue],
    ["Avg Order Value", report.summary.avgOrderValue],
  ]);

  // daily
  const dailySheet = wb.addWorksheet("Daily Sales");
  dailySheet.addRow(["Date", "Orders", "Revenue"]);
  report.dailyStats.forEach((d: any) => {
    dailySheet.addRow([d.date, d.orders, d.revenue]);
  });

  // ===== DESTINATION =====
  const destSheet = wb.addWorksheet("By Destination");
  destSheet.addRow(["Destination", "Orders", "Tickets", "Revenue"]);
  report.byDestination.forEach((d: any) => {
    destSheet.addRow([
      d.destinationName,
      d._count.id,
      d._sum.quantity,
      d._sum.totalPrice,
    ]);
  });

  // ===== TRANSACTIONS =====
  const trxSheet = wb.addWorksheet("Transactions");
  trxSheet.addRow([
    "Ticket",
    "User",
    "Destination",
    "Qty",
    "Total",
    "Payment",
    "Paid At",
  ]);

  report.transactions.forEach((t: any) => {
    trxSheet.addRow([
      t.ticketCode,
      t.userName,
      t.destinationName,
      t.quantity,
      t.totalPrice,
      t.paymentMethod,
      t.paidAt,
    ]);
  });

  return wb;
}
