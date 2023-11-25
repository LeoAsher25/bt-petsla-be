import { ProductFeedback } from './entities/product-feedback.entity';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseRepository } from 'src/base.repository';

@Injectable()
export class ProductFeedbackRepository extends BaseRepository<ProductFeedback> {
  constructor(
    @InjectModel('ProductFeedback')
    private readonly productModel: Model<ProductFeedback>,
  ) {
    super(productModel);
  }
  async countDocuments(filter) {
    return this.productModel.countDocuments(filter);
  }
}
