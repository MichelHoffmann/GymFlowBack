import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET as string;

export const generateToken = (email: string) => {
  return jwt.sign({ email }, JWT_SECRET, { expiresIn: "2m" });
};

export const verifyToken = (token: string) => {
  return jwt.verify(token, JWT_SECRET);
};
