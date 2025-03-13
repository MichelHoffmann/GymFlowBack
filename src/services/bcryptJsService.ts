import bcrypt from "bcryptjs";

export const hashPassword = (password: string) => {
  const salt = bcrypt.genSaltSync(10);
  const hashedPassword = bcrypt.hashSync(password, salt);
  return hashedPassword;
};

export const comparePassword = (RequestPassword: string, passwordDB: string) => {
  return bcrypt.compareSync(RequestPassword, passwordDB);
};
