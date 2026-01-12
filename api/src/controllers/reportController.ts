import { Request, Response, NextFunction } from "express";
import { reportService } from "../services/reportService";
import { generateReportExcel } from "../utilities/reportExcel";
import { generateReportPdf } from "../utilities/reportPdf";
import { ResponseData } from "../utilities/Response";

export const reportController = {
  async sales(req: Request, res: Response, next: NextFunction) {
    try {
      const { start, end } = req.query;

      if (!start || !end) {
        return ResponseData.badRequest(res, "start & end required");
      }

      const report = await reportService.getSalesReport(
        new Date(start as string),
        new Date(end as string)
      );

      return ResponseData.ok(res, report);
    } catch (error) {
      next(error);
    }
  },

  async downloadExcel(req: Request, res: Response, next: NextFunction) {
    try {
      const { start, end } = req.query;

      if (!start || !end) {
        return ResponseData.badRequest(res, "start & end required");
      }

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
    } catch (error) {
      next(error);
    }
  },

  async downloadPdf(req: Request, res: Response, next: NextFunction) {
    try {
      const { start, end } = req.query;

      if (!start || !end) {
        return ResponseData.badRequest(res, "start & end required");
      }

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
      doc.end();
    } catch (error) {
      next(error);
    }
  },
};
