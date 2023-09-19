import { IUserGradeInfo } from './user-grade-info.interface';

export class UserGradeInfoDto implements IUserGradeInfo {
  age: string;
  gender: string;
  user: string;
  date: Date;
}
