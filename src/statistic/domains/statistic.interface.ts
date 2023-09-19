import { IGrade } from '../../grade/domains/grade.interface';

export interface IStatistic {
  id: string;
  game: string;
  result: IStatisticResult[];
}
export interface IStatisticRound {
  userCode: string;
  answer: number[];
}
export interface IStatisticResult {
  position: number;
  grade: IGrade;
  statistics: IStatisticRound[];
}

export class StatisticResult {
  position: number;
  grade: IGrade;
  statistics: { userCode: string; answer: number[] }[];
  constructor(position: number) {
    this.position = position;
    this.statistics = [];
  }
}
