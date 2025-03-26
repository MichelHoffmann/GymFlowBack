import { IUserController } from "./protocols.ts";
import { Request, Response } from "express";
import { createUserSchema } from "../shemas/UserSchema.ts";
import { comparePassword, hashPassword } from "../services/bcryptJsService.ts";
import UserRepository from "../repositories/UserRepository.ts";
import { generateToken } from "../services/JwtService.ts";
import { Prisma } from "@prisma/client";

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

    return res.status(200).json(user);
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
        token, user: user.email
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        message: "🔥Internal server error",
      });
    }
  }

  async addMeta(req: Request, res: Response): Promise<Response> {
    const { email, meta } = req.body;
    if (!email) {
      return res.status(400).json({
        message: "🔥Email é obrigatorio!",
      });
    }

    if (typeof email !== "string") {
      return res.status(400).json({
        message: "🔥Email deve ser do tipo string!",
      });
    }

    if (!meta) {
      return res.status(400).json({
        message: "🔥Meta é obrigatorio!",
      });
    }

    if (typeof meta !== "number") {
      return res.status(400).json({
        message: "🔥Meta deve ser um número",
      });
    }

    if (meta < 0 || meta > 60) {
      return res.status(400).json({
        message: "🔥Meta deve ser maior que 0 e menor que 61",
      });
    }

    const user = await UserRepository.findByEmail(email);

    try {
      if (!user) {
        return res.status(404).json({
          message: "🔥Usuário não encontrado",
        });
      }

      const userUpdated = await UserRepository.updateMeta(email, meta);
      console.log(userUpdated);

      if (!userUpdated) {
        return res.status(400).json({
          message: "🔥Não foi possivel atualizar a meta do usuario",
        });
      }

      return res.status(200).json({
        message: "🔥Meta atualizada com sucesso!",
        user: {
          name: userUpdated.name,
          email: userUpdated.email,
          meta: userUpdated.meta,
          runs: userUpdated.runningHistory || [],
        },
      });
    } catch (error) {
      console.error("Erro detalhado:", error);

      // Se for um erro do Prisma, adicione mais detalhes
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        return res.status(500).json({
          message: "🔥Erro de banco de dados",
          code: error.code,
          details: error.meta,
        });
      }

      return res.status(500).json({
        message: "🔥Erro ao atualizar meta",
        error: error
      });
    }

  }}

export default new UserController();
