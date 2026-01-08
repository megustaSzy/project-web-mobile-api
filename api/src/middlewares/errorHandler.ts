import { Request, Response, NextFunction } from "express";

export function errorHandler(
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  const status = err.status || err.statusCode || 500;

  return res.status(status).json({
    status,
    message: err.message || "Internal server error",
  });
}
