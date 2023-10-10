import { Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

@Schema({
  timestamps: true,
})
export class Order extends mongoose.Document {}
export const OrderSchema = SchemaFactory.createForClass(Order);
