import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, Matches } from 'class-validator';
import REGEX_CONSTANT from 'src/common/constants/regex.constants';
import { Trimmed } from 'src/common/decorators/trimed.decorator';

export class LoginDto {
  @ApiProperty({
    required: true,
    example: 'test@gmail.com',
  })
  @Matches(REGEX_CONSTANT.EMAIL_REGEX, {
    message: 'Invalid email',
  })
  @Trimmed({ groups: ['Email'] })
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    required: true,
    example: 'Test123@',
  })
  @Matches(REGEX_CONSTANT.PASSWORD_REGEX, {
    message:
      'Password is not valid. It must contain at least 8 characters with at least 1 uppercase letter, 1 lowercase letter, 1 digit, and 1 special character.',
  })
  @Trimmed({ groups: ['Password'] })
  @IsNotEmpty({ message: 'Password is required' })
  password: string;
}
