import { User } from 'src/user/entities/user.entity';

export class CreateImageDto {
  owner?: User;
  mimetype: string;
  filename: string;
  originalname: string;
  size: number;
}
