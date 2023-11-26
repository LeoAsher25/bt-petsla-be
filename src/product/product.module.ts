import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductFeedbackModule } from 'src/product-feedback/product-feedback.module';
import { Product, ProductSchema } from 'src/product/entities/product.entity';
import { ProductRepository } from 'src/product/product.repository';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }]),
    ProductFeedbackModule,
  ],
  controllers: [ProductController],
  providers: [ProductService, ProductRepository],
  exports: [
    ProductRepository,
    MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }]),
  ],
})
export class ProductModule {}
