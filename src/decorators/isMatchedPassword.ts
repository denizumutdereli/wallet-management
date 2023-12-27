import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';

export function isMatchedPassword(relatedPropertyName: string, validationOptions?: ValidationOptions) {
  return (object: any, propertyName: string) => {
    registerDecorator({
      name: 'isMatchedPassword',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [relatedPropertyName], // Pass the relatedPropertyName as a constraint
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const [relatedPropertyName] = args.constraints;
          const relatedValue = (args.object as any)[relatedPropertyName];
          return value === relatedValue;
        },
        defaultMessage: () => 'Passwords do not match',
      },
    });
  };
}
