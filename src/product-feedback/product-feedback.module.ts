import { Module } from '@nestjs/common';
import { ProductFeedbackService } from './product-feedback.service';
import { ProductFeedbackController } from './product-feedback.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  ProductFeedback,
  ProductFeedbackSchema,
} from './entities/product-feedback.entity';
import { UserModule } from 'src/user/user.module';
import { ProductModule } from 'src/product/product.module';
import { ProductFeedbackRepository } from './product-feedback.repository';
import { ProductRepository } from 'src/product/product.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ProductFeedback.name, schema: ProductFeedbackSchema },
    ]),
    ProductModule,
    UserModule,
  ],
  controllers: [ProductFeedbackController],
  providers: [
    ProductFeedbackService,
    ProductFeedbackRepository,
    ProductRepository,
  ],
  exports: [ProductFeedbackRepository],
})
export class ProductFeedbackModule {}
