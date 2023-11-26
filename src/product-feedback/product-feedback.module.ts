import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from 'src/user/user.module';
import {
  ProductFeedback,
  ProductFeedbackSchema,
} from './entities/product-feedback.entity';
import { ProductFeedbackController } from './product-feedback.controller';
import { ProductFeedbackRepository } from './product-feedback.repository';
import { ProductFeedbackService } from './product-feedback.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ProductFeedback.name, schema: ProductFeedbackSchema },
    ]),
    UserModule,
  ],
  controllers: [ProductFeedbackController],
  providers: [ProductFeedbackService, ProductFeedbackRepository],
  exports: [ProductFeedbackRepository],
})
export class ProductFeedbackModule {}
