export interface MapGame {
  singleMap: number[];
  doubleMap: number[];
}

export interface TemplateGame {
  type: string;
  index: number;
  target: string;
}

export interface GameText {
  startText: string;
  finishText: string;
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
  maps: MapGame;
  templateGame: TemplateGame[];
  texts: GameText;
  code: number;
  image: string;
  isRequestUserGradeInfo: boolean;
  isUserTimerView: boolean;
  isArchive: boolean;
  isAutoTeam: boolean;
}
