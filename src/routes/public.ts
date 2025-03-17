import { Router } from "express";
import UserController from "../controllers/UserController.ts";
import { auth } from "../middlewares/auth.ts";

const router = Router();

router.post("/cadastro", async (req, res) => {
  await UserController.store(req, res);
});

router.post("/login", async (req, res) => {
  await UserController.login(req, res);
});

router.get('/allusers', async (req, res) => {
  await UserController.index(res);
})

router.get('/user/id', auth, async (req, res) => {
  await UserController.show(req, res);
})

export default router;

// michelHoffmann

// V0PTLQQKuTj0csNq

//mongodb+srv://michelHoffmann:V0PTLQQKuTj0csNq@users.ya2go.mongodb.net/michelHoffmann?retryWrites=true&w=majority&appName=Users
