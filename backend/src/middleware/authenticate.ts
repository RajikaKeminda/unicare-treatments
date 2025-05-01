import userService from "../services/userService.ts";
import HttpStatusCodes from "../util/statusCodes.ts";
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

// Extend Express Request type to include user
// declare global {
//   namespace Express {
//     interface Request {
//       user?: {
//         _id: string;
//         role: string;
//       };
//     }
//   }
// }

type JwtPayload = { _id: string; role: string };

export const authenticateToken = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN
  if (!token) {
    res.status(401).json({ message: "Access denied. No token provided." });
    return;
  }
  try {
    const secret = process.env.ACCESS_TOKEN_SECRET || "";
    const decoded = jwt.verify(token, secret);
    req.user = decoded as JwtPayload;
    next();
  } catch (error) {
    res.status(403).json({ message: "Invalid or expired token." });
    return;
  }
};

export const authorizeRole = (roles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      res.status(401).json({ success: false, message: "Not authenticated" });
      return;
    }
    try {
      const user = await userService.findUserById(req.user._id);
      if (!user) {
        res.status(HttpStatusCodes.UNAUTHORIZED).json({
          success: false,
          message: "Not authenticated",
        });
        return;
      }
      if (roles.includes(user?.role)) {
        next();
      } else {
        res.status(HttpStatusCodes.FORBIDDEN).json({
          success: false,
          message: "Error verifying user role",
        });
        return;
      }
    } catch (error) {
      res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "Error verifying user role",
      });
      return;
    }
  };
};
