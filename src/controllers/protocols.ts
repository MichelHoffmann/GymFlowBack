import { JsonValue } from "@prisma/client/runtime/library";
import { Request, Response } from "express";

export interface IUserController {
  index(res: Response): Promise<Response>;
  show?(req: Request, res: Response): Promise<Response>;
  store(req: Request, res: Response): Promise<Response>;
  update?(req: Request, res: Response): Promise<Response>;
  destroy?(req: Request, res: Response): Promise<Response>;
  login(req: Request, res: Response): Promise<Response>;
}

export interface IUser {
  id?: string;
  name: string;
  email: string;
  password: string;
  meta?: number | null;
  runningHistory?: RunningEntry[];
}

interface RunningEntry {
  date: string; // ISO string (ex: "2025-03-25T14:00:00.000Z")
  distance: number; // Distância em km
  time: number; // Tempo em segundos
}