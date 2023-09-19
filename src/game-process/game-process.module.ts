import { Module } from '@nestjs/common';
import { GameProcessGateway } from './game-process.gateway';
import { GameProcessService } from './game-process.service';
import { GameModule } from '../game/game.module';
import { UserModule } from '../user/user.module';
import { GameProgressRoutingService } from './game-process/game-progress-routing.service';
import { TaskModule } from '../task/task.module';
import { GradeModule } from '../grade/grade.module';
import { UserGradeInfoModule } from '../user-grade-info/user-grade-info.module';
import { StatisticModule } from '../statistic/statistic.module';
import { GameProcessController } from './game-process.controller';

@Module({
  providers: [
    GameProcessGateway,
    GameProcessService,
    GameProgressRoutingService,
  ],
  imports: [
    GameModule,
    UserModule,
    TaskModule,
    GradeModule,
    StatisticModule,
    UserGradeInfoModule,
  ],
  controllers: [GameProcessController],
})
export class GameProcessModule {}
