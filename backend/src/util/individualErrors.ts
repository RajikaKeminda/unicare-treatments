import { Request, Response, NextFunction, ErrorRequestHandler } from "express";
import HttpStatusCodes from "./statusCodes.ts";

export const handleURIError: ErrorRequestHandler = (
  err,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof URIError) {
    res.status(HttpStatusCodes.BAD_REQUEST).json({
      success: false,
      message: "Invalid Special Characters Used",
    });
  } else {
    next(err);
  }
};

export const handleOtherErrors: ErrorRequestHandler = (
  err,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.status(err.status || HttpStatusCodes.INTERNAL_SERVER_ERROR).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
};
