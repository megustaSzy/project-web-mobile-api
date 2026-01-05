import { Request, Response, NextFunction } from "express";
import { ResponseData } from "../utilities/Response";

export function errorHandler(
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  ResponseData.serverError(res, err);
}
