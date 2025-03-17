import { Router } from "express";
import UserController from "../controllers/UserController.ts";

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

export default router;

// michelHoffmann

// V0PTLQQKuTj0csNq

//mongodb+srv://michelHoffmann:V0PTLQQKuTj0csNq@users.ya2go.mongodb.net/michelHoffmann?retryWrites=true&w=majority&appName=Users

//SECRETE_KEY= 25a14632b08e37fcda4380bdc436ae8e7b247436ceca0e25c21c43158d3cd36f

//GENERATE A SECRETE_KEY= node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"