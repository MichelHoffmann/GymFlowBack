import { IUserController } from "./protocols.ts";
import { Request, Response } from "express";
import { createUserSchema } from "../shemas/UserSchema.ts";
import { comparePassword, hashPassword } from "../services/bcryptJsService.ts";
import UserRepository from "../repositories/UserRepository.ts";
import { generateToken } from "../services/JwtService.ts";

class UserController implements IUserController {
  async index(res: Response): Promise<Response> {
    const users = await UserRepository.findAll();
    return res.status(200).json(users);
  }

  async show(req: Request, res: Response): Promise<Response> {
    const email = req.headers.userEmail;
    const user = await UserRepository.findByEmail(email as string);
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    return res.status(200).json(user.email);
  }

  async store(req: Request, res: Response): Promise<Response> {
    const hasErrorInSchema = createUserSchema.safeParse(req.body);
    if (!hasErrorInSchema.success) {
      const errorMessage = hasErrorInSchema.error.errors
        .map((e) => `${e.path}: ${e.message}`)
        .join(", ");
      return res.status(400).json({
        message: `🔥${errorMessage}`,
      });
    }

    try {
      const { name, email, password } = createUserSchema.parse(req.body);

      const userinDb = await UserRepository.findByEmail(email);

      if (userinDb) {
        return res.status(400).json({
          message: "🔥Esse usuario já está cadastrado!",
        });
      }

      const hashedPassword = hashPassword(password);
      const user = await UserRepository.createUser({
        name,
        email,
        password: hashedPassword,
      });

      return res.status(201).json(user);
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        message: "🔥Internal server error",
      });
    }
  }
  //   update();
  //   destroy();
  async login(req: Request, res: Response): Promise<Response> {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({
          message: "🔥Email e senha são necesssarios!"
        });
      }

      const user = await UserRepository.findByEmail(email);

      if (!user) {
        return res.status(400).json({
          message: "🔥Email não cadastrado",
        });
      }

      const passwordIsCorrect = comparePassword(password, user.password!);

      if (!passwordIsCorrect) {
        return res.status(401).json({
          message: "🔥Senha invalida",
        });
      }

      const token = generateToken(user.email);

      return res.status(200).json({
        message: "🔥Login concluido!",
        token, user.email
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        message: "🔥Internal server error",
      });
    }
  }
}

export default new UserController();
