import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import {ITask} from "../items/task.interface";
@Schema({
  toJSON: {
    transform(doc, ret) {
      (ret.id = ret._id), delete ret._id;
      delete ret.__v;
    },
  },
})
export class UserSchemaClass implements ITask{
  id: string;

  @Prop()
  description: string;
  @Prop()
  duration: number;
  @Prop()
  localName: string;
  @Prop()
  title: string;
  @Prop()
  type: string;
}

export const TaskSchema = SchemaFactory.createForClass(UserSchemaClass)