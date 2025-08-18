import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { SchemaTypes, Types } from 'mongoose';

@Schema({ _id: false })
export class Experiance {
  @Prop({ required: true })
  position: string;

  @Prop({ required: true })
  company: string;

  @Prop({ required: true })
  startDate: Date;

  @Prop()
  endDate?: Date;
}

export const ExperianceSchema = SchemaFactory.createForClass(Experiance);

@Schema()
export class User {
  @Prop({ type: SchemaTypes.ObjectId, auto: true })
  _id: Types.ObjectId;

  @Prop()
  name?: string;

  @Prop({ unique: true, required: true })
  email: string;

  @Prop({ required: true, minLength: 8 })
  password: string;

  @Prop()
  avatarUrl?: string;

  @Prop()
  bio?: string;

  @Prop({ required: true, enum: ['user', 'admin'], default: 'user' })
  role: string;

  @Prop({ type: [String], default: [] })
  skills?: string[];

  @Prop({ type: [ExperianceSchema], default: [] })
  experiances?: Experiance[];
}

export const UserSchema = SchemaFactory.createForClass(User);
