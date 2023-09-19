import { ICodeGame } from '../domains/code-game.interface';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class CodeGameSchemaClass implements ICodeGame {
  @Prop()
  code: number;
}

export const CodeGameSchema = SchemaFactory.createForClass(CodeGameSchemaClass);
