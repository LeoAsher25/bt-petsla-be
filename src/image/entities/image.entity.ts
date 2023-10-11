import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { User } from 'src/user/entities/user.entity';

@Schema({
  timestamps: true,
})
export class Image extends mongoose.Document {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: User.name, default: null })
  owner: User;

  @Prop()
  mimetype: string;

  @Prop()
  filename: string;

  @Prop()
  originalname: string;

  @Prop()
  size: number;
}
export const ImageSchema = SchemaFactory.createForClass(Image);
