import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateProductFeedbackDto {
  @ApiProperty({ required: true, example: 5 })
  @IsNotEmpty({ message: 'Rating is required' })
  @IsNumber()
  rating: number;

  @ApiProperty({ required: true, example: '123' })
  @IsNotEmpty({ message: 'Product Id is required' })
  product: string;

  @ApiProperty({ required: true, example: '456' })
  @IsNotEmpty({ message: 'Order Id is required' })
  order: string;

  @ApiProperty({
    example: 'Sản phẩm đẹp, cute, rất đáng tiền',
  })
  @IsString()
  @IsOptional()
  comment?: string;
}
