import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseRepository } from 'src/base.repository';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class UserRepository extends BaseRepository<User> {
  constructor(
    @InjectModel('User')
    private readonly userModel: Model<User>,
  ) {
    super(userModel);
  }
  async countDocuments(filter) {
    return this.userModel.countDocuments(filter);
  }
}
