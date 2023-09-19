import { Module } from '@nestjs/common';
import { UserGradeInfoService } from './user-grade-info.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserGradeInfoSchema } from './schemas/user-grade-info.schema';

@Module({
  providers: [UserGradeInfoService],
  imports: [
    MongooseModule.forFeature([
      { name: 'user_grade_info', schema: UserGradeInfoSchema },
    ]),
  ],
  exports: [UserGradeInfoService],
})
export class UserGradeInfoModule {}
