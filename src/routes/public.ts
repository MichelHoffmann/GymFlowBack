import { Router } from "express";
import UserController from "../controllers/UserController.ts";

// const prisma = new PrismaClient();
const router = Router();

router.post("/cadastro", async (req, res) => {
  await UserController.store(req, res);
});

router.post("/login", async (req, res) => {
  await UserController.login(req, res);
});

router.get('/users', async (req, res) => {
  await UserController.index(res);
})

export default router;

// michelHoffmann

// V0PTLQQKuTj0csNq

//mongodb+srv://michelHoffmann:V0PTLQQKuTj0csNq@users.ya2go.mongodb.net/michelHoffmann?retryWrites=true&w=majority&appName=Users
