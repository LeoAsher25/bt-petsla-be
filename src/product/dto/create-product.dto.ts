import { ApiProperty } from '@nestjs/swagger';

export class CreateProductDto {
  @ApiProperty({ required: true, example: 'Sản phẩm thứ nhất' })
  name: string;

  @ApiProperty({ required: true, example: '/images' })
  image: string;

  @ApiProperty({ required: true, example: 100000 })
  price: number;

  @ApiProperty({ required: true, example: 100 })
  stock: number;

  @ApiProperty({ required: true, example: 'Mô tả cho sản phẩm thứ nhất' })
  description: string;

  @ApiProperty({ required: true, example: ['0'] })
  usesTypes: string[];

  @ApiProperty({ required: true, example: '0' })
  petType: string;

  @ApiProperty({ required: true, example: false })
  isSpecial: boolean;
}
