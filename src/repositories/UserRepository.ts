import { Prisma, PrismaClient } from "@prisma/client";
import { IUser } from "../controllers/protocols.ts";

const prisma = new PrismaClient();

class UserRepository {
  findByEmail(email: string) {
    return prisma.user.findUnique({
      where: {
        email,
      },
    });
  }

  createUser(user: IUser) {
    return prisma.user.create({
      data: user,
    });
  }

  findAll() {
    return prisma.user.findMany();
  }

  async updateMeta(email: string, meta: number): Promise<IUser | null> {
    try {
      const user = await prisma.user.update({
        where: { email },
        data: { meta } as Prisma.UserUpdateInput
      })
      return user as IUser
    } catch (error) {
      console.log(`ERR REPOSITORY: ${error}`);
      return null
    }
  }
}

export default new UserRepository();
