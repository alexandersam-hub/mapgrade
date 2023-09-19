import { ITask } from '../../task/items/task.interface';

export class AdditionalTask implements ITask {
  description: string;
  duration: number;
  id: string;
  localName: string;
  title: string;
  type: string;
  constructor(type: string, text: string) {
    this.id = '';
    this.duration = 0;
    this.description = text;
    this.localName = 'additional';
    this.title = '';
    this.type = type;
  }
}
