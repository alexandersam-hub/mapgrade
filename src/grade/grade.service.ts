import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { GradeDto } from './domains/grade.dto';

@Injectable()
export class GradeService {
  constructor(@InjectModel('grade') readonly taskModel: Model<GradeDto>) {}
  async getAll() {
    return this.taskModel.find();
  }
  async getGradeById(id: string) {
    const grade = await this.taskModel.findById(id);
    if (!grade) return null;
    return JSON.parse(JSON.stringify(grade));
  }

  async create(grade: GradeDto) {
    const oldGrade = await this.taskModel.findOne({ username: grade.title });
    if (oldGrade) {
      throw new BadRequestException(
        'Пользоветль с указанным именем уже существует',
      );
    }
    grade.id = new mongoose.Types.ObjectId().toString();
    return this.taskModel.create(grade);
  }

  async update(grade: GradeDto) {
    const oldTask = await this.taskModel.findById(grade.id);
    if (!oldTask) {
      throw new BadRequestException('Испытание не существует');
    }
    await this.taskModel.findByIdAndUpdate(grade.id, grade);
    return this.taskModel.findById(grade.id);
  }

  async delete(gradeId: string) {
    return this.taskModel.findByIdAndRemove(gradeId);
  }
}
