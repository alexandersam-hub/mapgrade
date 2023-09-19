import { IsNotEmpty } from 'class-validator';
import { ICriteria, IGrade } from './grade.interface';

export class GradeDto implements IGrade {
  id: string;
  criteria: ICriteria[];
  @IsNotEmpty()
  question: string;
  @IsNotEmpty()
  title: string;
}
