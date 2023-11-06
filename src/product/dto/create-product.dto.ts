import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateProductDto {
  @ApiProperty({ required: true, example: 'Sản phẩm thứ nhất' })
  @IsNotEmpty({ message: 'Name is required' })
  name: string;

  @ApiProperty({ required: true, example: '/images' })
  @IsNotEmpty({ message: 'Image is required' })
  image: string;

  @ApiProperty({ required: true, example: 100000 })
  @IsNotEmpty({ message: 'Price is required' })
  price: number;

  @ApiProperty({ required: true, example: 100 })
  @IsNotEmpty({ message: 'Stock is required' })
  stock: number;

  @ApiProperty({ required: true, example: 'Mô tả cho sản phẩm thứ nhất' })
  @IsNotEmpty({ message: 'Description is required' })
  description: string;

  @ApiProperty({ required: true, example: ['0'] })
  @IsNotEmpty({ message: 'Uses type is required' })
  usesTypes: string[];

  @ApiProperty({ required: true, example: '0' })
  @IsNotEmpty({ message: 'Pet type is required' })
  petType: string;

  @ApiProperty({ required: true, example: false })
  isSpecial: boolean;
}
