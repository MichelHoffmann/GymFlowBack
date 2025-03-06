import express from "express";
import { PrismaClient, User } from "@prisma/client";
import { z } from "zod";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();
const router = express.Router();

const createUserSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters long"),
  email: z.string().email("Invalid email").min(1, "Email is required"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

router.post("/cadastro", async (req, res) => {
  try {
    const { name, email, password } = createUserSchema.parse(req.body);
    const salt = bcrypt.genSaltSync(10)
    const hashedPassword = bcrypt.hashSync(password, salt);

    const userinDb = await prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (userinDb) {
      res.status(400).json({
        message: "User already exists",
      });
    }
    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword },
    });
    res.status(201).json(user);
  } catch (error) {
    if(error instanceof z.ZodError) {
      const errorMessage = error.errors.map((error) => error.message).join(", ");
      res.status(400).json({
        message: errorMessage,
      });
    }
    res.status(500).json({
      message: "Internal server error",
    });
    console.log(error)
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({
        message: "Email and password are required",
      });
    }

    const salt = bcrypt.genSaltSync(10)
    const hashedPassword = bcrypt.hashSync(password, salt);
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (!user) {
      res.status(400).json({
        message: "User not found",
      });
    }
    const passwordIsCorrect = bcrypt.compareSync(password, user!.password!);
    if (!passwordIsCorrect) {
      res.status(401).json({
        message: "Invalid credentials",
      });
    }
    res.status(200).json(user);

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
});
export default router;

// michelHoffmann

// V0PTLQQKuTj0csNq

//mongodb+srv://michelHoffmann:V0PTLQQKuTj0csNq@users.ya2go.mongodb.net/michelHoffmann?retryWrites=true&w=majority&appName=Users
