import { registerDecorator, ValidationOptions } from 'class-validator';

export function IsObjectId(validationOptions?: ValidationOptions) {
  return (object: any, propertyName: string) => {
    registerDecorator({
      name: 'IsObjectId',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          return /^[0-9a-fA-F]{24,100}$/.test(value);
        },
        defaultMessage: () => 'Invalid ID',
      },
    });
  };
}
