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

      const startDate = new Date(start as string);
      const endDate = new Date(end as string);

      if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        return ResponseData.badRequest(res, "invalid date format");
      }

      if (startDate > endDate) {
        return ResponseData.badRequest(
          res,
          "start date must be before end date"
        );
      }

      const report = await reportService.getSalesReport(startDate, endDate);
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

      const startDate = new Date(start as string);
      const endDate = new Date(end as string);

      if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        return ResponseData.badRequest(res, "invalid date format");
      }

      if (startDate > endDate) {
        return ResponseData.badRequest(
          res,
          "start date must be before end date"
        );
      }

      const report = await reportService.getSalesReport(startDate, endDate);
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

      const startDate = new Date(start as string);
      const endDate = new Date(end as string);

      if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        return ResponseData.badRequest(res, "invalid date format");
      }

      if (startDate > endDate) {
        return ResponseData.badRequest(
          res,
          "start date must be before end date"
        );
      }

      const report = await reportService.getSalesReport(startDate, endDate);

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
