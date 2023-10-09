import {
  ValidationOptions,
  registerDecorator,
  ValidationArguments,
} from 'class-validator';

export function Trimmed(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'trimmed',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          console.log('value', value);

          if (typeof value !== 'string') {
            return false;
          }
          const trimmedValue = value.trim();
          return trimmedValue.length >= 0;
        },
        defaultMessage() {
          return `${validationOptions.message} must be a non-empty string after trimming`;
        },
      },
    });
  };
}
