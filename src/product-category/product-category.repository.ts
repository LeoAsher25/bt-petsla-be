import { ProductCategory } from './entities/product-category.entity';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseRepository } from 'src/base.repository';

@Injectable()
export class ProductCategoryRepository extends BaseRepository<ProductCategory> {
  constructor(
    @InjectModel('ProductCategory')
    private readonly productCategoryModel: Model<ProductCategory>,
  ) {
    super(productCategoryModel);
  }
  async countDocuments(filter) {
    return this.productCategoryModel.countDocuments(filter);
  }
}
