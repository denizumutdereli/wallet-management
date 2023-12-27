import { ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';

@ValidatorConstraint({ name: 'isNumber', async: false })
export class IsNumberConstraint implements ValidatorConstraintInterface {
  validate(value: any) {
    if (typeof value === 'string') {
      value = parseInt(value, 10);
      if (isNaN(value)) {
        return false;
      }
    }

    return typeof value === 'number' && !isNaN(value);
  }

  defaultMessage() {
    return 'value must be a number';
  }
}
