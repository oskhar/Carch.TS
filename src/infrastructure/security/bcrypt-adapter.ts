import bcrypt from "bcrypt";
import { PasswordHashing } from "../interfaces/security/password-hashing";

export class BCryptAdapter implements PasswordHashing {
  constructor(private readonly saltRounds = 10) {}

  async hash(password: string): Promise<string> {
    return await bcrypt.hash(password, this.saltRounds);
  }

  async compare(password: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(password, hash);
  }
}
