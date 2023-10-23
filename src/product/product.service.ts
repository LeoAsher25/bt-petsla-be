import { getPagingData } from './../common/utils/get-paging-data';
import { Injectable } from '@nestjs/common';
import { FilterQuery } from 'mongoose';
import { QueryProductDto } from 'src/common/dto/query.dto';
import { ProductRepository } from 'src/product/product.repository';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductService {
  constructor(private readonly productRepository: ProductRepository) {}

  create(createProductDto: CreateProductDto) {
    console.log('createProductDto: ', createProductDto);
    return this.productRepository.create(createProductDto);
  }

  findAll(query: QueryProductDto) {
    const { page, limit, keyword, categories } = query;
    const filter: FilterQuery<any> = {
      $or: [
        { idReadable: { $regex: keyword || '', $options: 'gmi' } },
        {
          name: {
            $regex: keyword || '',
            $options: 'gmi',
          },
        },
        {
          description: {
            $regex: keyword || '',
            $options: 'gmi',
          },
        },
      ],
    };

    return this.productRepository.getAndCount(
      filter,
      '_id idReadable name stock price image categories created_at',
      {
        ...getPagingData(page, limit),
        sort: { createdAt: -1 },
      },
      [
        {
          path: 'categories',
          select: 'name type',
        },
      ],
    );
  }

  findOne(id: string) {
    return this.productRepository.findOne({ _id: id }, '');
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`;
  }

  remove(id: number) {
    return `This action removes a #${id} product`;
  }
}
