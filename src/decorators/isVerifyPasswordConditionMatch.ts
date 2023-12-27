import { ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments, registerDecorator } from 'class-validator';

@ValidatorConstraint({ name: 'conditionalFields', async: false })
export class ConditionalFieldsValidator implements ValidatorConstraintInterface {
  validate(_: unknown, args: ValidationArguments) {
    const object = args.object as Record<string, unknown>;
    const password = object['password'];
    const verifyPassword = object['verifyPassword'];

    if (password !== undefined && verifyPassword === undefined) {
      return false;
    }

    return true;
  }

  defaultMessage(args: ValidationArguments) {
    return 'If a password is provided, verifyPassword must also be provided.';
  }
}

export function ConditionalFields(validationOptions?: ValidationOptions) {
  return (object: Record<string, unknown>, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [],
      validator: ConditionalFieldsValidator,
    });
  };
}
