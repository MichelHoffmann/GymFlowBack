import { PrismaClient } from "@prisma/client";
import { IUser } from "../controllers/protocols.ts";

const prisma = new PrismaClient();

class UserRepository {
  findByEmail(email: string) {
    return prisma.user.findUnique({ where: { email } });
  }

  createUser(user: IUser) {
    const { name, email, password } = user;
    return prisma.user.create({
      data: { name, email, password, meta: null, runningHistory: []},
    });
  }

  findAll() {
    return prisma.user.findMany();
  }

  async updateMeta(email: string, meta: number) {
    return prisma.user.update({
      where: { email },
      data: { meta },
    });
  }
}

export default new UserRepository();
