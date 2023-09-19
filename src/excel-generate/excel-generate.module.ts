import { Module } from '@nestjs/common';
import { ExcelGenerateController } from './excel-generate.controller';
import { ExcelGenerateService } from './excel-generate.service';
import { StatisticModule } from '../statistic/statistic.module';
import { GameModule } from '../game/game.module';
import { UserGradeInfoModule } from '../user-grade-info/user-grade-info.module';

@Module({
  imports: [StatisticModule, GameModule, UserGradeInfoModule],
  controllers: [ExcelGenerateController],
  providers: [ExcelGenerateService],
})
export class ExcelGenerateModule {}
