import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { EOrderStatus, EPaymentStatus } from 'src/order/order.interface';

export class UpdateOrderDto {
  @ApiProperty({ required: true, example: EOrderStatus.SHIPPING })
  @IsNotEmpty({ message: 'Trạng thái đơn hàng là bắt buộc' })
  orderStatus: EOrderStatus;

  @ApiProperty({ required: true, example: EPaymentStatus.PAID })
  @IsNotEmpty({ message: 'Trạng thái thanh toán là bắt buộc' })
  paymentStatus: EPaymentStatus;
}
