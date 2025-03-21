import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../services/JwtService.ts";

interface TokenPayload {
  email: string;
  iat: number;
  exp: number;
}

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
      message: "Unauthorized - No token provided",
    });
    return;
  }
  
  const decoded = verifyToken(token) as TokenPayload;

  if (!decoded) {
    res.status(401).json({
      message: "Invalid token",
    });
    return;
  }

  req.headers['userEmail'] = decoded.email
  return next();
};
