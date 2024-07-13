import bcrypt from "bcrypt";
import { config } from "dotenv";
import { IUser } from "../types";
config();

async function hashPassword(password: string) {
  const saltRounds = Number(process.env.BCRYPT_SALT_ROUNDS || 10);
  const salt = await bcrypt.genSalt(saltRounds);

  const hash = await bcrypt.hash(password, salt);

  return hash;
}

export async function comparePassword(user: IUser, password: string) {
    const match = await bcrypt.compare(password, user.password!);

    return match;
}

export default hashPassword;