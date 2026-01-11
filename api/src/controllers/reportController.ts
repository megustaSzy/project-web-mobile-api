// src/controllers/report.controller.ts
import { Request, Response } from "express";
import { reportService } from "../services/reportService";
import { generateReportExcel } from "../utilities/reportExcel";
import { generateReportPdf } from "../utilities/reportPdf";

export const reportController = {
  async sales(req: Request, res: Response) {
    const { start, end } = req.query;
    if (!start || !end) {
      return res.status(400).json({ message: "start & end required" });
    }

    const report = await reportService.getSalesReport(
      new Date(start as string),
      new Date(end as string)
    );

    res.json(report);
  },

  async downloadExcel(req: Request, res: Response) {
    const { start, end } = req.query;

    const report = await reportService.getSalesReport(
      new Date(start as string),
      new Date(end as string)
    );

    const wb = await generateReportExcel(report);

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=laporan-penjualan.xlsx"
    );

    await wb.xlsx.write(res);
    res.end();
  },

  async downloadPdf(req: Request, res: Response) {
    const { start, end } = req.query;

    const report = await reportService.getSalesReport(
      new Date(start as string),
      new Date(end as string)
    );

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=laporan-penjualan.pdf"
    );

    const doc = generateReportPdf(report);
    doc.pipe(res);
  },
};
