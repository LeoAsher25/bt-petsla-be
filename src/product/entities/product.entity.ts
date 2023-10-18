import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
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

  @Prop({
    default: [],
    type: Array(mongoose.Schema.Types.ObjectId),
    ref: 'ProductCategory',
  })
  categories: ProductCategory[]; // category by type of pets and type of product
}
export const ProductSchema = SchemaFactory.createForClass(Product);
