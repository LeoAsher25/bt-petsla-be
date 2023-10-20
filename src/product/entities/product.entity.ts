import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Type } from 'class-transformer';
import mongoose from 'mongoose';
import { ProductCategory } from 'src/product-category/entities/product-category.entity';

@Schema({
  timestamps: true,
})
export class Product extends mongoose.Document {
  @Prop({ required: true, unique: true })
  idReadable: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  image: string;

  @Prop({ required: true })
  price: number;

  @Prop({ required: true })
  stock: number;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  isCombo: boolean;

  // @Prop({
  //   type: [mongoose.Schema.Types.ObjectId],
  //   ref: ProductCategory.name,
  // })
  // categories: ProductCategory[]; // category by type of pets and type of product

  @Prop({
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'ProductCategory',
    required: true,
    default: [],
  })
  categories: ProductCategory[];
}
export const ProductSchema = SchemaFactory.createForClass(Product);
