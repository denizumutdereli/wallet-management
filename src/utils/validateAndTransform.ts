import { errs } from '@/exceptions/HttpException';
import { plainToInstance } from 'class-transformer';
import { ValidationError, validate } from 'class-validator';

async function validateAndTransform<T>(cls: new () => T, data: Record<string, any>, isRequired = true): Promise<T> {
  const instance = plainToInstance(cls, data) as T;

  const options = {
    skipMissingProperties: !isRequired,
    whitelist: true,
    forbidNonWhitelisted: true,
  };

  const errors = await validate(instance as object, options);
  if (errors.length > 0) {
    const message = errors.map((error: ValidationError) => Object.values(error.constraints)).join(',');
    const err = errs.VALIDATION(message);
    throw err;
  } else {
    return instance;
  }
}

export default validateAndTransform;
