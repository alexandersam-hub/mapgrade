export interface IDescriptionTask {
  start: {
    text: string;
    img: string;
    link: string;
  };
  finish: {
    text: string;
    img: string;
    link: string;
  };
  task: {
    taskId: string;
    img: string;
    link: string;
    title: string;
  }[];
}
