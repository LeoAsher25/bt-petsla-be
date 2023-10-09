import { IsNotEmpty, Length, Matches } from 'class-validator';
import REGEX_CONSTANT from 'src/common/constants/regex.constants';
import { Trimmed } from 'src/common/decorators/trimed.decorator';

export class RegisterDto {
  @Length(1, 50, {
    message: 'First name must be between 1 and 50 characters',
  })
  @Trimmed({ groups: ['First name'] })
  @IsNotEmpty({ message: 'First name is required' })
  firstName: string;

  @Length(1, 50, {
    message: 'Last name must be between 1 and 50 characters',
  })
  @Trimmed({ groups: ['Last name'] })
  @IsNotEmpty({ message: 'Last name is required' })
  lastName: string;

  @Matches(REGEX_CONSTANT.EMAIL_REGEX, {
    message: 'Invalid email',
  })
  @Trimmed({ groups: ['Email'] })
  @IsNotEmpty()
  email: string;

  @IsNotEmpty({ message: 'Phone number is required' })
  phoneNumber: string;

  @Matches(REGEX_CONSTANT.PASSWORD_REGEX, {
    message:
      'Password is not valid. It must contain at least 8 characters with at least 1 uppercase letter, 1 lowercase letter, 1 digit, and 1 special character.',
  })
  @Trimmed({ groups: ['Password'] })
  @IsNotEmpty({ message: 'Password is required' })
  password: string;
}
