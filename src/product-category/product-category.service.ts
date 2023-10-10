import { ConflictException, Injectable } from '@nestjs/common';
import MessageConstants from 'src/common/constants/message.constants';
import { ProductCategoryRepository } from 'src/product-category/product-category.repository';
import { CreateProductCategoryDto } from './dto/create-product-category.dto';

@Injectable()
export class ProductCategoryService {
  constructor(
    private readonly productCategoryRepository: ProductCategoryRepository,
  ) {}

  async create(createProductCategoryDto: CreateProductCategoryDto) {
    const category = await this.productCategoryRepository.findOne({
      name: createProductCategoryDto.name,
    });
    if (category) {
      throw new ConflictException(
        MessageConstants.PRODUCT_CATEGORY_ALREADY_EXISTS,
      );
    }
    return this.productCategoryRepository.create(createProductCategoryDto);
  }

  async findAll() {
    return this.productCategoryRepository.findAll();
  }

  async findOne(id: string) {
    return this.productCategoryRepository.findById(id);
  }
}
