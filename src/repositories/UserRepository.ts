import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface IUser {
  name: string;
  email: string;
  password: string;
}

class UserRepository {
  findByEmail(email: string) {
    return prisma.user.findUnique({
      where: {
        email,
      },
    });
  }

  createUser(user: IUser){
    return prisma.user.create({
        data: user
    })
  }

  findAll() {
    return prisma.user.findMany();
  }
}

export default new UserRepository();
