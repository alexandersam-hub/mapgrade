import { IsNotEmpty } from 'class-validator';
import { GameText, IGame, TemplateGame } from './game.interface';

export class GameDto implements IGame {
  id: string;
  countTeam: number;
  timeRound: number;
  dateGame: string;
  isDouble: boolean;
  maps: { singleMap: number[]; doubleMap: number[] };
  master: string;
  tasksDouble: string[];
  tasksSingle: string[];
  @IsNotEmpty({ message: 'Не заполнено поле заголовок' })
  title: string;
  @IsNotEmpty({ message: 'Не заполнено поле тип игры' })
  type: string;
  templateGame: TemplateGame[];
  texts: GameText;
  code: number;
  image: string;
  isRequestUserGradeInfo: boolean;
  isUserTimerView: boolean;
  isArchive: boolean;
  isAutoTeam: boolean;
}
