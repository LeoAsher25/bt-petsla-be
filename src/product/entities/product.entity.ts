import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import mongoose from 'mongoose';

@Schema({
  timestamps: true,
})
export class Product extends mongoose.Document {
  @Prop({ required: true, unique: true })
  idReadable: string;

  @ApiProperty({ required: true, example: 'Sản phẩm thứ nhất' })
  name: string;

  @ApiProperty({ required: true, example: '/images' })
  image: string;

  @ApiProperty({ required: true, example: 100000 })
  price: number;

  @ApiProperty({ required: true, example: 'Mô tả cho sản phẩm thứ nhất' })
  description: string;

  @ApiProperty({ required: true, example: '' })
  categories: string[]; // category by type of pets and type of product
}
export const ProductSchema = SchemaFactory.createForClass(Product);
