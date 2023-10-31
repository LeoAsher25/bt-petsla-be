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

  @Prop({ required: false, default: false })
  isSpecial: boolean;

  @Prop({
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'ProductCategory',
    required: true,
    default: [],
  })
  usesTypes: ProductCategory[]; // array of ProductCategory with type === 1

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ProductCategory',
    required: true,
  })
  petType: ProductCategory; // one ProductCategory with type === 0
}
export const ProductSchema = SchemaFactory.createForClass(Product);
