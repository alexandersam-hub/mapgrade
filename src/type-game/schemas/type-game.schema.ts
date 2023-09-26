import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ITypeGame } from '../domains/type-game.interface';
import { HydratedDocument } from 'mongoose';

export type StatisticDocument = HydratedDocument<TypeGameSchemaClass>;
@Schema({
  toJSON: {
    transform(doc, ret) {
      (ret.id = ret._id), delete ret._id;
      delete ret.__v;
    },
  },
})
export class TypeGameSchemaClass implements ITypeGame {
  id: string;
  @Prop({ unique: true })
  type: string;
}

export const TypeGameSchema = SchemaFactory.createForClass(TypeGameSchemaClass);
