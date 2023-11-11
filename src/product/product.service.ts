import { getPagingData } from './../common/utils/get-paging-data';
import { Injectable } from '@nestjs/common';
import { FilterQuery } from 'mongoose';
import { ProductRepository } from 'src/product/product.repository';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { QueryProductDto } from 'src/product/dto/product-query.dto';

@Injectable()
export class ProductService {
  constructor(private readonly productRepository: ProductRepository) {}

  create(createProductDto: CreateProductDto) {
    return this.productRepository.create(createProductDto);
  }

  findAll(query: QueryProductDto) {
    const { page, limit, keyword, usesTypes, petType, isSpecial } = query;
    const filter: FilterQuery<any> = {
      $and: [
        {
          isSpecial: isSpecial || undefined, // using undefined because old data may dont have isSpecial property
        },
      ],
    };

    if (keyword) {
      filter.$and.push({
        $or: [
          { idReadable: { $regex: keyword || '', $options: 'gmi' } },
          {
            name: {
              $regex: keyword || '',
              $options: 'gmi',
            },
          },
        ],
      });
    }

    // if (isSpecial) {
    //   filter.$and.push({
    //     isSpecial,
    //   });
    // } else {
    //   filter.$and.push({
    //     isSpecial: false,
    //   });
    // }

    if (usesTypes && usesTypes.length > 0) {
      filter.$and.push({
        usesTypes: {
          $in: usesTypes.split(','),
        },
      });
    }

    if (petType) {
      filter.$and.push({
        petType,
      });
    }

    return this.productRepository.getAndCount(
      filter.$and.length === 0 ? {} : filter,
      '',
      {
        ...getPagingData(page, limit),
        sort: { createdAt: -1 },
      },
      [
        {
          path: 'usesTypes',
          select: 'name type',
        },
        {
          path: 'petType',
          select: 'name type',
        },
      ],
    );
  }

  findOne(id: string) {
    return this.productRepository.findOne({ _id: id }, '');
  }

  update(id: string, updateProductDto: UpdateProductDto) {
    return this.productRepository.findByIdAndUpdate(id, updateProductDto);
  }

  remove(id: number) {
    return `This action removes a #${id} product`;
  }
}
