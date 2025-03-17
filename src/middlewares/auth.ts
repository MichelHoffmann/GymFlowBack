import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../services/JwtService.ts";

export const auth = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization

  if(!authHeader) {
    res.status(401).json({
      message: "Unauthorized",
    });
    return;
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    res.status(401).json({
      message: "Unauthorized",
    });
    return;
  }

  const decoded = JSON.stringify(verifyToken(token));
  console.log(`TYPEOF DECODED: ${decoded}`);

  if (!decoded) {
    res.status(401).json({
      message: "Unauthorized",
    });
    return;
  }

  return next();
};
