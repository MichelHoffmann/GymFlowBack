import { z } from "zod";

export const createUserSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters long"),
  email: z.string().email("Invalid email").min(1, "Email is required"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});