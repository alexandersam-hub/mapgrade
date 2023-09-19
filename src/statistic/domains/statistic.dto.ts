import { IStatistic, IStatisticResult } from './statistic.interface';

export class StatisticDto implements IStatistic {
  game: string;
  grade: string;
  id: string;
  result: IStatisticResult[];
  user: number;
}
