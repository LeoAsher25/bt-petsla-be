import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { ProductCategoryType } from 'src/product-category/entities/product-category.entity';

export class CreateProductCategoryDto {
  @ApiProperty({
    required: true,
    example: 'Cat',
  })
  @IsNotEmpty({ message: 'Product category name is required' })
  name: string;

  @ApiProperty({
    required: true,
    example: 0,
  })
  @IsNotEmpty({ message: 'Product category type is required' })
  type: ProductCategoryType;
}
