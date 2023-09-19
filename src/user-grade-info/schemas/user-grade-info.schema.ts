import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IUserGradeInfo } from '../domains/user-grade-info.interface';
import { HydratedDocument } from 'mongoose';

export type UserGradeInfoDocument = HydratedDocument<UserGradeInfo>;
@Schema()
export class UserGradeInfo implements IUserGradeInfo {
  @Prop()
  age: string;
  @Prop()
  date: Date;
  @Prop()
  gender: string;
  @Prop()
  user: string;
}

export const UserGradeInfoSchema = SchemaFactory.createForClass(UserGradeInfo);
