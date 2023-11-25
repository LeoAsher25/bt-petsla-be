import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Order } from 'src/order/entities/order.entity';
import { Product } from 'src/product/entities/product.entity';

@Schema({
  timestamps: true,
})
export class ProductFeedback extends mongoose.Document {
  @Prop({ required: true })
  rating: number;

  @Prop({ required: true })
  comment: string;

  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: Product.name,
  })
  product: Product;

  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: Order.name,
  })
  order: Order;
}
export const ProductFeedbackSchema =
  SchemaFactory.createForClass(ProductFeedback);
