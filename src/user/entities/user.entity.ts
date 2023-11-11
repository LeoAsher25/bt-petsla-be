import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { EUserRole, EUserStatus } from 'src/common/constants/user.constants';
@Schema({
  timestamps: true,
})
export class User extends mongoose.Document {
  @Prop({ required: true, unique: true })
  idReadable: string;

  @Prop({ unique: true, required: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop()
  phoneNumber: string;

  @Prop()
  sex: string;

  @Prop()
  address: string;

  @Prop({ required: true, enum: EUserRole })
  role: EUserRole;

  @Prop({
    enum: EUserStatus,
    default: EUserStatus.NOT_ACTIVATED,
  })
  status: EUserStatus;

  @Prop({})
  gender: number;

  @Prop()
  refreshToken: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
