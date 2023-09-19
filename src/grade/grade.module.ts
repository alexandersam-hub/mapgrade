import { Module } from '@nestjs/common';
import { GradeController } from './grade.controller';
import { MongooseModule } from '@nestjs/mongoose';

import { SupportServicesModule } from '../support-services/support-services.module';
import { GradeService } from './grade.service';
import { GradeSchema } from './schemas/grade-schema.class';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'grade', schema: GradeSchema }]),
    SupportServicesModule,
  ],
  providers: [GradeService],
  controllers: [GradeController],
  exports: [GradeService],
})
export class GradeModule {}
