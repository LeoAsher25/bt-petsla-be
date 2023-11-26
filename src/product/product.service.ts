import { Injectable } from '@nestjs/common';
import { FilterQuery } from 'mongoose';
import { ProductFeedbackRepository } from 'src/product-feedback/product-feedback.repository';
import { QueryProductDto } from 'src/product/dto/product-query.dto';
import { ProductRepository } from 'src/product/product.repository';
import { getPagingData } from './../common/utils/get-paging-data';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductService {
  constructor(
    private readonly productFeedbackRepository: ProductFeedbackRepository,
    private readonly productRepository: ProductRepository,
  ) {}

  create(createProductDto: CreateProductDto) {
    return this.productRepository.create(createProductDto);
  }

  async findAll(query: QueryProductDto) {
    const { page, limit, keyword, usesTypes, petType, isSpecial } = query;
    const filter: FilterQuery<any> = {
      $and: [],
    };

    if (isSpecial === true || isSpecial === false) {
      filter.$and.push({
        isSpecial: isSpecial, // using undefined because old data may dont have isSpecial property
      });
    }

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

    const products = await this.productRepository.getAndCount(
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

    const productsWithRating = await Promise.all(
      products.dataList.map(async (product) => {
        const productFeedbacks =
          await this.productFeedbackRepository.findByCondition({
            product: product._id,
          });

        return {
          ...product,
          rating: productFeedbacks?.reduce(
            (accumulator, currentValue) => accumulator + currentValue.rating,
            0,
          ),
        };
      }),
    );

    return { ...products, dataList: productsWithRating };
  }

  async findOne(id: string) {
    const product = await this.productRepository.findOne({ _id: id }, '');
    const productFeedbacks =
      await this.productFeedbackRepository.findByCondition({
        product: product._id,
      });
    return {
      ...product,
      rating: productFeedbacks?.reduce(
        (accumulator, currentValue) => accumulator + currentValue.rating,
        0,
      ),
    };
  }

  update(id: string, updateProductDto: UpdateProductDto) {
    return this.productRepository.findByIdAndUpdate(id, updateProductDto);
  }

  remove(id: number) {
    return `This action removes a #${id} product`;
  }
}
