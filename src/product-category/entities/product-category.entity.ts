import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

export enum EProductCategoryType {
  BY_PET,
  BY_USES,
}

@Schema({
  timestamps: true,
})
export class ProductCategory extends mongoose.Document {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop({ required: true, enum: EProductCategoryType })
  type: EProductCategoryType;
}
export const ProductCategorySchema =
  SchemaFactory.createForClass(ProductCategory);
