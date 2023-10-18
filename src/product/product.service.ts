import { Injectable } from '@nestjs/common';
import { QueryProjectDto } from 'src/common/dto/query.dto';
import { ProductRepository } from 'src/product/product.repository';
import { getPagingData } from './../common/utils/get-paging-data';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductService {
  constructor(private readonly productRepository: ProductRepository) {}

  create(createProductDto: CreateProductDto) {
    return 'This action adds a new product';
  }

  findAll(query: QueryProjectDto) {
    const { page, limit, keyword } = query;

    const filter = {
      $or: [
        { idReadable: { $regex: new RegExp(keyword || '', 'gmi') } },
        {
          name: {
            $regex: new RegExp(keyword || '', 'gmi'),
          },
        },
        {
          description: {
            $regex: new RegExp(keyword || '', 'gmi'),
          },
        },
      ],
    };

    return this.productRepository.getAndCount(
      filter,
      '_id name price image',
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
