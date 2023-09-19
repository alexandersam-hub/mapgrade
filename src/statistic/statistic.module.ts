import { Module } from '@nestjs/common';
import { StatisticService } from './statistic.service';
import { StatisticController } from './statistic.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { StatisticSchema } from './schemas/statistic';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'statistic', schema: StatisticSchema }]),
  ],
  providers: [StatisticService],
  controllers: [StatisticController],
  exports: [StatisticService],
})
export class StatisticModule {}
