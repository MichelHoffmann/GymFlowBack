import express from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const router = express.Router();

router.post("/cadastro", async (req, res) => {
  try {
    const {name, email, password } = req.body;
    if (!name || !email || !password) {
      res.status(400).json({
        message: "Missing required fields",
      });
      return;
    }
    const userinDb = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });
    if (userinDb) {
      res.status(400).json({
        message: "User already exists",
      });
      return;
    }
    const user = await prisma.user.create({
      data: {name, email, password},
    });
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
    });
  }
});

export default router;

// michelHoffmann

// V0PTLQQKuTj0csNq

//mongodb+srv://michelHoffmann:V0PTLQQKuTj0csNq@users.ya2go.mongodb.net/michelHoffmann?retryWrites=true&w=majority&appName=Users
