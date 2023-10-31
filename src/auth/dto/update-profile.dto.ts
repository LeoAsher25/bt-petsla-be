import { PickType } from '@nestjs/swagger';
import { User } from 'src/user/entities/user.entity';

export class UpdateProfileDto extends PickType(User, [
  'firstName',
  'lastName',
  'phoneNumber',
  'sex',
  'address',
]) {}
