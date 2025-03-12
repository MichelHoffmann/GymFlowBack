import { Router } from "express";
import UserController from "../controllers/UserController.ts";

const prisma = new PrismaClient();
const router = Router();

router.post("/cadastro", (req, res) => UserController.store(req, res));

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({
        message: "Email and password are required",
      });
    }

    const salt = bcrypt.genSaltSync(10);
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
