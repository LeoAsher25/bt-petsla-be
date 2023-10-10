import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  ProductCategory,
  ProductCategorySchema,
} from 'src/product-category/entities/product-category.entity';
import { ProductCategoryRepository } from 'src/product-category/product-category.repository';
import { UserModule } from 'src/user/user.module';
import { ProductCategoryController } from './product-category.controller';
import { ProductCategoryService } from './product-category.service';

@Module({
  imports: [
    UserModule,
    MongooseModule.forFeature([
      { name: ProductCategory.name, schema: ProductCategorySchema },
    ]),
  ],
  controllers: [ProductCategoryController],
  providers: [ProductCategoryService, ProductCategoryRepository],
})
export class ProductCategoryModule {}
