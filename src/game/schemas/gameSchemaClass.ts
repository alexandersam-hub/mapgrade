import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import {
  GameText,
  IGame,
  MapGame,
  TemplateGame,
} from '../domains/game.interface';
@Schema({
  toJSON: {
    transform(doc, ret) {
      (ret.id = ret._id), delete ret._id;
      delete ret.__v;
    },
  },
})
export class GameSchemaClass implements IGame {
  id: string;
  @Prop()
  timeRound: number;
  @Prop()
  countTeam: number;
  @Prop()
  timeTask: number;
  @Prop()
  dateGame: string;
  @Prop()
  isDouble: boolean;
  @Prop({ type: Object })
  maps: MapGame;
  @Prop()
  master: string;
  @Prop()
  tasksDouble: string[];
  @Prop()
  tasksSingle: string[];
  @Prop()
  templateGame: TemplateGame[];
  @Prop({ type: Object })
  texts: GameText;
  @Prop()
  title: string;
  @Prop()
  type: string;
  @Prop()
  code: number;
  @Prop()
  image: string;
  @Prop()
  isRequestUserGradeInfo: boolean;
  @Prop()
  isUserTimerView: boolean;
  @Prop()
  isArchive: boolean;
  @Prop()
  isAutoTeam: boolean;
}

export const GameSchema = SchemaFactory.createForClass(GameSchemaClass);
