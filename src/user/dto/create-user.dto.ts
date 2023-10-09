import { IsIn, IsNotEmpty, IsString, Length, Matches } from 'class-validator';
import { UserRole } from 'src/common/constants/user.constants';
import { Trimmed } from 'src/common/decorators/trimed.decorator';
const PASSWORD_REGEX =
  /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_])[A-Za-z\d\W_]{8,}$/;
const EMAIL_REGEX =
  /^([A-Za-z0-9]+[._+-]+)*[A-Za-z0-9]+@[A-Za-z0-9]+[A-Za-z0-9.-]*\.[A-Za-z]{2,}\s*$/;

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
  @Matches(EMAIL_REGEX, {
    message: 'Invalid email',
  })
  email: string;

  @IsNotEmpty({ message: 'Phone number is required' })
  phoneNumber: string;

  @IsNotEmpty()
  @Trimmed({ message: 'Password' })
  @Matches(PASSWORD_REGEX, {
    message:
      'Password is not valid. It must contain at least 8 characters with at least 1 uppercase letter, 1 lowercase letter, 1 digit, and 1 special character.',
  })
  password: string;

  @IsIn(Object.values(UserRole))
  role: UserRole;
}
