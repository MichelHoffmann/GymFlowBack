import { PrismaClient } from "@prisma/client";
import { JsonValue } from "@prisma/client/runtime/library";

const prisma = new PrismaClient();

interface IUser {
  id?: string;
  name: string;
  email: string;
  password: string;
  meta?: number | null;
  runningHistory?: JsonValue;
}

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

  updateMeta(email: string, meta: number) {
    try {
      const user = prisma.user.update({
        where: {
          email: email,
        },
        data: {
          meta: meta,
        },
      });
      return user
    } catch (error) {
      console.log(`ERR REPOSITORY: ${error}`);
      return error;
    }
  }
}

export default new UserRepository();
