import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import {IUser} from "../items/users.interface";
import {UserRoleEnum} from "../items/roles";
@Schema({
  toJSON: {
    transform(doc, ret) {
      (ret.id = ret._id), delete ret._id;
      delete ret.__v;
    },
  },
})
export class UserSchemaClass implements IUser{
  id: string;
  @Prop()
  password: string;

  @Prop()
  role: UserRoleEnum;

  @Prop()
  login: string;

  @Prop()
  stringName: string;
}

export const UserSchema = SchemaFactory.createForClass(UserSchemaClass)