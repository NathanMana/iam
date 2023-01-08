import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from "class-validator";
import { getAppDataSourceInitialized } from "../lib/typeorm";
import UserRepository from "../repositories/userRepository";

@ValidatorConstraint({ async: true })
export class UniqueInColumnConstraint implements ValidatorConstraintInterface {
  async validate(value: any, args: ValidationArguments) {
    const dataSource = await getAppDataSourceInitialized();
    const userRepository = new UserRepository(dataSource);

    // Ne utiliser le repo dans le dossier repositories, sinon dépendance cyclique
    const user = await userRepository.findByEmail(value);
    return user ? false : true;
  }
}

export function UniqueInColumn(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      constraints: [],
      options: validationOptions,
      validator: UniqueInColumnConstraint,
    });
  };
}
