import { getPagingData } from './../common/utils/get-paging-data';
import { UserRepository } from './user.repository';
import { Injectable } from '@nestjs/common';
import { FilterQuery } from 'mongoose';
import { QueryDto } from 'src/common/dto/query.dto';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { UpdateUserDto } from 'src/user/dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  create(createUserDto: CreateUserDto) {
    return 'This action adds a new user';
  }

  findAll(query: QueryDto) {
    const { page, limit, keyword } = query;

    const filter: FilterQuery<any> = {
      $or: [
        { idReadable: { $regex: keyword || '', $options: 'gmi' } },
        {
          name: {
            $regex: keyword || '',
            $options: 'gmi',
          },
        },
      ],
    };

    return this.userRepository.getAndCount(filter, '', {
      ...getPagingData(page, limit),
      sort: { createdAt: -1 },
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
