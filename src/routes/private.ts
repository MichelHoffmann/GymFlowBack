import { Router } from "express";
import UserController from "../controllers/UserController.ts";
import { auth } from '../middlewares/auth.ts';

const router = Router();

router.get('/user/me', auth, async (req, res) => {
  await UserController.show(req, res);
})

router.patch('/user/me', auth, async (req, res) => {
  await UserController.addMeta(req, res);
})

export default router