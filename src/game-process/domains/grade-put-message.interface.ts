export interface IGradePutMessage {
  game: string;
  user: string;
  team: number;
  type: string;
  answer: number[];
  position: number;
  grade: string;
}
