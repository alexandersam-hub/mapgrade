import { IsNotEmpty } from "class-validator";
import {ITask} from "./task.interface";

export class TaskDto implements ITask{
  id: string
  description: string;
  duration: number;
  localName: string;

  @IsNotEmpty()
  title: string;
  @IsNotEmpty()
  type: string;
}