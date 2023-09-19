import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IStatistic, IStatisticResult } from '../domains/statistic.interface';
import { HydratedDocument } from 'mongoose';

export type StatisticDocument = HydratedDocument<Statistic>;
@Schema({
  toJSON: {
    transform(doc, ret) {
      (ret.id = ret._id), delete ret._id;
      delete ret.__v;
    },
  },
})
export class Statistic implements IStatistic {
  id: string;
  @Prop()
  game: string;
  @Prop({ type: [Object] })
  result: IStatisticResult[];
}

export const StatisticSchema = SchemaFactory.createForClass(Statistic);
