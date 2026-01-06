import { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";
import { ResponseData } from "../utilities/Response";

export const validate =
  (schema: ZodSchema) => (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      return ResponseData.badRequest(res, result.error.issues[0].message);
    }

    req.body = result.data;
    next();
  };
