export interface ICriteria {
  text: string;
}

export interface IGrade {
  id: string;
  title: string;
  question: string;
  criteria: ICriteria[];
}
