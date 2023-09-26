import { IDescriptionTask } from './description-task.interface';

export interface MapGame {
  singleMap: number[][];
  doubleMap: number[][];
}

export interface TemplateGame {
  type: string;
  index: number;
  target: string;
}

export interface IGame {
  id: string;
  type: string;
  title: string;
  countTeam: number;
  timeRound: number;
  dateGame: string;
  isDouble: boolean;
  master: string;
  tasksSingle: string[];
  tasksDouble: string[];
  maps: { singleMap: number[][]; doubleMap: number[][] };
  templateGame: { type: string; index: number; target: string }[];
  code: number;
  image: string;
  isRequestUserGradeInfo: boolean;
  isUserTimerView: boolean;
  isArchive: boolean;
  isAutoTeam: boolean;
  logoImg: string;
  descriptionsTasks: IDescriptionTask;
  color: string;
  isViewTitleUser: boolean;
  mapImg: string;
}
