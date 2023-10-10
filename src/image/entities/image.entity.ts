import { Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

@Schema({
  timestamps: true,
})
export class Image extends mongoose.Document {}
export const ImageSchema = SchemaFactory.createForClass(Image);
