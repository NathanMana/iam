import { registerDecorator, ValidationOptions, ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';
import userRepository from '../repositories/userRepository';

@ValidatorConstraint({ async: true })
export class IsUserWithEmailAlreadyExistConstraint implements ValidatorConstraintInterface {
  async validate(value: any) {
    const user = await userRepository.findOneByEmail(value as string);
    if (user) return false;
    return true;
  }
}

export function UniqueInColumn(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'UniqueInColumn',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: IsUserWithEmailAlreadyExistConstraint
    });
  };
}