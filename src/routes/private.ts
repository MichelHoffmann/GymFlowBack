import { Router } from "express";
import UserController from "../controllers/UserController.ts";
import { auth } from '../middlewares/auth.ts';

const router = Router();

router.get('/user/me', auth, async (req, res) => {
  await UserController.show(req, res);
})

export default router