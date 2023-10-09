import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { UserRole, UserStatus } from 'src/common/constants/user.constants';
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

  @Prop({ required: true, enum: UserRole })
  role: UserRole;

  @Prop({
    enum: UserStatus,
    default: UserStatus.NOT_ACTIVATED,
  })
  status: UserStatus;
}

export const UserSchema = SchemaFactory.createForClass(User);
