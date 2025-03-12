import { IUserController } from "./protocols.js";
import { createUserSchema } from "../shemas/UserSchema.ts";
import { hashPassword } from "../services/bcryptJsService.ts";

class UserController implements IUserController {
  //   index();
  //   // List all users
  //   show();
  //   // Show a user
  async store(req: Request, res: Response): Promise<Response> {
    try {
      const { name, email, password } = createUserSchema.parse(req.body);
      const hashedPassword = hashPassword(password);

      const userinDb = await prisma.user.findUnique({
        where: {
          email,
        },
      });
      if (userinDb) {
        return res.status(400).json({
          message: "User already exists",
        });
      }
      const user = await prisma.user.create({
        data: { name, email, password: hashedPassword },
      });
      return res.status(201).json(user);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errorMessage = error.errors
          .map((error) => error.message)
          .join(", ");
        return res.status(400).json({
          message: errorMessage,
        });
      }
      return res.status(500).json({
        message: "Internal server error",
      });
      console.log(error);
    }
  }
  // Create a user
  //   update();
  //   // Update a user
  //   destroy();
  //   // Delete a user
}

export default new UserController();
