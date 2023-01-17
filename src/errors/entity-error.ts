import { SetPasswordDTO } from "../entities/user";

export class EntityError extends Error {
  password: SetPasswordDTO;

  constructor(message: string, password: SetPasswordDTO) {
    super(message);
    this.password = password;
  }
}