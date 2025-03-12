import { IUserController } from "./protocols.ts";
import { createUserSchema } from "../shemas/UserSchema.ts";
import { hashPassword } from "../services/bcryptJsService.ts";
import UserRepository from "../repositories/UserRepository.ts";
import { Request, Response } from "express";

class UserController implements IUserController {
  //   index();
  //   // List all users
  //   show();
  //   // Show a user
  async store(req: Request, res: Response): Promise<Response> {
    const hasErrorInSchema = createUserSchema.safeParse(req.body);
    if (!hasErrorInSchema.success) {
      const errorMessage = hasErrorInSchema.error.errors
        .map((e) => e.message)
        .join(", ");
      return res.status(400).json({
        message: errorMessage,
      });
    }

    try {
      const { name, email, password } = createUserSchema.parse(req.body);
      const hashedPassword = hashPassword(password);

      const userinDb = await UserRepository.findByEmail(email);

      if (userinDb) {
        return res.status(400).json({
          message: "User already exists",
        });
      }
      const user = await UserRepository.createUser({
        name,
        email,
        password: hashedPassword,
      });

      return res.status(201).json(user);
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        message: "Internal server error",
      });
    }
  }
  // Create a user
  //   update();
  //   // Update a user
  //   destroy();
  //   // Delete a user
}

export default UserController;
