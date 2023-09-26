import { ITypeGame } from './type-game.interface';
import { IsNotEmpty } from 'class-validator';

export class TypeGameDto implements ITypeGame {
  id: string;
  @IsNotEmpty({ message: 'не заполнен тип' })
  type: string;
}
