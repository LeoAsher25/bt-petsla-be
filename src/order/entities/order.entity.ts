import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { OrderProductDto } from 'src/order/dto/create-order.dto';
import {
  EOrderStatus,
  EPaymentMethod,
  EPaymentStatus,
} from 'src/order/order.interface';
import { Product } from 'src/product/entities/product.entity';
import { User } from 'src/user/entities/user.entity';

@Schema({
  timestamps: true,
})
export class Order extends mongoose.Document {
  @Prop({ required: true, unique: true })
  idReadable: string;

  @Prop({ required: true, maxlength: 50 })
  fullName: string;

  @Prop({ required: true, maxlength: 150 })
  address: string;

  @Prop({ required: true })
  phoneNumber: string;

  @Prop({ required: false, maxlength: 500 })
  note: string;

  @Prop({ required: true })
  totalCost: number;

  @Prop({ required: true, enum: EPaymentMethod, default: EPaymentMethod.COD })
  paymentMethod: EPaymentMethod;

  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: User.name,
  })
  customerId: User;

  @Prop({
    enum: EOrderStatus,
    default: EOrderStatus.PENDING,
  })
  orderStatus: EOrderStatus;

  @Prop({
    enum: EPaymentStatus,
    default: EPaymentStatus.UNPAID,
  })
  paymentStatus: EPaymentStatus;

  @Prop({
    // type: [{ type: mongoose.Schema.Types.ObjectId, ref: Product.name }],
    // type: mongoose.Schema.Types.ObjectId,
    type: [
      {
        productId: { type: mongoose.Schema.Types.ObjectId, ref: Product.name },
        name: String,
        image: String,
        price: String,
        quantity: Number,
      },
    ],
    // ref: Product.name,
    required: true,
    default: [],
  })
  orderItems: OrderProductDto[];
}
export const OrderSchema = SchemaFactory.createForClass(Order);
