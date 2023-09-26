import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { configServer } from './config';
import { TaskModule } from './task/task.module';
import { GradeModule } from './grade/grade.module';
import { GameModule } from './game/game.module';
import { GameProcessModule } from './game-process/game-process.module';
import { StatisticModule } from './statistic/statistic.module';
import { UserGradeInfoModule } from './user-grade-info/user-grade-info.module';
import { ImageRoutingModule } from './image-routing/image-routing.module';
import { ExcelGenerateModule } from './excel-generate/excel-generate.module';
import { TypeGameModule } from './type-game/type-game.module';

@Module({
  imports: [
    ExcelGenerateModule,
    ImageRoutingModule,
    GradeModule,
    UserModule,
    TaskModule,
    GameModule,
    MongooseModule.forRoot(configServer.dbConnectString),
    GameProcessModule,
    StatisticModule,
    UserGradeInfoModule,
    TypeGameModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
