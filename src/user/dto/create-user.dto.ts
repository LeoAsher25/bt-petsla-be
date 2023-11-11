import { IsIn, IsNotEmpty, IsString, Length, Matches } from 'class-validator';
import REGEX_CONSTANT from 'src/common/constants/regex.constants';
import { EGender, EUserRole } from 'src/common/constants/user.constants';
import { Trimmed } from 'src/common/decorators/trimed.decorator';

export class CreateUserDto {
  @IsNotEmpty({ message: 'First name is required' })
  @IsString()
  @Length(1, 50, {
    message: 'Name must be between 1 and 50 characters',
  })
  @Trimmed({ message: 'First name' })
  firstName: string;

  @IsNotEmpty({ message: 'Last name is required' })
  @IsString()
  @Length(1, 50, {
    message: 'Name must be between 1 and 50 characters',
  })
  @Trimmed({ message: 'Last name' })
  lastName: string;

  @IsNotEmpty()
  @Trimmed({ message: 'Email' })
  @Matches(REGEX_CONSTANT.EMAIL_REGEX, {
    message: 'Invalid email',
  })
  email: string;

  @IsNotEmpty({ message: 'Phone number is required' })
  phoneNumber: string;

  @IsNotEmpty({ message: 'Phone number is required' })
  address: string;

  @IsNotEmpty()
  @Trimmed({ message: 'Password' })
  @Matches(REGEX_CONSTANT.PASSWORD_REGEX, {
    message:
      'Password is not valid. It must contain at least 8 characters with at least 1 uppercase letter, 1 lowercase letter, 1 digit, and 1 special character.',
  })
  password: string;

  @IsIn(Object.values(EUserRole))
  role: EUserRole;

  @IsIn(Object.values(EGender))
  gender: EGender;
}
