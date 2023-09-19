import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ICriteria, IGrade } from '../domains/grade.interface';
@Schema({
  toJSON: {
    transform(doc, ret) {
      (ret.id = ret._id), delete ret._id;
      delete ret.__v;
    },
  },
})
export class GradeSchemaClass implements IGrade {
  id: string;
  @Prop()
  criteria: ICriteria[];
  @Prop()
  question: string;
  @Prop()
  title: string;
}

export const GradeSchema = SchemaFactory.createForClass(GradeSchemaClass);
