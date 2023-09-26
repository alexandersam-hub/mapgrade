import { Module } from '@nestjs/common';
import { TaskController } from './task.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { TaskSchema } from './schemas/task.schema';
import { SupportServicesModule } from '../support-services/support-services.module';
import { TaskService } from './task.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'task', schema: TaskSchema }]),
    SupportServicesModule,
  ],
  providers: [TaskService],
  controllers: [TaskController],
  exports: [TaskService],
})
export class TaskModule {}
