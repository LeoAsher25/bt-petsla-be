import { Injectable } from '@nestjs/common';
import { CreateProductFeedbackDto } from './dto/create-product-feedback.dto';
import { UpdateProductFeedbackDto } from './dto/update-product-feedback.dto';
import { ProductFeedbackRepository } from './product-feedback.repository';

@Injectable()
export class ProductFeedbackService {
  constructor(
    private readonly productFeedbackRepository: ProductFeedbackRepository,
  ) {}

  create(createProductFeedbackDto: CreateProductFeedbackDto) {
    return this.productFeedbackRepository.create(createProductFeedbackDto);
  }

  findAllByProduct(product: string) {
    return this.productFeedbackRepository.findByCondition({
      product,
    });
  }

  findOne(id: string) {
    return this.productFeedbackRepository.findById(id);
  }

  update(id: string, updateProductFeedbackDto: UpdateProductFeedbackDto) {
    return this.productFeedbackRepository.updateOne(
      { _id: id },
      updateProductFeedbackDto,
    );
  }

  remove(id: number) {
    return `This action removes a #${id} productFeedback`;
  }
}
