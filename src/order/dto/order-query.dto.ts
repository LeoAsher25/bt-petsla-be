import { EOrderStatus } from 'src/order/order.interface';
import { QueryDto } from 'src/common/dto/query.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class OrderQueryDto extends QueryDto {
  @ApiProperty({ required: true, example: 0 })
  @IsOptional()
  orderStatus?: EOrderStatus;
}
