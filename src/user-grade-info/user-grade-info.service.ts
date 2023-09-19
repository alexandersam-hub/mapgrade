import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserGradeInfo } from './schemas/user-grade-info.schema';
import { IUserGradeInfo } from './domains/user-grade-info.interface';

@Injectable()
export class UserGradeInfoService {
  constructor(
    @InjectModel('user_grade_info')
    private readonly userGradeInfoModel: Model<UserGradeInfo>,
  ) {}

  public async create(userGradeInfo: IUserGradeInfo): Promise<IUserGradeInfo> {
    return this.userGradeInfoModel.create(userGradeInfo);
  }

  public async delete(userId: string): Promise<IUserGradeInfo> {
    return this.userGradeInfoModel.findByIdAndRemove({ user: userId });
  }
  public async get(userId: string): Promise<IUserGradeInfo> {
    return this.userGradeInfoModel.findOne({ user: userId });
  }
}
