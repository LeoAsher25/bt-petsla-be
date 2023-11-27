import { getPagingData } from './../common/utils/get-paging-data';
import { UserRepository } from './user.repository';
import { BadRequestException, Injectable } from '@nestjs/common';
import { FilterQuery } from 'mongoose';
import { QueryDto } from 'src/common/dto/query.dto';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { UpdateUserDto } from 'src/user/dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async create(createUserDto: CreateUserDto) {
    const checkUser = await this.userRepository.findOne({
      email: createUserDto.email,
    });

    if (checkUser) {
      throw new BadRequestException('Email đã được sử dụng');
    }

    return this.userRepository.create(createUserDto);
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

  update(id: string, updateUserDto: UpdateUserDto) {
    return this.userRepository.updateOne({ _id: id }, updateUserDto);
  }

  remove(id: string) {
    return this.userRepository.delete(id);
  }
}
