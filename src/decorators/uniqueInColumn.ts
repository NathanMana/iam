import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from "class-validator";
import { getAppDataSourceInitialized } from "../lib/typeorm";
import UserRepository from "../repositories/userRepository";

@ValidatorConstraint({ async: true })
export class UniqueInColumnConstraint implements ValidatorConstraintInterface {
  async validate(value: any) {
    const dataSource = await getAppDataSourceInitialized();
    const userRepository = new UserRepository(dataSource);

    // Ne utiliser le repo dans le dossier repositories, sinon dépendance cyclique
    const user = await userRepository.findByEmail(value as string);
    return user ? false : true;
  }
}

export function UniqueInColumn(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      constraints: [],
      options: validationOptions,
      validator: UniqueInColumnConstraint,
    });
  };
}
