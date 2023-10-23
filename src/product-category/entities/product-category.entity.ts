import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

export enum ProductCategoryType {
  BY_PET,
  BY_USES,
}

@Schema({
  timestamps: true,
})
export class ProductCategory extends mongoose.Document {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop({ required: true, enum: ProductCategoryType })
  type: ProductCategoryType;
}
export const ProductCategorySchema =
  SchemaFactory.createForClass(ProductCategory);
